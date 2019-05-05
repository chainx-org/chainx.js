import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('ws://192.168.1.130:8087');
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
    console.log(chainx.account.from('Bob').address())
    chainx.account.setNet('testnet')
    chainx.account.setNet('mainnet')
    console.log(chainx.account.from('Bob').address())
    console.log(chainx.account.from('Bob').address())
    chainx.account.setNet('testnet')
    console.log(chainx.account.from('Alice').address())
    chainx.account.setNet('mainnet')
    console.log(chainx.account.from('Alice').address())
    chainx.account.setNet('mainnet')
    console.log(chainx.account.from('Bob').address())

    // const e = chainx.asset.transfer(chainx.account.from('Bob').address(), 'PCX', 100, '哈哈哈哈');
    // e.signAndSend(chainx.account.from('Bob'), { acceleration: 10 }, (error, result) => {
    //   console.log(error, result);
    // });
    // console.log(e.hash.toHex())
    // console.log(e.sign(chainx.account.from('Bob')).hash.toHex())
    // const aaa = await chainx.chain.getMinimumPeriod()
    // console.log(aaa)
    // const aaa = await chainx.api.query.xAssets.assetBalance('0xb1695b946241c43876d07d2a50dc7bd501ca5d7de52f44d1487c95fe8991880f', 'PCX')
    // console.log(aaa.toJSON())
  });
});
