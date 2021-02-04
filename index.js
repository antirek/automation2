const mongoose = require('mongoose');
const config = require('config');

const flows = require('./flow');
const {createModels} = require('./models');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {StepTask} = createModels(dbConn);


const getFlowDefinition = (id) => {
  return flows.find(flow => flow.id === id);
}

const getFirstStep = (flowDefinition) => {
  const steps = flowDefinition.steps;
  if (!steps && !steps[0]) {
    return;
  }
  return steps[0];
}

function start () {
  const inputData = {var1: '1'};

  const flow = getFlowDefinition('test');
  console.log('flow test', flow, inputData);

  const firstStep = getFirstStep(flow);
  console.log('first step', firstStep);

  const stepTask = new StepTask({
    stepId: 'start',
    type: 'start',
    flowId: flow.id,
    input: JSON.stringify(inputData),
    initTime: (new Date()).toString(),
    executionTime: '',
    state: 'init',
    next: firstStep.next,
  });

  stepTask.save();
}

start();
