const express = require('express');
const config = require('config');
const { Queue } = require('bullmq');
const { setQueues, router, BullMQAdapter } = require('bull-board');
const Redis = require('ioredis');

const connection = new Redis(config.redis);

const {
  ModifyCalldataWorker,
  SendmailWorker,
  DelayWorker,
  DetectWorktimeWorker,
  PrepareMessagesWorker,
  SendMessageWorker,
} = require('./../workers');


const app = express();
const queues = [
  'init',
  'ready',
  ModifyCalldataWorker.getStep(),
  SendmailWorker.getStep(),
  DelayWorker.getStep(),
  DetectWorktimeWorker.getStep(),
  PrepareMessagesWorker.getStep(),
  SendMessageWorker.getStep(),
];

const bullQueues = queues.map(q => {return new Queue(q, {connection})});
setQueues(bullQueues.map(bq => {return new BullMQAdapter(bq)}));

app.use('/ui', router)

app.listen(3002, () => {
  console.log('started', config);
});