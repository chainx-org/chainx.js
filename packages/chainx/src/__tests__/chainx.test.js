import Chainx from '../index';
import fs from 'fs';
import path from 'path';
import { compactAddLength, compactFromU8a, u8aToHex, u8aToU8a, u8aConcat } from '@chainx/util';
import { isU8a } from '@chainx/util';

import { Abi } from '@chainx/api-contract';
import { Bytes, U8a, createType, Extrinsic, Vec, u8, Text, getTypeDef } from '@chainx/types';
import { blake2AsU8a } from '@chainx/util-crypto';
import erc20 from './erc20';
import erc21 from './erc21';
import testabi from './testabi';
import testabi1 from './testabi1';

describe('chainx.js', () => {
  const chainx = new Chainx('ws://120.27.210.87:8087');
  const Alice1 = chainx.account.from('0x446861696e582d41616963652020202020202020202020202020202020202020');
  const Alice = chainx.account.from('0x436861696e582d416c6963652020202020202020202020202020202020202020');
  const Test = chainx.account.from('0x436861696e582d5361746f736869202020202020202020202020202020202020');

  jest.setTimeout(30000);

  beforeEach(async () => {
    await chainx.isRpcReady();
  });

  it('erc21', done => {
    const abi = new Abi(testabi1);
    // // console.log(Vec.with(U8), [1,2,3]));
    // const C = Vec.with(u8);
    // console.log(new C([Uint8Array.from([0x11]), Uint8Array.from([0x11]), Uint8Array.from([0x11])]));
    // new Vec(U8, [Uint8Array.from([0x11]), Uint8Array.from([0x11]), Uint8Array.from([0x11])]);

    // new Vec(Text, ['1', '23', '345', '4567', new Text('56789')])
    // console.log(getTypeDef(`{"elems":"Vec<u16>"}`))
    // console.log(getTypeDef("Vec<u16>"))
    // console.log(JSON.stringify(abi.constructors[0].args[1].type))
    // console.log(abi.constructors[0]('2100', [Uint8Array.from([0x11]), Uint8Array.from([0x11]), Uint8Array.from([0x11])], { elems: [1, 2] }, '18'));

    // console.log(abi.messages.totalSupply())
    // console.log(abi);
    // '0x4011';
    // console.log(createType('StorageData', u8aToU8a('0x206400000000000000')));
    // console.log(new U8a(JSON.parse("[\"0x0B\",\"0xC5\",\"0x58\",\"0x63\"]")).toHex())
    // console.log(createType('u32', 949181842).toHex())
    // console.log(createType('Bytes', JSON.parse('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]')))
    // console.log(compactAddLength('0x38935d92'))
    // console.log(compactAddLength(Uint8Array.from([ 56, 147, 93, 146 ])))
    // console.log(compactAddLength(new U8a(JSON.parse('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]')).toU8a(true)))
    // console.log(new U8a(JSON.parse('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]')).toU8a(true))
    // console.log(isU8a('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]'))
    // const code = fs.readFileSync(path.resolve(__dirname, './erc21.wasm'));
    // const abi = new Abi(erc21);
    // console.log(JSON.stringify(abi.abi.contract.messages))
    // chainx.api.rpc.chainx.contractCall(
    //     {
    //     origin: '5FjN2LCaoRfCR6Z78XHBE6SMCUPFPRWQD7bHU5M8qxrhTxjj',
    //     dest: '5GehVasZwiFufHR52jsEe3RdmVYzAr9o8PqxnR5bDSJFUKd6',
    //     gasLimit: 100000000,
    //     inputData: abi.messages.totalSupply(),
    //   }
    // );
    // console.log(
    //   createType('ContractCallRequest', {
    //     dest: '5D3b9xSw5PYK78pnZSzaS5aA5KJU5Zde8YZcX4icy3FFyL2D',
    //     gasLimit: 0,
    //     inputData: Uint8Array.from([16, 146, 93, 147, 56]),
    //     origin: '5FjN2LCaoRfCR6Z78XHBE6SMCUPFPRWQD7bHU5M8qxrhTxjj',
    //     value: 0,
    //   }).toHex()
    // );
  });

  xit('putCode', done => {
    const code = fs.readFileSync(path.resolve(__dirname, './erc20.wasm'));
    const ex = chainx.api.tx.xContracts.putCode(500000, compactAddLength(code));
    console.log(Test.publicKey());
    ex.signAndSend(Test, (error, result) => {
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

  xit('contractInfoOf', async () => {
    const result = await chainx.api.query.xContracts.contractInfoOf('5CBrqWdcpG3SfMtswjP654xgSNrTZuXDfGRX8D3QFsV4fcyg');
    console.log(result.toJSON());
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
    console.log(u8aToHex(codeHash));
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

  xit('instantiate', done => {
    const abi = new Abi(erc20);

    const ex = chainx.api.tx.xContracts.instantiate(
      1000,
      500000,
      '0x5e71dc66c1527bf4047942c5ada9c5c59941bff8eb8b2d1a6d849306bfd52e93',
      abi.constructors[0](800000003)
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
