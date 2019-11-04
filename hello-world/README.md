# Simple "Hello World" Smart Contract

This contract demonstrates how easy it is to develop on Dragonchain and how quickly you can produce a working smart contract prototype. The SC greeter is implemented as a single function in Nodejs with a single import. Even the Dockerfile is simple, requiring no prior experience.

## Dockerfile

```Dockerfile
FROM node:12-alpine AS base # Using a lightweight base image keeps SC size small
WORKDIR /app # Not strictly necessary, but enforces the working directory instead of determining it at build time

FROM base AS builder # Use a different layer to keep from installing anything unnecessary on the final image
COPY package.json package.json # Copy only what we need to install packages
COPY yarn.lock yarn.lock # Docker COPY commands can only move one file at a time
RUN yarn --frozen-lockfile --non-interactive --production # Run yarn to install node packages

FROM base AS release # This layer will be the final image produced by the Dockerfile
COPY --chown=1000:1000 ./src ./src # Copy source code from local directory
COPY --from=builder --chown=1000:1000 /app/node_modules ./node_modules # Copy node modules from 'builder' layer
USER 1000:1000 # Set user for the docker image for easier local development
```

## Smart Contract Code

Because Dragonchain smart contracts run in isolation using [openfaas](https://www.openfaas.com/), they accept input from stdin. In this example, we use [get-stdin](https://www.npmjs.com/package/get-stdin) to read input as strings.

In most cases, simple strings are not sufficient for smart contract execution. Dragonchain suggests submitting JSON objects as strings for complicated workflows. For this example, the expected object has a single key, `name`, which can be of any Stringifiable data type.

The function that executes smart contract logic must be exported. In this case, we use an index.js file as the entry point to the smart contract that parses stdin and provides the value to the function provided in [hello.js](./src/hello.js).

```js
module.exports = async function (fullTransaction) {
```

Just like any service, a smart contract should validate its inputs. For the greeter function, we want to ensure that the payload provided by the user contains a `name`.

```js
  if (!fullTransaction || !fullTransaction.payload || !fullTransaction.payload.name) {
    return { error: "I can't say hi if I don't know your name!" };
  }
```

After verifying inputs are valid, the smart contract should execute its internal logic. This could include manipulating blockchain heap data, performing arbitrary calculations, ledgering data, managing permissions, etc. Once the SC has finished executing its logic, it can return a string or a JSON object to be ledgered onto the chain as output. By default, all SC executions ledger their output, but this can be optionally disabled.

```js
  /* Execute logic here */

  // Return JSON or a string to finish execution.
  return { greeting: `Hello ${name}!`}
}
```

To see the output from a smart contract, you can query using your transaction id for the invocation request. For example, if you're using dctl to interact with your dragonchain and your transaction create command returns transaction_id `banana`, you would search for transactions with `@invoker:{banana}`.

```sh
$ dctl t c hello-world '{ "name": "dragonchain" }'
{
  "status": 201,
  "response": {
    "transaction_id": "banana"
  },
  "ok": true
}
$ dctl t q state-test '@invoker:{banana}'
{
  ...
  "header": {
    "txn_type": "hello-world",
    ...
    "invoker": "banana"
  },
  "payload": {
    "greeting": "Hello dragonchain!"
  },
  ...
}
```

## Examples

For simplicity, a [small test suite](./spec/hello.spec.js) is included to give some examples how to use a smart contract. Smart contracts that institute business logic should be tested like any other business unit.
