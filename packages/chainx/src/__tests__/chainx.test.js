import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('ws://192.168.1.222:8097');
  jest.setTimeout(30000);
  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', done => {
    const e = chainx.asset.transfer(chainx.account.from('Bob').address(), 'PCX', 100, ' jj');
    e.signAndSend(chainx.account.from('ChainX1'), (error, response) => {
      console.log(response);
    });
  });
});
