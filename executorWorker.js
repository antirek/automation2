const {Worker, Queue} = require('bullmq');
const {logSteptask} = require('./logsteptask');

const worker = new Worker('executor', async job => {
  console.log(job.data);
  const stepTask = job.data;

  await logSteptask(stepTask, 'executor', 'start');
  const result = 'hello';
  stepTask.result = result;

  console.log('result', result);
  const readyQueue = new Queue('ready');
  readyQueue.add('executor', stepTask, {removeOnComplete: true, });

  await logSteptask(stepTask, 'executor', 'end', 'info', result);
});
