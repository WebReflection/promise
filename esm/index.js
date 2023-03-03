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

export class AbortController extends BuiltinAbortController {
  resolve(value) {
    super.abort(new Handler(value, value));
  }
};

export class Promise extends BuiltinPromise {
  static [Symbol.species] = BuiltinPromise;
  constructor(callback, {signal} = {}) {
    super((resolve, reject) => {
      if (signal)
        signal.addEventListener('abort', new Handler(resolve, reject));
      callback(resolve, reject);
    });
  }
};
