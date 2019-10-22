import Chainx from '../index';
import fs from 'fs';
import path from 'path';
import { compactAddLength } from '@chainx/util';
import { Abi } from '@chainx/api-contract';
import ssss from './ssss';

describe('chainx.js', () => {
  const chainx = new Chainx('ws://192.168.0.100:9944');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  xit('putCode', done => {
    const code = fs.readFileSync(path.resolve(__dirname, './flipper.wasm'));
    const ex = chainx.api.tx.xContracts.putCode(500000, compactAddLength(code));

    ex.signAndSend(
      chainx.account.from('0x436861696e582d416c6963652020202020202020202020202020202020202020'),
      (error, result) => {
        console.log(error, result);
        if (result) {
          console.log(JSON.stringify(result));
        }
      }
    );
  });

  xit('PristineCode', async () => {
    const result = await chainx.api.query.xContracts.pristineCode(
      '0x533eb91e0f1eeb6300cf98ec5181327d49487bf6350a284e9d8cde8deab2da74'
    );
    console.log(result.length);
  });

  xit('abi', () => {
    const abi = new Abi(ssss);
    console.log(abi.constructors[0]());
  });

  it('instantiate', done => {
    const abi = new Abi(ssss);
    // console.log(abi.constructors[0](0))
    // endowment, gasLimit, codeHash, contractAbi.constructors[constructorIndex](...params)
    const ex = chainx.api.tx.xContracts.instantiate(
      1000,
      500000,
      '0x533eb91e0f1eeb6300cf98ec5181327d49487bf6350a284e9d8cde8deab2da74',
      abi.constructors[0]()
    );

    ex.signAndSend(
      chainx.account.from('0x436861696e582d416c6963652020202020202020202020202020202020202020'),
      (error, result) => {
        console.log(error, result);
        if (result) {
          console.log(JSON.stringify(result));
        }
      }
    );
  });
});
