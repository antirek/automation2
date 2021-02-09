const mongoose = require('mongoose');
const {nanoid} = require('nanoid');

const createModels = (dbConn) => {
  const FlowSchema = new mongoose.Schema({
    flowId: String,
    steps: [],
  });

  const TaskSchema = new mongoose.Schema({
    taskId: {
      type: String,
      default: () => nanoid(),
      required: true,
    },
    flowDefinition: String,
  });

  const Task = dbConn.model('Task', TaskSchema);
  const Flow = dbConn.model('Flow', FlowSchema);

  const StepTaskLogSchema = new mongoose.Schema({
    taskId: String,
    stepTaskId: String,
    stepId: String,
    flowId: String,
    worker: String,
    time: String,
    state: String,
  });

  const StepTaskLog = dbConn.model('StepTaskLog', StepTaskLogSchema);

  return {
    Task,
    Flow,
    StepTaskLog,
  };
};

module.exports = {createModels};