'use strict';
/*! (c) Andrea Giammarchi - ISC */

class Handler {
  constructor($, _) {
    this.$ = $;
    this._ = _;
  }
  handleEvent(event) {
    const {reason} = event.currentTarget;
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

const clean = (signal, handler, callback) => value => {
  signal.removeEventListener('abort', handler);
  callback(value);
};

const create = (callback, signal) => (resolve, reject) => {
  const handler = new Handler(resolve, reject);
  signal.addEventListener('abort', handler, {once: true});
  callback(
    clean(signal, handler, resolve),
    clean(signal, handler, reject)
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
