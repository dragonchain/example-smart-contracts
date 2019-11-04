const getStdin = require('get-stdin');
const greeting = require('./hello');

getStdin().then(async val => {
  const res = await greeting(JSON.parse(val));
  process.stdout.write(JSON.stringify(res))
}).catch(e => {
  console.error(e.stack);
});