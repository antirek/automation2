const {Worker, Queue} = require('bullmq');

const worker = new Worker('delay', async job => {
  console.log(job.data);
  const task = job.data;

  const result = 'delay';
  task.result = result;

  console.log('result', result);
  const readyQueue = new Queue('ready');
  readyQueue.add('ready', task);
});
