const {Worker, Queue, QueueScheduler} = require('bullmq');
const {nanoid} = require('nanoid');
const {logSteptask} = require('./logsteptask');

class StepWorker {
  type = 'executor';
  constructor (props) {
    const readyQueueName = (props && props.readyQueueName) ? props.readyQueueName : 'ready';
    const myQueueScheduler = new QueueScheduler(readyQueueName);
    this.readyQueue = new Queue(readyQueueName);
    this.workerId = this.constructor.name + '-' + nanoid(8);
    this.logSteptask = logSteptask;
  }

  async preprocess (stepTask) {
    const params = stepTask.step.params;    // хранятся во flowDefinition
    const input = stepTask.input;           // от предыдущего шага

    await this.logSteptask(stepTask, this.workerId, 'start', 'info', JSON.stringify({params, input}));
  }

  async do (params, input) {
    return `${this.workerId} done`;
  }

  async postprocess (stepTask) {
    await this.logSteptask(stepTask, this.workerId, 'end', 'info', JSON.stringify({result: stepTask.result}));
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