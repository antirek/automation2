const {Worker, Queue} = require('bullmq');
const {logSteptask} = require('./logsteptask');

new Worker('executor', async job => {
  console.log(job.data);
  const stepTask = job.data;

  await logSteptask(stepTask, 'executor', 'start');
    
  const result = stepTask.step.worker + ' - hello - worked';
  stepTask.result = result;

  console.log('result', result);
  const readyQueue = new Queue('ready');
  readyQueue.add('executor', stepTask, {removeOnComplete: true, });

  await logSteptask(stepTask, 'executor', 'end', 'info', result);
});
