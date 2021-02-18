const mongoose = require('mongoose');
const config = require('config');
const { Queue } = require('bullmq');
const { nanoid } = require('nanoid');
const Redis = require('ioredis');
const axios = require('axios').default;

const {Store} = require('./store');
const flowDefinitions = require('./flowDefinitions');
const { Flow } = require('./lib/flow');
const { createModels } = require('./models/models');

const client = new Redis();
const store = new Store({client});

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {Task} = createModels(dbConn);

const getFlowDefinition = (id) => {
  return flowDefinitions.find(flow => flow.id === id);
}

const initQueue = new Queue('init');

async function startTask (flowId, inputData) {
  const flowDefinition = getFlowDefinition(flowId);
  const flow = new Flow(flowDefinition);

  const task = new Task({flowDefinition: JSON.stringify(flowDefinition)});
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

const inputData = {calldata: {from: '2422', to: '2344', account: '2', }};
const flowId = 'test2';

 
(async function () {
//  await startTask(flowId, inputData)

  const resp = await axios.post('http://localhost:3003/webhook/hook', inputData);
  console.log('response', resp);

})();





