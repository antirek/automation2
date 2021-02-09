const {Worker, Queue, QueueScheduler, } = require('bullmq');
// const flowDefinitions = require('./flowDefinitions');

async function passStepTaskToWorker (stepTask) {
  // const flow = getFlowDefinition(stepTask.step.flowId);
  switch (stepTask.step.type) {
    case 'executor': {
      console.log('executor');
      console.log('worker', stepTask.step.worker, stepTask.input);

      const executorQueue = new Queue('executor');
      await executorQueue.add('executor', stepTask);

      break;
    }

    case 'selector': {
      console.log('selector');
      console.log('worker', stepTask.step.worker, stepTask.input);

      // const selectorResult = selector(stepTask.input);
      const selectorQueue = new Queue('selector');
      await selectorQueue.add('selector', stepTask);

      break;
    }

    case 'delay': {
      console.log('delay');

      const delayQueueScheduler = new QueueScheduler('delay');
      const delayQueue = new Queue('delay');

      await delayQueue.add('delay', stepTask, { delay: stepTask.step.params?.delay });
      break;
    }

    default: {
      console.log('default');
    }
  }
}

const worker = new Worker('init', async job => {
  console.log('task', job.data);
  const task = job.data;

  passStepTaskToWorker(task);
});
