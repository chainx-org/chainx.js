import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('ws://47.99.192.159:8091');
  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', done => {
    // const a = chainx.asset.claimSdot(
    //   {
    //     r: '0x14e496e4182afe7fd6e248f996adf2810cda35ef4577be8ed8b10028f2a4b7ec',
    //     s: '0x0ad92ad5c6fc126c08d4dff9cab7fc4df5f4940b4b823dbb56b2acd2919e173e',
    //     v: 1,
    //   },
    //   '0xf85681a385012a05f200830f424094eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee80b0355074646d6a7764374b4c5a533344596a5239524739367a577352654d6235463448574a7434334e61484c53526e6542018080',
    //   '0x355074646d6a7764374b4c5a533344596a5239524739367a577352654d6235463448574a7434334e61484c53526e6542'
    // );

    // a.signAndSend(chainx.account.from('xxx'), (e, r) => {
    //   console.log(e, r);
    // });

    // chainx.asset.getSdotClaims(chainx.account.from('xxxx').address).then(s => console.log(s));
    // chainx.asset.getWithdrawalLimitByToken('BTC').then(s => console.log(s));
    // chainx.asset.getAddressByAccount(chainx.account.from('xxxx').address(), 'Bitcoin').then(s => console.log(s));
    // chainx.asset.getSdotClaims('0x007e917588d7a1392c3604501e00a73565d06845').then(data => {
    //   console.log(data);
    // });dest, token, value, memo
    chainx.asset
      .transfer(chainx.account.from('xxxx2131312').address(), 'PCX', 1000, '哈哈哈哈')
      .signAndSend(
        chainx.account.from('0x436861696e582d426f6220202020202020202020202020202020202020202020'),
        (e, r) => {
          console.log(e, JSON.stringify(r));
        }
      );
    // chainx.api.query.system.events.at('0x7bbab6d1fa22789b76841bba6b79b042c7903cfeac3169e63478cb1b88d346bf').then(d => console.log(d))
  });
});
