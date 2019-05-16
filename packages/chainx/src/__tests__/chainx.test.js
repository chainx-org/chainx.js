import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('wss://w1.chainx.org/ws');
  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', () => {
    const e = chainx.account.decodeAddress('5RqxsaJpkqP8CHyiVUrLWL4HDaHNX3ytte7fo8sAD8JnhGKn');
  });
});
