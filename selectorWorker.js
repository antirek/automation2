const {Worker, Queue} = require('bullmq');
const {logSteptask} = require('./logsteptask');

const worker = new Worker('selector', async job => {    
  console.log(job.data);
  const stepTask = job.data;
  await logSteptask(stepTask, 'selector', 'start');

  const result = 'successmodificator-email1';
  stepTask.result = result;

  console.log('result', result);
  const readyQueue = new Queue('ready');
  readyQueue.add('ready', stepTask);

  await logSteptask(stepTask, 'selector', 'end', 'info', result);
});
