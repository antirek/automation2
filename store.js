class Store {
  constructor ({client}) {
    this.client = client;
  }
  
  async setData(stepId, key, object) {
    // console.log('redis set data', `${stepId}:${key}`, d);
    await this.client.set(`${stepId}:${key}`, JSON.stringify(object), 'ex', 60*60*24*3);
  }

  async getData(stepId, key) {
    const result = await this.client.get(`${stepId}:${key}`);
    if (!result) return;
    return JSON.parse(result);
  }
}

module.exports = {Store};