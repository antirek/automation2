const {Worker, Queue} = require('bullmq');
const {StepWorker} = require('./stepWorker');
const {SendmailWorker} = require('./sendmailWorker');


const stepWorker1 = new StepWorker({
  workerName: 'executor1',
  readyQueueName: 'ready',
  type: 'executor', 
});

const sendMailWorker1 = new SendmailWorker({
  workerName: 'executor1',
  readyQueueName: 'ready',
  type: 'executor',  
})

new Worker('executor', async (job) => {
  await sendMailWorker1.process(job);
});