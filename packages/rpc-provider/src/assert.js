export class ChainxRpcProviderError extends Error {
  constructor(message = '', data) {
    super();
    this.name = this.constructor.name;
    this.message = String(message);
    this.data = data;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export default function assert(test, message, data) {
  if (test) {
    return true;
  }
  if (typeof message === 'function') {
    message = message();
  }
  throw new ChainxRpcProviderError(message, data);
}
