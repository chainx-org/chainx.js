import ChainX from '../index';

describe('chainx.js', () => {
  const chainx = new ChainX('wss://w1.chainx.org/ws');
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
    // chainx.asset.getSdotClaims('0x007e917588d7a1392c3604501e00a73565d06845').then(data => {
    //   console.log(data);
    // });
  });
});
