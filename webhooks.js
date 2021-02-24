const mongoose = require('mongoose');
const config = require('config');
const { Queue } = require('bullmq');
const { nanoid } = require('nanoid');
const Redis = require('ioredis');
const express = require('express');
const dayjs = require('dayjs');

const {Store} = require('./store');
const flowDefinitions = require('./flowDefinitions');
const { Flow } = require('./lib/flow');
const { createModels } = require('./models/models');

const connection = new Redis(config.redis);
const store = new Store({client: connection});

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const {Task, Webhook, } = createModels(dbConn);

const app = express();
app.use(express.json({limit: '2mb'}));

app.post('/webhook/:webhookId', async (req, res) => {
  console.log('hello world');
  const {webhookId} = req.params;
  const inputData = req.body;
  const webhook = await Webhook.findOne({webhookId});
  if (!webhook) {
    console.log('no webhook', webhookId);
    return res.json({});
  }
  const flowId = webhook.flowId;
  await startTask(flowId, webhookId, inputData);
  res.json({status:"OK"});
});

const getFlowDefinition = (id) => {
  return flowDefinitions.find(flow => flow.id === id);
}

const initQueue = new Queue('init', {connection});

async function startTask (flowId, webhookId, inputData) {
  const flowDefinition = getFlowDefinition(flowId);
  const flow = new Flow(flowDefinition);

  const task = new Task({
    flowDefinition: JSON.stringify(flowDefinition),
    webhookId,
    initData: inputData,
    createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });
  await task.save();

  const varsIn = flow.getFirstStepVarsIn();
  for (const varIn of varsIn) {
    await store.setData(task.taskId, varIn, inputData[varIn]);
  }

  const firstStep = flow.getFirstStep();
  console.log('first step', firstStep);

  const stepTask = {
    stepTaskId: nanoid(),
    step: firstStep,
    taskId: task.taskId,
    flowDefinition,
    stepperId: 0,
  };

  initQueue.add('init', stepTask, {removeOnComplete: true});
}

app.listen(3003, async () => {
  console.log('started');
});
