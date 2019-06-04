import ApiBase from '../ApiBase';
import { WsProvider } from '@chainx/rpc-provider';
import { Extrinsic } from '@chainx/types';
describe('chainx.js', () => {
  // const
  const chainx = new ApiBase(new WsProvider('wss://w1.chainx.org/ws'));

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx._isReady;
  });

  it('test', done => {
    const subcription = chainx.query$.xAssets
      .assetBalance(['5QezaXNmyBubyHVBVuwq3ET34P1fWmi57WX7VDNFa5HFm1hm', 'PCX'])
      .subscribe(balance => {
        console.error(balance.toJSON());
      });

    const data = chainx.query.xAssets.assetBalance
      .at('0x7b0635300b80446b16d4cb78ae6cb8b6150506ad0e5627406d3152b73427db4a', [
        '5QezaXNmyBubyHVBVuwq3ET34P1fWmi57WX7VDNFa5HFm1hm',
        'PCX',
      ])
      .then(balance => {
        console.error(balance.toJSON());
      });
  });
});
