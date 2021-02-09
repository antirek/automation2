const {Worker, Queue} = require('bullmq');

const worker = new Worker('selector', async job => {
  console.log(job.data);
  const task = job.data;

  const result = 'exec-httprequest';
  task.result = result;

  console.log('result', result);
  const readyQueue = new Queue('ready');
  readyQueue.add('ready', task);
});
