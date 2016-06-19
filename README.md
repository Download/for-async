![version](https://img.shields.io/npm/v/for-async.svg) ![license](https://img.shields.io/npm/l/for-async.svg) ![installs](https://img.shields.io/npm/dt/for-async.svg) ![build](https://img.shields.io/travis/Download/for-async.svg) ![mind BLOWN](https://img.shields.io/badge/mind-BLOWN-ff69b4.svg)

# for-async <sup><sub>v1.0.0</sub></sup>

**Helper function to ease doing async work in a loop**


## Installation

```sh
npm install --save for-async
```


## Dependencies and imports

for-async has no dependencies. Load it like this:

```js
import forAsync from 'for-async';
```

Or, using ES5 / `require`:

```js
var forAsync = require('for-async');
```

Also usable in the browser, but because `for-async` is tiny, you're probably better off
by just copying the function from [the source](https://github.com/download/for-async/blob/master/src/for-async.js) directly.


## Usage

```js
/**
 * Loops over an array, performing (async) work on each item.
 *
 * arr  The (possibly empty) array to loop over.
 * fn   The callback function that will be called for each item.
 *      It has the signature `fn(item, idx)`, where `item` is the
 *      current array element and `idx` is the index in the array.
 */
forAsync(arr, fn)
```

Use `forAsync` as you would `forEach`, except it's not a method of `Array` but a separate function,
so pass the array to loop over as the first parameter.


### Sync Usage

For convenience, `forAsync` can be used with sync as well as async callback functions:

```js
var arr = ['some', 'cool', 'array'];
forAsync(arr, function(item, idx){
  console.info(item, idx);
  // Logs 3 lines: `some 0`, `cool 1`, `array 2`
})
```


### Async Usage

You can do async work inside the callback function by having it return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
var arr = ['some', 'cool', 'array'];
forAsync(arr, function(item, idx){
  return new Promise(function(resolve){
    setTimeout(function(){
      console.info(item, idx);
      // Logs 3 lines: `some 0`, `cool 1`, `array 2`
      resolve(); // <-- signals that this iteration is complete
    }, 25); // delay 25 ms to make async
  })
})
```

The next iteration will only start when the promise returned by the previous iteration has fulfilled.
If we are calling a function that already returns a `Promise`, we don't have to wrap it in another
`Promise`, but can just return the result directly:

```js
function asyncWorker(item, idx) {
  return new Promise(function(resolve){
    setTimeout(function(){
      console.info(item, idx);
      resolve(); // <-- signals that work is complete
    }, 25); // delay 25 ms to make async
  })
}

var arr = ['some', 'cool', 'array'];
forAsync(arr, function(item, idx){
	return asynchWorker(item, idx);
})

// Or, even shorter:

forAsync(arr, asynchWorker);
```

### Waiting for the loop to complete

`forAsync` itself returns a `Promise`, that we can use to wait for the loop to complete:

```js
var arr = ['some', 'cool', 'array'];
var result = '';
forAsync(arr, function(item, idx){
  return new Promise(function(resolve){
    setTimeout(function(){
      result += item + '!'
      resolve(); // <-- signals that this iteration is complete
    }, 25); // delay 25 ms to make async
  })
})
.then(function(){
  // This code only runs after the loop has completed
  console.info(result);
  // Logs 1 line: `some!cool!array!`
})
console.info(result);
// logs an empty line
```

If it surprises you that the last statement logs an empty line, [learn more about async](http://rowanmanning.com/posts/javascript-for-beginners-async/).


### Breaking off the loop

The loop will be broken off when an exception is thrown (in the case of sync code), or when the
`Promise` returned from async code is rejected:

```js
var arr = ['some', 'cool', 'array'];
forAsync(arr, function(item, idx){
  console.info(item, idx);
  throw new Error('abort'); // throw to break from sync function
  // Logs 1 line: `some 0`
})
forAsync(arr, function(item, idx){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      console.info(item, idx);
      reject(new Error('abort')); // reject to break from async function
      // Logs 1 line: `some 0`
    }, 25); // delay 25 ms to make async
  })
})
.then(function(){
  // This code never runs as the loop is aborted
  console.info('Done!');
})
```

### Catching thrown errors or rejected promises

Just like we used the `then` method on the `Promise` returned by `forEach` to wait for the loop to
complete, we can use the `catch` method to catch any errors that happened:

```js
var arr = ['some', 'cool', 'array'];
forAsync(arr, function(item, idx){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      console.info(item, idx);
      reject(new Error('abort')); // reject to break from async function
      // Logs 1 line: `some 0`
    }, 25); // delay 25 ms to make async
  })
})
.then(function(){
  // This code never runs as the loop is aborted
  console.info('Done!');
})
.catch(function(error){
  console.info(error.message);
  // Logs: `abort`
})
```

### Passing information from one loop iteration to the next

There is no mechanism built into `forAsync` for exchanging
data between the different loop iterations, but Javascript makes
this very simple anyway, by using a variable in the enclosing
scope:

```js
let x = 10;
var arr = [10, 25, 55];
forAsync(arr, function(item, idx){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
		x += item;
    }, 25); // delay 25 ms to make async
  })
})
.then(function(){
  console.info(x);
  // logs `100`
})
```


## Feedback, suggestions, questions, bugs

Please visit the [issue tracker](https://github.com/download/for-async/issues)
for any of the above. Don't be afraid about being off-topic.
Constructive feedback most appreciated!


## Copyright

© 2016, [Stijn de Witt](http://StijnDeWitt.com). Some rights reserved.


## License

[Creative Commons Attribution 4.0 (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)
