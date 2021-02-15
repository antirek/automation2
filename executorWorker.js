const {Worker} = require('bullmq');
const Redis = require('ioredis');

const {Store} = require('./store');

const {
  ModifyCalldataWorker, 
  SendmailWorker,
  DelayWorker,
  DetectWorktimeWorker,
  PrepareMessagesWorker,
  SendMessageWorker,
} = require('./workers');

const client = new Redis();
const store = new Store({client})

const stepProcessors = [
  {
    queue: DelayWorker.getStep(),
    workers: [
      new DelayWorker({store}),
    ],
  },
  {
    queue: SendmailWorker.getStep(),
    workers: [
      new SendmailWorker({store}),
    ],
  },
  {
    queue: ModifyCalldataWorker.getStep(),
    workers: [
      new ModifyCalldataWorker({store}),
    ],
  },
  {
    queue: DetectWorktimeWorker.getStep(),
    workers: [
      new DetectWorktimeWorker({store}),
    ],
  },
  {
    queue: PrepareMessagesWorker.getStep(),
    workers: [
      new PrepareMessagesWorker({store}),
    ],
  },
  {
    queue: SendMessageWorker.getStep(),
    workers: [
      new SendMessageWorker({store}),
    ],
  },
];

stepProcessors.map(processor => {
//  console.log('step', processor.queue);
  processor.workers.map(worker => {
    new Worker(processor.queue, async (job) => {      
      await worker.process(job);
    });
  });
});
