const {Worker, Queue, QueueScheduler} = require('bullmq');
const {logSteptask} = require('./logsteptask');

class StepWorker {
  constructor ({readyQueueName, type, workerName}) {
    const myQueueScheduler = new QueueScheduler(readyQueueName);
    this.readyQueue = new Queue(readyQueueName);
    this.type = type;
    this.workerName = workerName;
  }

  async process (job) {
    console.log(job.data);
    const stepTask = job.data;
    await logSteptask(stepTask, this.workerName, 'start');
      
    const result = stepTask.step.worker + ' - hello - worked';
    stepTask.result = result;
    console.log('result', result);

    this.readyQueue.add('executor', stepTask, {removeOnComplete: true, });
    console.log('result', result);
    await logSteptask(stepTask, this.workerName, 'end', 'info', result);
  }
}

module.exports = {StepWorker};
