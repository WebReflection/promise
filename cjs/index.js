'use strict';
/*! (c) Andrea Giammarchi - ISC */

class Handler {
  constructor($, _) {
    this.$ = $;
    this._ = _;
    this.c = void 0;
  }
  async handleEvent(event) {
    const {reason} = event.currentTarget;
    await effect(this);
    if (reason instanceof Handler)
      this.$(reason.$);
    else
      this._(event);
  }
}

const {
  AbortController: $AbortController,
  Promise: $Promise
} = globalThis;

class AbortController extends $AbortController {
  resolve(value) {
    super.abort(new Handler(value, value));
  }
}
exports.AbortController = AbortController;

const effect = async handler => {
  let {c} = handler;
  if (c) {
    handler.c = void 0;
    if (typeof (c = await c) === 'function')
      await c();
  }
};

const clean = (signal, handler, callback) => async value => {
  signal.removeEventListener('abort', handler);
  await effect(handler);
  callback(value);
};

const create = (callback, signal) => (resolve, reject) => {
  const handler = new Handler(resolve, reject);
  signal.addEventListener('abort', handler, {once: true});
  handler.c = callback(
    clean(signal, handler, resolve),
    clean(signal, handler, reject),
    signal
  );
};

const {construct, setPrototypeOf} = Reflect;

// why is this a function and not a class?
// well, arm yourself with patience and read this whole thread:
// https://es.discourse.group/t/one-does-not-simply-extend-promise/1627
function Promise(callback, {signal} = {}) {
  return construct(
    $Promise,
    [signal ? create(callback, signal) : callback],
    new.target
  );
}

setPrototypeOf(Promise, $Promise);
Promise.prototype = $Promise.prototype;

exports.Promise = Promise;
