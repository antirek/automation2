
module.exports = {
  SendmailWorker: require('./sendmailWorker').SendmailWorker,
  DelayWorker: require('./delayWorker').DelayWorker,
  ModifyCalldataWorker: require('./modifyCalldataWorker').ModifyCalldataWorker,
  DetectWorktimeWorker: require('./detectWorktimeWorker').DetectWorktimeWorker,
}

