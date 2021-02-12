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
    taskId: {
      type: String,
      required: true,
      index: true,
    },
    stepTaskId: {
      type: String,
      required: true,
    },
    stepId: {
      type: String,
      required: true,
    },
    flowId: {
      type: String,
      required: true,
    },
    worker: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    data: mongoose.Schema.Types.Mixed,
  });

  const StepTaskLog = dbConn.model('StepTaskLog', StepTaskLogSchema);

  return {
    Task,
    Flow,
    StepTaskLog,
  };
};

module.exports = {createModels};