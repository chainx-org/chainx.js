import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('ws://192.168.1.25:8097');
  jest.setTimeout(30000);
  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  // it('test', done => {
  //   // const e = chainx.asset.transfer(chainx.account.from('Bob').address(), 'PCX', 100, '哈哈哈哈');
  //   // e.signAndSend(chainx.account.from('Bob'), { acceleration: 10 }, (error, result) => {
  //   //   console.log(error, result);
  //   // });
  //   const aaa = chainx.xAsset.assetBalance('', 'BTC')
  // });

  it('test', async () => {
    // const e = chainx.asset.transfer(chainx.account.from('Bob').address(), 'PCX', 100, '哈哈哈哈');
    // e.signAndSend(chainx.account.from('Bob'), { acceleration: 10 }, (error, result) => {
    //   console.log(error, result);
    // });
    const aaa = await chainx.asset.getMinimalWithdrawalValueByToken('BTC')
    // const aaa = await chainx.api.query.xAssets.assetBalance('0xb1695b946241c43876d07d2a50dc7bd501ca5d7de52f44d1487c95fe8991880f', 'PCX')
    // console.log(aaa.toJSON())
  });
});
