const {Worker, Queue} = require('bullmq');

const worker = new Worker('executor', async job => {
  console.log(job.data);
  const task = job.data;

  const result = 'hello';
  task.result = result;

  console.log('result', result);
  const readyQueue = new Queue('ready');
  readyQueue.add('executor', task);
});
