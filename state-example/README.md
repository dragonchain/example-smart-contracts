# State Management Example

Using state in Dragonchain is incredibly simple. By default, the output of smart contracts is automatically added to the contract's personal heap. On top of that, the SDK makes getting state information from the chain a breeze!

## Heap Set

You can set to the heap simply by outputting valid JSON to stdout. This example outputs its state like this:

```js
const res = await stateManager(JSON.parse(val));
process.stdout.write(JSON.stringify(res))
```

## Heap Get

After the heap has been written, successive runs can look up the heap state using the [Dragonchain SDK](https://github.com/dragonchain/dragonchain-sdk-python). We also support an [SDK for javascript](https://github.com/dragonchain/dragonchain-sdk-javascript). Whichever SDK you use, you can perform a heap get with this code:

```js
const { response, ok } = await this.client.getSmartContractObject({ key })
if (ok) {
  const res = JSON.parse(response);
  // Do something with the heap response
}
```

In this example, each time a key is returned, the access count is incremented and written back to heap.

## Putting it together

This example demonstrates a simple end to end use for the blockchain heap. Keys are created by sending `add` payloads and can be accessed using `get` payloads. For a more realistic example, you could extend this use case with metrics on the nature of access, by associating data with keys, or by locking access to a key after the access count meets a threshold.

The code as-is runs like so:

Logs outputted by the smart contract are marked with `>` in the example.

```sh
dctl t c state-test '{ "method": "add", "key": "banana" }'
>2019/10/02 23:14:35 stderr: obj { banana: 0 }
dctl t c state-test '{ "method": "get", "key": "banana" }'
>2019/10/02 23:15:38 stderr: obj { banana: 1 }
dctl t c state-test '{ "method": "get", "key": "banana" }'
>2019/10/02 23:15:38 stderr: obj { banana: 2 }
```
