'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {
  AbortController: BuiltinAbortController,
  Promise: BuiltinPromise
} = globalThis;

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

class AbortController extends BuiltinAbortController {
  resolve(value) {
    super.abort(new Handler(value, value));
  }
}
exports.AbortController = AbortController;

class Promise extends BuiltinPromise {
  constructor(callback, {signal} = {}) {
    super((resolve, reject) => {
      if (signal)
        signal.addEventListener('abort', new Handler(resolve, reject));
      callback(resolve, reject);
    });
  }
}
exports.Promise = Promise;
