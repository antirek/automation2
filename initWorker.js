const {Worker, Queue, QueueScheduler, } = require('bullmq');
const {logSteptask} = require('./logsteptask');

async function passStepTaskToWorker (stepTask) {
  await logSteptask(stepTask, 'init', 'start');

  switch (stepTask.step.type) {
    case 'executor': {
      console.log('executor');
      console.log('worker', stepTask.step.worker, stepTask.input);

      const executorQueue = new Queue('executor');
      await executorQueue.add('executor', stepTask, {removeOnComplete: true});

      break;
    }

    case 'selector': {
      console.log('selector');
      console.log('worker', stepTask.step.worker, stepTask.input);

      const selectorQueue = new Queue('selector');
      await selectorQueue.add('selector', stepTask, {removeOnComplete: true});

      break;
    }

    case 'delay': {
      console.log('delay');

      const delayQueueScheduler = new QueueScheduler('delay');
      const delayQueue = new Queue('delay');

      await delayQueue.add('delay', stepTask, { 
        delay: 5000,
        removeOnComplete: true,
      });
      break;
    }

    default: {
      console.log('default');
    }    
  }

  await logSteptask(stepTask, 'init', 'end');
}

const worker = new Worker('init', async job => {
  try {
    console.log('task', job.data);
    const stepTask = job.data;

    passStepTaskToWorker(stepTask);
  } catch (e) {
    console.log(e);
  }
});
