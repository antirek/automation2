const mongoose = require('mongoose');
const config = require('config');

const { createModels } = require('./models');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {StepTaskLog} = createModels(dbConn);

const logSteptask = async (stepTask, worker, state, level = 'info', data = '') => {
  console.log('step task in log func', stepTask);
  const stepTaskLog = new StepTaskLog({
    taskId: stepTask.taskId,
    stepTaskId: stepTask.stepTaskId,
    stepId: stepTask.step.id,
    time: (new Date()).toString(),
    flowId: stepTask.flowDefinition.id,
    state,
    worker,
    input: stepTask.input,
    level,
    data,
  })

  return await stepTaskLog.save();
}

module.exports = {logSteptask};