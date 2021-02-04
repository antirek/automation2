

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

const executor = () => {return {data:1}};

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
      const nextSteptask = new StepTask({
        stepId: stepTask.next,
        flowId: flow.id,
        input: stepTask.input,
        initTime: (new Date()).toString(),
        executionTime: '',
        state: 'init',
      });

      await nextSteptask.save();
      stepTask.state = 'end';
      stepTask.finishTime = (new Date()).toString(),
      await stepTask.save();
      console.log('ready');
      break;
    }
    case 'executor': {
      console.log('executor');
      console.log('worker', stepTask.worker, stepTask.input)
      const result = executor();

      const nextSteptask = new StepTask({
        stepId: stepTask.next,
        flowId: flow.id,
        input: result,
        initTime: (new Date()).toString(),
        executionTime: '',
        state: 'init',
      });

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