
class Store {
  constructor ({client}) {
    this.client = client;
  }

  async setData(stepId, key, object) {
    await this.client.set(`${stepId}:${key}`, JSON.stringify(object), 'ex', 1200);
  }

  async getData(stepId, key) {
    const result = await this.client.get(`${stepId}:${key}`);
    if (!result) return;
    return JSON.parse(result);
  }
}

module.exports = {Store};