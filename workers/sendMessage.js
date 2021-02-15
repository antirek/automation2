
const {StepWorker} = require('./../lib/stepWorker');

class SendMessageWorker extends StepWorker {

  varsInSchema = [
    {
      name: 'to',
      type: 'string',
    },
    {
      name: 'message',
      type: 'string',
    }
  ];

  varsOutSchema = [
    {
      name: 'status',
      type: 'string',
    }
  ];

  async do (stepTask, storeData) {
    console.log('storeData', storeData);

    const to = storeData.to;
    const message = storeData.message;
    
    const result = {
      message: `send message ${message} to ${to}`,
      status: 'OK'
    };

    console.log(result);
    return {result};
  }
}

module.exports = {SendMessageWorker};