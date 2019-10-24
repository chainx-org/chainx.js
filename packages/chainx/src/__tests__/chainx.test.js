import Chainx from '../index';
import fs from 'fs';
import path from 'path';
import { compactAddLength, compactFromU8a, u8aToHex, u8aToU8a, u8aConcat } from '@chainx/util';
import { Abi } from '@chainx/api-contract';
import { Bytes, createType } from '@chainx/types';
import { blake2AsU8a } from '@chainx/util-crypto';
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
    const code = fs.readFileSync(path.resolve(__dirname, './erc20.wasm'));
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

  // 5Cwmuq1CdofyzVfa4dG2rWyq8Na8b8FmgkWgwRcr6p8rAy1H
  xit('hash', () => {
    const abi = new Abi(erc20);

    const code = fs.readFileSync(path.resolve(__dirname, './erc20.wasm'));

    const codeHash = blake2AsU8a(code);
    console.log(codeHash);
    // console.log(createType('u128', 8000000000000).toU8a())
    // console.log(blake2AsU8a(createType('u128', 8000000000000).toU8a()))
    console.log(blake2AsU8a(createType('u64', 800000000).toU8a()));
    console.log(u8aToU8a(Alice.publicKey()));
    console.log(
      chainx.account.encodeAddress(
        blake2AsU8a(
          u8aConcat(
            codeHash,
            // blake2AsU8a(abi.constructors[0](800000000)),
            blake2AsU8a(createType('u64', 800000000).toU8a()),
            // blake2AsU8a(compactAddLength(createType('u64', 800000000000).toU8a())),
            u8aToU8a(Alice.publicKey())
          )
        )
      )
    );
  });

  it('instantiate', done => {
    const abi = new Abi(erc20);
    const ex = chainx.api.tx.xContracts.instantiate(
      1000,
      500000,
      '0x44653593064dc5f0233285c22ea474c468d7161e1dea77cc7423a2ccfd6ee890',
      abi.constructors[0](800000001)
    );

    ex.signAndSend(Alice, (error, result) => {
      console.log(error, result);
      if (result) {
        console.log(JSON.stringify(result));
      }
    });
  });

  xit('call', done => {
    const abi = new Abi(erc20);

    const ex = chainx.api.tx.xContracts.call(
      '5F5ggb7h6NPpMBd1U5Z8Cn5KSN53dgSNoTbBk9JrDBJM6QPh', // contract address
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
