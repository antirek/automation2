const express = require('express');
const config = require('config');
const { Queue } = require('bullmq');
const { setQueues, router, BullMQAdapter } = require('bull-board');
const IOredis = require('ioredis');

// const connection = new IOredis(config.get('redis'));

const app = express();
const queues = [
  'init', 
  'delay', 
  'httprequestExecutor', 
  'ready',
];

const bullQueues = queues.map(q => {return new Queue(q)});
setQueues(bullQueues.map(bq => {return new BullMQAdapter(bq)}));

app.use('/ui', router)

app.listen(3002, () => {
  console.log('started', config);
});