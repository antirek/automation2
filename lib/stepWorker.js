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

  async preprocess (stepTask, input) {
    const params = stepTask.step.params;    // хранятся во flowDefinition
    //const input = stepTask.input;           // от предыдущего шага

    await this.logSteptask(stepTask, this.workerId, 'start', 'info', JSON.stringify({params, input}));
  }

  getVarsIn () {
    return ['name', 'age'];
  }

  getVarsOut () {
    return ['selfie']
  }

  // переопределяется реализацией
  async do (stepTask, storeData) {
    const result = `${this.workerId} done`;
    const next = stepTask.step.next;
    return {result, next};
  }

  async postprocess (stepTask, result) {
    await this.logSteptask(stepTask, this.workerId, 'end', 'info', JSON.stringify({result}));
  }

  async passResultToReadyQueue (stepTask) {
    this.readyQueue.add('ready', stepTask, {removeOnComplete: true, });
  }

  async getVarsFromStore (stepTask) {
    const data = {}
    const varsIn = (stepTask.step && stepTask.step.vars && stepTask.step.vars.in ) ? 
      stepTask.step.vars.in : null;
    console.log('get from store', varsIn);
    if (varsIn && Array.isArray(varsIn)) {
      for (const varIn of varsIn) {
        const varInStep = varIn.split(':')[0];
        const varInStore = varIn.split(':')[1] ? varIn.split(':')[1] : varInStep;
        console.log('get vars by schema:', {varInStep, varInStore});
        data[varInStep] = await this.store.getData(stepTask.taskId, varInStore);
      }
    }
    return data;
  }

  async setVarsToStore (stepTask, data) {
    const varsOut = (stepTask.step && stepTask.step.vars && stepTask.step.vars.out ) ? 
      stepTask.step.vars.out : null;
    console.log('set to store', JSON.stringify(varsOut));
    if (varsOut && Array.isArray(varsOut)) {
      for (const varOut of varsOut) {
        const varOutStep = varOut.split(':')[0];
        const varOutStore = varOut.split(':')[1] ? varOut.split(':')[1] : varOutStep;

        const stringData = data[varOutStep];
        console.log('>>>>>>> ', stepTask.taskId, varOutStore, stringData);
        await this.store.setData(stepTask.taskId, varOutStore, stringData);
      }
    }
  }

  async process (job) {
    const stepTask = job.data;
    console.log('ff stepTask', stepTask);

    const storeData = await this.getVarsFromStore(stepTask);
    await this.preprocess(stepTask, storeData);

    let {result, next} = await this.do(stepTask, storeData);

    if(!next) {
      next = stepTask.step.next;
    }

    await this.setVarsToStore(stepTask, result);

    //stepTask.result = result;   // если результат выводить в переменные хранилища, возможно передавать и не надо ??
    stepTask.next = next;

    await this.passResultToReadyQueue(stepTask);
    await this.postprocess(stepTask, {result, next});
  }
}

module.exports = {StepWorker};