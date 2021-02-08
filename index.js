const mongoose = require('mongoose');
const config = require('config');

const flowDefinitions = require('./flowDefinitions');
const {Flow} = require('flow');
const { createModels } = require('./models');
const { Queue } = require('bullmq');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {StepTask, Task} = createModels(dbConn);

const getFlowDefinition = (id) => {
  return flowDefinitions.find(flow => flow.id === id);
}

const initQueue = new Queue('init');

function startTask (flowId, inputData) {
  const flowDefinition = getFlowDefinition(flowId);
  const flow = new Flow(flowDefinition);

  const task = new Task({flowDefinition});
  await task.save();

  const firstStep = flow.getFirstStep();
  console.log('first step', firstStep);

  const stepTask = new StepTask({
    step: firstStep,
    input: JSON.stringify(inputData),
    state: 'init',
  });

  initQueue.add('init', stepTask.toObject());
}

const inputData = {var1: '1'};
const flowId = 'test';

startTask(flowId, inputData);
