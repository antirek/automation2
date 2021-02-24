const {Worker, Queue} = require('bullmq');
const { nanoid } = require('nanoid');
const Redis = require('ioredis');

const { Store } = require('./../store');
const { Flow } = require('./flow');
const { StepWorker } = require('./stepWorker');
const config = require('config');

const connection = new Redis(config.redis);
const store = new Store({client: connection});

const initQueue = new Queue('init', {connection});

class ReadyWorker extends StepWorker {
  step = 'ready';

  async setVarsToStore (stepTask, data) {}
  async getVarsFromStore (stepTask) {}

  async do (stepTask) {
    const flow = new Flow(stepTask.flowDefinition);

    console.log('steptask', stepTask);
    console.log('steptask next', stepTask.step.next);
  
    if (stepTask.stepperId > 50) {
      console.log('!! maybe attention cyclic');
      return;
    }
  
    const nextStepId = stepTask.next;    
    const nextStep = flow.getStepById(nextStepId);
  
    let message;

    if (nextStep) {
      console.log('nextstep def', nextStep);
  
      const nextSteptask = {
        stepTaskId: nanoid(),
        taskId: stepTask.taskId,
        step: nextStep,
        stepId: stepTask.step.id,
        flowDefinition: stepTask.flowDefinition,
        stepperId: stepTask.stepperId + 1,
      };
  
      console.log('created next step', nextSteptask);
  
      await initQueue.add('init', nextSteptask, {removeOnComplete: true, });
      message = 'go to next step';
    }
  
    if (!nextStep) {
      message = 'task ready, send to ready task queue...';
    }
  
    return {result: message, nextStepId };
  }

  async passResultToReadyQueue (stepTask) {}
}

const readyWorker = new ReadyWorker({store, connection});

new Worker('ready', async (job) => {
  await readyWorker.process(job);
});
