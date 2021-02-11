const mongoose = require('mongoose');
const config = require('config');
const { Queue } = require('bullmq');
const { nanoid } = require('nanoid');

const flowDefinitions = require('./flowDefinitions');
const { Flow } = require('./lib/flow');
const { createModels } = require('./models/models');

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

  const firstStep = flow.getFirstStep();
  console.log('first step', firstStep);

  const stepTask = {
    stepTaskId: nanoid(),
    step: firstStep,
    taskId: task.taskId,
    input: inputData,
    flowDefinition,
    stepperId: 0,
  };

  initQueue.add('init', stepTask, {removeOnComplete: true});
}

const inputData = {from: '2422', to: '2344', account: '2', };
const flowId = 'test2';

(async function () {
  await startTask(flowId, inputData)
})();