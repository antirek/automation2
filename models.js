const mongoose = require('mongoose');

const createModels = (dbConn) => {
  const StepTaskSchema = new mongoose.Schema({
    stepId: String,
    flowId: String,
    input: String,
    output: String,
    state: String,
    executionTime: String,
    initTime: String,
    finishTime: String,
    type: String,
    worker: String,
    next: String,
  });

  const StepTask = dbConn.model('StepTask', StepTaskSchema);

  return {
    StepTask,
  };
};

module.exports = {createModels};