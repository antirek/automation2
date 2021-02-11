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

  async preprocess (stepTask) {
    const params = stepTask.step.params;    // хранятся во flowDefinition
    const input = stepTask.input;           // от предыдущего шага

    await this.logSteptask(stepTask, this.workerName, 'start', 'info', JSON.stringify({params, input}));
  }

  async do (params, input) {
    return `${this.workerName} done`;
  }

  async postprocess (stepTask) {
    await this.logSteptask(stepTask, this.workerName, 'end', 'info', JSON.stringify({result: stepTask.result}));
  }

  async passResultToReadyQueue (stepTask) {
    this.readyQueue.add('executor', stepTask, {removeOnComplete: true, });
  }

  async process (job) {
    console.log(job.data);
    const stepTask = job.data;    

    const params = stepTask.step.params;    // хранятся во flowDefinition
    const input = stepTask.input;           // от предыдущего шага

    await this.preprocess(stepTask);

    const result = await this.do(params, input);
    console.log('result', result);

    stepTask.result = result;
    await this.passResultToReadyQueue(stepTask);
    
    await this.postprocess(stepTask);
  }
}

module.exports = {StepWorker};