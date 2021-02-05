

const mongoose = require('mongoose');
const config = require('config');

const flows = require('./flow');
const {createModels} = require('./models');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {StepTask} = createModels(dbConn);

const getFlowDefinition = (id) => {
  return flows.find(flow => flow.id === id);
}

const getStepById = (flowDefinition, stepId) => {
  if (!flowDefinition || !flowDefinition.steps) {
    return;
  }
  return flowDefinition.steps.find(step => step.id === stepId);
}


const executor = () => {return {data:1}};
const selector = (data) => {return {next: 'executor-email'}};

async function start () {
  const stepTask = await StepTask.findOne({state: 'init'});
  
  if(!stepTask) {
    console.log('no init steptasks');
    return;
  }
  const flow = getFlowDefinition(stepTask.flowId);  

  switch (stepTask.type) {
    case 'start': {
      console.log('start');

      const nextStepDefinition = getStepById(flow, stepTask.next);
      console.log('nextstep def', nextStepDefinition)

      const nextSteptask = new StepTask({
        stepId: stepTask.next,
        type: nextStepDefinition.type,
        worker: nextStepDefinition.worker,
        flowId: flow.id,
        input: stepTask.input,
        initTime: (new Date()).toString(),
        executionTime: '',
        state: 'init',
        next: nextStepDefinition.next,
      });

      await nextSteptask.save();

      stepTask.state = 'end';
      stepTask.finishTime = (new Date()).toString(),
      await stepTask.save();
      console.log('start ready');
      break;
    }

    case 'executor': {
      console.log('executor');
      console.log('worker', stepTask.worker, stepTask.input);

      
      const result = executor();


      if(stepTask.next) {
        //do next step task
        const nextStepDefinition = getStepById(flow, stepTask.next);
        console.log('nextstep def', nextStepDefinition)
        
        console.log('step task', stepTask);
        const nextSteptask = new StepTask({
          stepId: stepTask.next,
          type: nextStepDefinition.type,
          flowId: flow.id,
          input: JSON.stringify(result),
          initTime: (new Date()).toString(),
          executionTime: '',
          state: 'init',
        });

        await nextSteptask.save();
      }
      
      stepTask.state = 'end';
      stepTask.output = JSON.stringify(result);
      stepTask.finishTime = (new Date()).toString(),

      await stepTask.save();
      console.log('executor ready');
      break;
    }

    case 'selector': {
      console.log('executor');
      console.log('worker', stepTask.worker, stepTask.input);

      const selectorResult = selector(stepTask.input);

      if (selectorResult.next) {
        const nextStepDefinition = getStepById(flow, selectorResult.next);
        console.log('nextstep def', nextStepDefinition)

        const nextSteptask = new StepTask({
          stepId: stepTask.next,
          type: nextStepDefinition.type,
          flowId: flow.id,
          input: JSON.stringify(selectorResult),
          initTime: (new Date()).toString(),
          executionTime: '',
          state: 'init',
        });

        await nextSteptask.save();
      }

      stepTask.state = 'end';
      stepTask.output = JSON.stringify(selectorResult);
      stepTask.finishTime = (new Date()).toString(),

      await stepTask.save();
      console.log('selector ready');
      break;



    }

    default: {
      console.log('default') 
    }
  }
}


(async function (){
  await start();
})();