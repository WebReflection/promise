/*! (c) Andrea Giammarchi - ISC */

const {
  AbortController: $AbortController,
  Promise: $Promise
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

export class AbortController extends $AbortController {
  resolve(value) {
    super.abort(new Handler(value, value));
  }
};

function Promise(callback, {signal} = {}) {
  return new $Promise((resolve, reject) => {
    if (signal)
      signal.addEventListener('abort', new Handler(resolve, reject));
    callback(resolve, reject);
  });
}

Object.setPrototypeOf(Promise, $Promise).prototype =
  $Promise.prototype;

export {Promise};
