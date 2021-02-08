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

  const StepTaskSchema = new mongoose.Schema({
    stepTaskId: {
      type: String,
      default: () => nanoid(),
      required: true,
    },
    taskId: String,
    stepId: String,
    flowId: String,
    input: String,
    output: String,
    state: String,
    initTime: String,
    finishTime: String,
    type: {
      type: String,
      required: true,
    },
    worker: String,
    next: String,
  });

  const StepTask = dbConn.model('StepTask', StepTaskSchema);
  const Task = dbConn.model('Task', TaskSchema);
  const Flow = dbConn.model('Flow', FlowSchema);

  return {
    StepTask,
    Task,
    Flow,
  };
};

module.exports = {createModels};