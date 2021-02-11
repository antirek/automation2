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

  const nextStepId = stepTask.next;
  const nextStep = flow.getStepById(nextStepId);

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

    await initQueue.add('init', nextSteptask, {removeOnComplete: true, });
    message = 'go to next step';
  }

  if (!nextStep) {
    message = 'task ready, send to ready task queue...';
  }

  await logSteptask(stepTask, 'stepReady', 'end', 'info', JSON.stringify({nextStepId, message}));
});