import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('wss://w1.chainx.org/ws', { broadcast: ['wss://w2.chainx.org/ws', 'wss://w3.chainx.org/ws'] });
  jest.setTimeout(30000);
  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', done => {
    const e = chainx.asset.transfer(chainx.account.from('Bob').address(), 'PCX', 100, '哈哈哈哈');
    e.signAndSend(chainx.account.from('Bob'), { acceleration: 10 }, (error, result) => {
      console.log(error, result);
    });
  });
});
