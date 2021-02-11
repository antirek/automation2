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
    this.store = props.store;
  }

  async preprocess (stepTask) {
    const params = stepTask.step.params;    // хранятся во flowDefinition
    const input = stepTask.input;           // от предыдущего шага

    await this.logSteptask(stepTask, this.workerId, 'start', 'info', JSON.stringify({params, input}));
  }

  async do (stepTask) {
    const result = `${this.workerId} done`;
    const next = stepTask.step.next;
    return {result, next};
  }

  async postprocess (stepTask) {
    await this.logSteptask(stepTask, this.workerId, 'end', 'info', JSON.stringify({result: stepTask.result}));
  }

  async passResultToReadyQueue (stepTask) {
    this.readyQueue.add('ready', stepTask, {removeOnComplete: true, });
  }

  async process (job) {
    const stepTask = job.data;

    await this.preprocess(stepTask);

    let {result, next} = await this.do(stepTask);

    if(!next) {
      next = stepTask.step.next;
    }

    stepTask.result = result;
    stepTask.next = next;
    await this.passResultToReadyQueue(stepTask);
    
    await this.postprocess(stepTask);
  }
}

module.exports = {StepWorker};