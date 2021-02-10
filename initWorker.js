const {Worker, Queue, QueueScheduler, } = require('bullmq');
const {logSteptask} = require('./logsteptask');

async function passStepTaskToWorker (stepTask) {
  await logSteptask(stepTask, 'init', 'start');
  const worker = stepTask.step.worker;

  console.log('worker', stepTask.step.worker, stepTask.input);

  const executorQueue = new Queue(worker);
  await executorQueue.add(worker, stepTask, {removeOnComplete: true});

  await logSteptask(stepTask, 'init', 'end');
}

new Worker('init', async job => {
  try {
    console.log('task', job.data);
    const stepTask = job.data;

    passStepTaskToWorker(stepTask);
  } catch (e) {
    console.log(e);
  }
});