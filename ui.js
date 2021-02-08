const express = require('express');
const config = require('config');
const { Queue } = require('bullmq');
const { setQueues, router, BullMQAdapter } = require('bull-board');
const IOredis = require('ioredis');

// const connection = new IOredis(config.get('redis'));

const app = express();

const webhookQueue = new Queue('ready');
const instanceQueue = new Queue('delay');
const executorQueue = new Queue('executor');

setQueues([
  new BullMQAdapter(webhookQueue),
  new BullMQAdapter(instanceQueue),
  new BullMQAdapter(executorQueue),
]);

app.use('/ui', router)

app.listen(3000, () => {
  console.log('started', config);
});