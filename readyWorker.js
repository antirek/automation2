const mongoose = require('mongoose');
const {Worker, Queue} = require('bullmq');
const {createModels} = require('./models');
const config = require('config');
const {Flow } = require('./flow');
const { nanoid } = require('nanoid');

const initQueue = new Queue('init');

const dbConn = mongoose.createConnection(config.mongodb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  
const worker = new Worker('ready', async job => {
  console.log(job.data);
  const stepTask = job.data;
  const flow = new Flow(stepTask.flowDefinition);

  console.log('steptask', stepTask);
  console.log('steptask next', stepTask.step.next);

  if (stepTask.stepperId > 50) {
    console.log('!! maybe attention cyclic');
    return;
  }

  const getNextStep = (stepTask) => {
    let nextStepId;
    if (stepTask.step.type === 'selector' && stepTask.result) {
      nextStepId = stepTask.result;
    } else {
      nextStepId = stepTask.step.next;
    }
    console.log('next step id', nextStepId);
    return flow.getStepById(nextStepId);
  }

  const nextStep = getNextStep(stepTask);

  if (nextStep) {
    console.log('nextstep def', nextStep);

    const nextSteptask = {
      stepTaskId: nanoid(),
      taskId: stepTask.taskId,
      step: nextStep,
      input: stepTask.result,
      flowDefinition: stepTask.flowDefinition,
      stepperId: stepTask.stepperId + 1,
    };

    console.log('created next step', nextSteptask);

    await initQueue.add('init', nextSteptask);
  }
});