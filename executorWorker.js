const {Worker} = require('bullmq');
const Redis = require('ioredis');

const {Store} = require('./store');

const {
  ModifyCalldataWorker, 
  SendmailWorker,
  DelayWorker,
  DetectWorktimeWorker,
  SendMessageToCaller,
  SendMessageToCallee,
} = require('./workers');

const client = new Redis();
const store = new Store({client})

const stepProcessors = [
  /*{
    queue: 'httprequestExecutor',
    workers: [
      stepWorker1,
    ],
  },*/
  {
    queue: 'delay',
    workers: [
      new DelayWorker({store}),
    ],
  },
  {
    queue: 'sendmail',
    workers: [
      new SendmailWorker({store}),
    ],
  },
  {
    queue: 'modifyCalldataWorker',
    workers: [
      new ModifyCalldataWorker({store}),
    ],
  },
  {
    queue: 'detectWorktimeWorker',
    workers: [
      new DetectWorktimeWorker({store}),
    ],
  },
  {
    queue: 'sendMessageToCallerWorker',
    workers: [
      new SendMessageToCaller({store}),
    ],
  },
  {
    queue: 'sendMessageToCalleeWorker',
    workers: [
      new SendMessageToCallee({store}),
    ],
  },
];

stepProcessors.map(processor => {
  processor.workers.map(worker => {
    new Worker(processor.queue, async (job) => {
      await worker.process(job);
    });
  });
});
