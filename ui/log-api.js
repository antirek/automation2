const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');

const { createModels } = require('./../models/models');
const app = express();

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {Task, StepTaskLog} = createModels(dbConn);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/tasks', async (req, res) => {
  return res.json(await Task.find());
});

app.get('/steptasklog/:taskId', async (req, res) => {
  const {taskId} = req.params;
  return res.json(await StepTaskLog.find({taskId}));
});

app.listen(3001, () => {
  console.log('started', config);
});