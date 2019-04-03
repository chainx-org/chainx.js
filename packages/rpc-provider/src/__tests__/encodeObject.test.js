import Coder from '../coder';

describe('encodeObject', () => {
  let coder;

  beforeEach(() => {
    coder = new Coder();
  });

  it('starts with id === 0 (nothing sent)', () => {
    expect(coder.getId()).toEqual(0);
  });

  it('encodes a valid JsonRPC object', () => {
    expect(coder.encodeObject('method', 'params')).toEqual({
      id: 1,
      jsonrpc: '2.0',
      method: 'method',
      params: 'params',
    });
    expect(coder.getId()).toEqual(1);
  });
});
