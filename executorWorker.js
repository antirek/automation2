const {Worker} = require('bullmq');
const Redis = require('ioredis');

const {Store} = require('./store');
const config = require('config');


const {
  ModifyCalldataWorker, 
  SendmailWorker,
  DelayWorker,
  DetectWorktimeWorker,
  PrepareMessagesWorker,
  SendMessageWorker,
} = require('./workers');

const connection = new Redis(config.redis);
const store = new Store({client: connection});

const stepProcessors = [
  {
    queue: DelayWorker.getStep(),
    workers: [
      new DelayWorker({store, connection}),
    ],
  },
  {
    queue: SendmailWorker.getStep(),
    workers: [
      new SendmailWorker({store, connection}),
    ],
  },
  {
    queue: ModifyCalldataWorker.getStep(),
    workers: [
      new ModifyCalldataWorker({store, connection}),
    ],
  },
  {
    queue: DetectWorktimeWorker.getStep(),
    workers: [
      new DetectWorktimeWorker({store, connection}),
    ],
  },
  {
    queue: PrepareMessagesWorker.getStep(),
    workers: [
      new PrepareMessagesWorker({store, connection}),
    ],
  },
  {
    queue: SendMessageWorker.getStep(),
    workers: [
      new SendMessageWorker({store, connection}),
    ],
  },
];

stepProcessors.map(processor => {
//  console.log('step', processor.queue);
  processor.workers.map(worker => {
    new Worker(processor.queue, async (job) => {      
      await worker.process(job);
    }, {connection});
  });
});
