import Coder from '../coder';

describe('encodeJson', () => {
  let coder;

  beforeEach(() => {
    coder = new Coder();
  });

  it('encodes a valid JsonRPC JSON string', () => {
    expect(coder.encodeJson('method', 'params')).toEqual(
      '{"id":1,"jsonrpc":"2.0","method":"method","params":"params"}'
    );
  });
});
