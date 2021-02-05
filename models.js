const mongoose = require('mongoose');

const createModels = (dbConn) => {
  const StepTaskSchema = new mongoose.Schema({
    stepTaskId: String,
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

  return {
    StepTask,
  };
};

module.exports = {createModels};