const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
const Redis = require('ioredis');

const { createModels } = require('./../models/models');
const app = express();

const client = new Redis(config.redis);
// const store = new Store({client});


const flowDefinition = require('./../flowDefinitions')[0];
const { Flow } = require('../lib/flow');
const flow = new Flow(flowDefinition);

const dbConn = mongoose.createConnection(config.mongodb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const {Task, StepTaskLog, Webhook, } = createModels(dbConn);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/flow', (req, res) => {
  res.sendFile(path.join(__dirname, './flow.html'));
});

app.get('/webhooks', async (req, res) => {
  res.json(await Webhook.find());
});

app.get('/tasks', async (req, res) => {
  return res.json(await Task.find());
});

app.get('/task/:webhookId', async (req, res) => {
  const {webhookId} = req.params;
  return res.json(await Task.find({webhookId}));
});


app.get('/steptasklog/:taskId', async (req, res) => {
  const {taskId} = req.params;
  return res.json(await StepTaskLog.find({taskId}));
});

app.get('/data/:taskId', async (req, res) => {
  const {taskId} = req.params;

  const keys = await client.keys(`${taskId}:*`);
  // console.log('keys', keys);
  let d  = [];
  for (const k of keys) {
    d.push({key: k, data: await client.get(k)});
  }
  console.log('data', d);
  res.json(d);
});

app.get('/flow/data', async (req,res) => {
  const nodes = flow.getNodes();
  const edges = flow.getEdges();
  res.json({nodes, edges});
});

app.listen(3001, () => {
  console.log('started', config);
});