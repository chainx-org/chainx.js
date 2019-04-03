import Coder from '../coder';

describe('decodeResponse', () => {
  let coder;

  beforeEach(() => {
    coder = new Coder();
  });

  it('expects a non-empty input object', () => {
    expect(() => coder.decodeResponse(undefined)).toThrow(/Empty response/);
  });

  it('expects a valid jsonrpc field', () => {
    expect(() => coder.decodeResponse({})).toThrowError();
  });

  it('expects a valid id field', () => {
    expect(() => coder.decodeResponse({ jsonrpc: '2.0' })).toThrow(/Invalid id/);
  });

  it('expects a valid result field', () => {
    expect(() => coder.decodeResponse({ id: 1, jsonrpc: '2.0' })).toThrow(/No result/);
  });

  it('throws any error found', () => {
    expect(() => coder.decodeResponse({ id: 1, jsonrpc: '2.0', error: { code: 123, message: 'test error' } })).toThrow(
      /\[123\]: test error/
    );
  });

  it('returns the result', () => {
    expect(coder.decodeResponse({ id: 1, jsonrpc: '2.0', result: 'some result' })).toEqual('some result');
  });
});
