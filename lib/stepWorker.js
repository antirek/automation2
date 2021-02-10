const {Worker, Queue, QueueScheduler} = require('bullmq');

const {logSteptask} = require('./logsteptask');

class StepWorker {
  constructor ({readyQueueName, type, workerName}) {
    const myQueueScheduler = new QueueScheduler(readyQueueName);
    this.readyQueue = new Queue(readyQueueName);
    this.type = type;
    this.workerName = workerName;
    this.logSteptask = logSteptask;
  }

  async process (job) {
    console.log(job.data);
    const stepTask = job.data;

    const params = stepTask.step.params;    // хранятся во flowDefinition
    const input = stepTask.input;           // от предыдущего шага

    await this.logSteptask(stepTask, this.workerName, 'start', 'info', JSON.stringify({params, input}));
    
    const result = stepTask.step.worker + ' - hello - worked';

    stepTask.result = result;
    console.log('result', result);

    this.readyQueue.add('executor', stepTask, {removeOnComplete: true, });
    console.log('result', result);
    await this.logSteptask(stepTask, this.workerName, 'end', 'info', JSON.stringify({result}));
  }
}

module.exports = {StepWorker};