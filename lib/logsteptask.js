const mongoose = require('mongoose');
const config = require('config');
const dayjs = require('dayjs');

mongoose.set('debug', true);

const { createModels } = require('./../models/models');

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {StepTaskLog} = createModels(dbConn);

const logSteptask = async (stepTask, worker, state, level = 'info', data = '') => {
  console.log('step task in log func', stepTask);
  console.log('data in log func', data);
  
  const stepTaskLog = new StepTaskLog({
    taskId: stepTask.taskId,
    stepTaskId: stepTask.stepTaskId,
    stepId: stepTask.step.id,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    flowId: stepTask.flowDefinition.id,
    state,
    worker,
    input: stepTask.input,
    level,
    data,
  })
  // console.log('steptasklog ready')
  await stepTaskLog.save();
  // console.log('saved');
  return;
}

module.exports = {logSteptask};