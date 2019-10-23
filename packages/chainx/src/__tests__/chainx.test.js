import Chainx from '../index';
import fs from 'fs';
import path from 'path';
import { compactAddLength, u8aToHex, u8aToU8a, u8aConcat } from '@chainx/util';
import { Abi } from '@chainx/api-contract';
import { Bytes } from '@chainx/types';
import { blake2AsU8a } from '@chainx/util-crypto';
import flipper from './flipper';
import abi2 from './abi2';
import erc20 from './erc20';

describe('chainx.js', () => {
  const chainx = new Chainx('ws://192.168.0.100:9944');
  const Alice1 = chainx.account.from('0x446861696e582d41616963652020202020202020202020202020202020202020');
  const Alice = chainx.account.from('0x436861696e582d416c6963652020202020202020202020202020202020202020');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  xit('putCode', done => {
    const code = fs.readFileSync(path.resolve(__dirname, './flipper2.wasm'));
    const ex = chainx.api.tx.xContracts.putCode(500000, compactAddLength(code));

    ex.signAndSend(Alice, (error, result) => {
      console.log(error, result);
      if (result) {
        console.log(JSON.stringify(result));
      }
    });
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

  xit('hash', () => {
    const abi = new Abi(abi2);

    const code = fs.readFileSync(path.resolve(__dirname, './flipper2.wasm'));

    const codeHash = blake2AsU8a(code);
    // console.log('codeHash:', u8aToHex(codeHash));
    // const data = abi.constructors[0]();
    // console.log('data:', data);
    // console.log('origin:', u8aToU8a(Alice1.publicKey()));
    // console.log('concat:', u8aConcat(codeHash, blake2AsU8a(abi.constructors[0]()), u8aToU8a(Alice1.publicKey())));
    console.log(
      chainx.account.encodeAddress(
        blake2AsU8a(u8aConcat(codeHash, blake2AsU8a(abi.constructors[0](true)), u8aToU8a(Alice.publicKey())))
      )
    );
    // console.log(
    //   chainx.account.encodeAddress(
    //     blake2AsU8a(u8aConcat(codeHash, blake2AsU8a(abi.constructors[0]()), u8aToU8a(Alice1.publicKey())))
    //   )
    // );
    // console.log(u8aToHex(blake2AsU8a((u8aConcat(codeHash, blake2AsU8a(abi.constructors[0](true)), u8aToU8a(Alice.publicKey()))))));
    // console.log(blake2AsU8a(Uint8Array.from([])))
    // console.log(u8aToHex(blake2AsU8a((u8aConcat(codeHash, blake2AsU8a(Uint8Array.from([])), u8aToU8a(Alice1.publicKey()))))));
    // console.log(chainx.account.encodeAddress('0xfa170bacf1dd6a1edfc349c4fe5785053a50fca2de0dab22c2fa1a34c7e8eb7a'));
    // console.log(blake2AsU8a(Uint8Array.from([])))
  });

  xit('instantiate', done => {
    // const abi = new Abi(flipper);
    const abi = new Abi(abi2);
    // console.log(abi.constructors[0](0))
    // endowment, gasLimit, codeHash, contractAbi.constructors[constructorIndex](...params)
    const ex = chainx.api.tx.xContracts.instantiate(
      1001,
      500001,
      '0x63c547c53bc2e338ac15e2be81642e78f4d54231c1ac300c3344d39bff4342e2',
      abi.constructors[0](true)
    );

    ex.signAndSend(Alice, (error, result) => {
      console.log(error, result);
      if (result) {
        console.log(JSON.stringify(result));
      }
    });
  });

  it('call', done => {
    // const abi = new Abi(flipper);
    const abi = new Abi(abi2);

    const ex = chainx.api.tx.xContracts.call(
      '5H6VsLH2u7CFFfobL4Pj9TGqECPY2AANoajhdjXTpSmjd1kv', // contract address
      0, // value
      500000, // gas
      abi.messages.flipTo(true)
      // abi.messages.flip()
    );

    ex.signAndSend(Alice, (error, result) => {
      console.log(error, result);
      if (result) {
        console.log(JSON.stringify(result));
      }
    });
  });
});
