import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('wss://w1.chainx.org/ws');
  jest.setTimeout(30000)
  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', () => {
    const e = chainx.api.tx.xbitcoin.pushTransaction(Buffer.from('8b4ca28e5ddead25', 'hex'));
    console.log(e);
  });
});
