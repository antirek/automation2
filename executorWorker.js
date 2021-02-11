const {Worker} = require('bullmq');

const {
  ModifyCalldataWorker, 
  SendmailWorker,
  DelayWorker,
  DetectWorktimeWorker,
  SendMessageToCaller,
} = require('./workers');

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
      new DelayWorker(),
    ],
  },
  {
    queue: 'sendmail',
    workers: [
      new SendmailWorker(),
    ],
  },
  {
    queue: 'modifyCalldataWorker',
    workers: [
      new ModifyCalldataWorker(),
    ],
  },
  {
    queue: 'detectWorktimeWorker',
    workers: [
      new DetectWorktimeWorker(),
    ],
  },
  {
    queue: 'sendMessageToCallerWorker',
    workers: [
      new SendMessageToCaller(),
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
