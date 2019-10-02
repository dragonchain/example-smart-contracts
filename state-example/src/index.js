const getStdin = require('get-stdin');
const stateManager = require('./state');

getStdin().then(async val => {
  const res = await stateManager(JSON.parse(val));
  process.stdout.write(JSON.stringify(res))
}).catch(e => {
  console.error(e.stack);
});