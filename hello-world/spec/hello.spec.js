const { expect } = require('chai');
const greeting = require('../src/hello');

describe('greeter', () => {
  it('greets a string name', async () => {
    const res = await greeting({ payload: { name: 'banana'} });
    expect(res).to.deep.equal({ greeting: 'Hello banana!' });
  });
  it('greets a number name', async () => {
    const res = await greeting({ payload: { name: 3.1415} });
    expect(res).to.deep.equal({ greeting: 'Hello 3.1415!' });
  });
  it('Cant greet someone without a name', async () => {
    const res = await greeting();
    expect(res).to.deep.equal({ error: "I can't say hi if I don't know your name!" });
  });
})
