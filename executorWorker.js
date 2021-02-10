const {Worker, Queue} = require('bullmq');
const {StepWorker} = require('./stepWorker');
const {SendmailWorker} = require('./sendmailWorker');
const {DelayWorker} = require('./delayWorker');

const stepWorker1 = new StepWorker({
  workerName: 'executor1',
  readyQueueName: 'ready',
  type: 'executor', 
});

const delayWorker1 = new DelayWorker({
  workerName: 'delay1',
  readyQueueName: 'ready',
  type: 'executor', 
});

const sendMailWorker1 = new SendmailWorker({
  workerName: 'executor1',
  readyQueueName: 'ready',
  type: 'executor',  
});

const stepProcessors = [
  {
    queue: 'httprequestExecutor',
    workers: [
      stepWorker1,
    ]
  },
  {
    queue: 'delay',
    workers: [
      delayWorker1,
    ]
  }
]

stepProcessors.map(processor => {
  processor.workers.map(worker => {
    new Worker(processor.queue, async (job) => {
      await worker.process(job);
    })
  })  
})


/*
new Worker('httprequestExecutor', async (job) => {
  await stepWorker1.process(job);
});

new Worker('delay', async (job) => {
  await delayWorker1.process(job);
});

*/