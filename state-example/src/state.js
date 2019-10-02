const sdk = require('dragonchain-sdk');
class dataObject {
  constructor(key, count) {
    this.accessCount = count;
    this.key = key;
  }
}
class SimpleStateManagement {
  constructor() {
    this.dataObjects = [];
    this.client = null;
  }

  async get(key) {
    const obj = this.dataObjects.find(x => x.key === key);
    if (obj) {
      obj.accessCount++;
      return obj;
    }
    const { response, ok } = await this.client.getSmartContractObject({ key })
    if (ok) {
      const res = JSON.parse(response);
      this.dataObjects.push({ key, accessCount: res+1});
    } else {
      return { obj: null }
    }
  }

  add(key) {
    const obj = new dataObject(key, 0);
    this.dataObjects.push(obj)
  }

  returnNewState() {
    const obj = {};
    this.dataObjects.forEach((data) => { obj[data.key] = data.accessCount });
    console.error('obj', obj)
    return obj;
  }
}

const stateManager = new SimpleStateManagement()

module.exports = async function (fullTransaction) {
  const { key, method } = fullTransaction.payload;

  if (!method || !key) throw new Exception("Bad parameters!")

  stateManager.client = await sdk.createClient();
  if (method === 'get') {
    await stateManager.get(key);
    return stateManager.returnNewState();
  } else if (method === 'add') {
    stateManager.add(key);
    return stateManager.returnNewState();
  } else {
    throw new Exception("Bad method!")
  }
}