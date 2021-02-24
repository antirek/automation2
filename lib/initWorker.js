const {Worker, Queue} = require('bullmq');
const Redis = require('ioredis');
const {logSteptask} = require('./logsteptask');
const config = require('config');

const connection = new Redis(config.redis);

async function passStepTaskToWorker (stepTask) {
  await logSteptask(stepTask, 'init', 'start');
  const worker = stepTask.step.worker;

  console.log('worker', stepTask.step.worker, stepTask.input);

  const executorQueue = new Queue(worker, {connection});
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
}, {connection});

console.log('start', config);