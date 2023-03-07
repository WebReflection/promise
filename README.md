# @webreflection/promise

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/promise/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/promise?branch=main) [![build status](https://github.com/WebReflection/promise/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/promise/actions)

<sup>**Social Media Photo by [Andrew Petrov](https://unsplash.com/@andrewwwpetrov) on [Unsplash](https://unsplash.com/)**</sup>

Abortable and Resolvable Promises.

This module exposes a *dropin* replacement for both *Promise* and *AbortController* with the following extra features:

  * the **Promise** accepts an optional argument that could be a *controller* or an object carrying an *AbortSignal* with it.
  * the **AbortController** exposes a `resolve(value)` method so that not only it's possible to *abort* a *Promise*, it's also possible to *resolve* it, still using the security and ownership guards that [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) offers.

As a matter of fact, the *Promise* literally extends the builtin *Promise* and simply adds a listener to the optional signal, while the *AbortController* extends the builtin class too, exposing the extra `resolve(value)` method.

```js
// const {AbortController, Promise} = require('@webreflection/promise');
import {AbortController, Promise} from '@webreflection/promise';

const controller = new AbortController;
const promise = new Promise(
  // optionally receive a signal as third argument
  // if passed via controller or object
  (resolve, reject, signal) => {
    const t = setTimeout(resolve, 1000, 'automatically');
    // optional return a callback to cleanup whenever
    // the promise is either resolved or aborted
    return () => { clearTimeout(t) }
  },
  controller
);

// resolve the promise ahead of time
controller.resolve('manually');

// or abort the promise with a reason
constroller.abort('but why?!');
```

Every operation is fully based on default [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) standard behavior: no hacks, no tricks, just a convenient utility suitable for all occasions.
