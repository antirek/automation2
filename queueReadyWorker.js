const mongoose = require('mongoose');
const {Worker, Queue} = require('bullmq');
const {createModels} = require('./models');
const config = require('config');

const flows = require('./flowDefinitions');

const getFlowDefinition = (id) => {
  return flows.find(flow => flow.id === id);
}

const getStepById = (flowDefinition, stepId) => {
  if (!flowDefinition || !flowDefinition.steps) {
    return;
  }
  return flowDefinition.steps.find(step => step.id === stepId);
}

const dbConn = mongoose.createConnection(config.mongodb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  
const {StepTask} = createModels(dbConn);

const worker = new Worker('ready', async job => {
  console.log(job.data);
  const task = job.data;
  const stepTask = await StepTask.findOne({stepTaskId: task.stepTaskId});

  stepTask.state = 'ready';
  stepTask.output = JSON.stringify(task.result);
  await stepTask.save();

  console.log('steptask', stepTask);
  console.log('steptask next', stepTask.next);

  if(stepTask.next) {
    //do next step task
    console.log('prepare next step');
    const flow = getFlowDefinition(stepTask.flowId);
    console.log('flow', flow);
    const nextStepDefinition = getStepById(flow, stepTask.next);

    console.log('nextstep def', nextStepDefinition)
    
    console.log('step task', stepTask);
    const nextSteptask = new StepTask({
      stepId: stepTask.next,
      type: nextStepDefinition.type,
      flowId: flow.id,
      input: JSON.stringify(task.result),
      initTime: (new Date()).toString(),
      state: 'init',
    });

    await nextSteptask.save();
  }
  // create next steptask
});