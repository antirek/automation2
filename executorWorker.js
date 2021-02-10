const {Worker, Queue} = require('bullmq');
const {StepWorker} = require('./lib/stepWorker');
const {SendmailWorker} = require('./workers/sendmailWorker');
const {DelayWorker} = require('./workers/delayWorker');

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
