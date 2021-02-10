
const {Worker, Queue} = require('bullmq');
const config = require('config');
const { nanoid } = require('nanoid');

const {logSteptask} = require('./logsteptask');
const {Flow } = require('./flow');

const initQueue = new Queue('init');

new Worker('ready', async job => {
  let message;
  console.log(job.data);
  const stepTask = job.data;
  const flow = new Flow(stepTask.flowDefinition);

  await logSteptask(stepTask, 'stepReady', 'start');

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
    if (!nextStepId) return;

    return flow.getStepById(nextStepId);
  }

  const nextStep = getNextStep(stepTask);

  if (nextStep) {
    console.log('nextstep def', nextStep);

    const nextSteptask = {
      stepTaskId: nanoid(),
      taskId: stepTask.taskId,
      step: nextStep,
      stepId: stepTask.step.id,
      input: stepTask.result,
      flowDefinition: stepTask.flowDefinition,
      stepperId: stepTask.stepperId + 1,
    };

    console.log('created next step', nextSteptask);

    await initQueue.add('init', nextSteptask);
    message = 'go to next step';
  }

  if (!nextStep) {
    message = 'send task ready';
  }

  await logSteptask(stepTask, 'stepReady', 'end', 'info', message);
});