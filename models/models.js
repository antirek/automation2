const mongoose = require('mongoose');
const {nanoid} = require('nanoid');

const createModels = (dbConn) => {
  const FlowDefinitionSchema = new mongoose.Schema({
    flowId: String,
    steps: [],
  });

  const TaskSchema = new mongoose.Schema({
    taskId: {
      type: String,
      default: () => nanoid(),
      required: true,
    },
    flowDefinition: mongoose.Schema.Types.Mixed,
    initData: mongoose.Schema.Types.Mixed,
  });

  const Task = dbConn.model('Task', TaskSchema);
  const FlowDefinition = dbConn.model('FlowDefinition', FlowDefinitionSchema);

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

  const WebhookSchema = new mongoose.Schema({
    webhookId: {
      type: String,
      default: () => nanoid(),
      required: true,
    },
    flowId: String,
  });

  const Webhook = dbConn.model('Webhook', WebhookSchema);

  return {
    Task,
    FlowDefinition,
    StepTaskLog,
    Webhook,
  };
};

module.exports = {createModels};