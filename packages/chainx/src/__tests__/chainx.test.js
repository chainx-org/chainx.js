import ApiBase from '../ApiBase';
import Chainx from '../index';
import { WsProvider } from '@chainx/rpc-provider';
import { Extrinsic } from '@chainx/types';
import fs from 'fs';
import path from 'path';
import { compactAddLength, u8aToHex } from '@chainx/util';

describe('chainx.js', () => {
  const chainx = new Chainx('ws://192.168.0.100:9944');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('test', done => {
    const code = fs.readFileSync(path.resolve(__dirname, './flipper.wasm'));
    const ex = chainx.api.tx.xContracts.putCode(500000, compactAddLength(code));
    ex.signAndSend(
      chainx.account.from('0x436861696e582d416c6963652020202020202020202020202020202020202020'),
      (error, result) => {
        console.log(error, result);
      }
    );
  });
});
