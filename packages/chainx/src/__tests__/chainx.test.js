// import Chainx from '../index';
// import fs from 'fs';
// import path from 'path';
// import { compactAddLength, compactFromU8a, u8aToHex, hexToU8a, u8aToU8a, u8aConcat } from '@chainx/util';
// import { isU8a } from '@chainx/util';

// import { Abi } from '@chainx/api-contract';
// import { Bytes, U8a, createType, BTreeMap, u64, Method, XRC20Selector, Selector } from '@chainx/types';
// import { blake2AsU8a } from '@chainx/util-crypto';
// import erc20 from './erc20';

// describe('chainx.js', () => {
//   const chainx = new Chainx('ws://192.168.0.100:10001');
//   const Alice1 = chainx.account.from('0x446861696e582d41616963652020202020202020202020202020202020202020');
//   const Alice = chainx.account.from('0xabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115');
//   const Test = chainx.account.from('0x436861696e582d5361746f736869202020202020202020202020202020202020');

//   jest.setTimeout(30000);

//   beforeEach(async () => {
//     await chainx.isRpcReady();
//   });

//   it('erc21', async done => {
//     chainx.chain.convertToAsset('BTC', 100000, 0, 500000).then(extrinsic => {
//       extrinsic.signAndSend(Alice, (error, result) => {
//         console.log(error, result);
//       });
//     });
//     // const abi = new Abi(testabi2);
//     // const ex = await chainx.chain.convertToAsset(10000, 0, 500000);
//     // ex.signAndSend(Alice, (error, result) => {
//     //   console.log(error, result);
//     //   if (result) {
//     //     console.log(JSON.stringify(result));
//     //   }
//     // });
//     // const Cla = BTreeMap.with(XRC20Selector, Selector);
//     // console.log(new Cla('0x03000000009d64838c01e41dbb260238935d92').toJSON());
//     // chainx.api.rpc.chainx.contractXRCTokenInfo().then(data => {
//     //   const contractAddress = data.BTC.XRC20.address;
//     //   const selector = data.BTC.XRC20.selectors.Destroy;
//     //   const ex = chainx.api.tx.xContracts.call(
//     //     contractAddress, // contract address
//     //     0, // value
//     //     500000, // gas
//     //     u8aToHex(u8aConcat(hexToU8a(selector), new u64(10000).toU8a()))
//     //   );
//     //   console.log(ex.method.toU8a())
//     //   ex.signAndSend(Alice, (error, result) => {
//     //     console.log(error, result);
//     //     if (result) {
//     //       console.log(JSON.stringify(result));
//     //     }
//     //   });
//     // });
//     // console.log(
//     //   JSON.stringify(
//     //     createType(
//     //       'Vec<EventRecord>',
//     //       '0x1c000000000000000000010000000000000002000000040188dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0eee4ca00000000000000000200000005000c50435888dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee00ce153e3235448f29ca9052a660e36abd9b9fdc72f80a4059a2427ff06b1a37060004220700000000000000020000000400ce153e3235448f29ca9052a660e36abd9b9fdc72f80a4059a2427ff06b1a370604220700000000000000020000000d0188dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee67df26a755e0c31ac81e2ed530d147d7f2b9a3f5a570619048c562b1ed00dfdd000000000000000000000000000000000000000000000000000000000000000014070c4254432a5039bea4301370cea9d438b2fb9000e578b48fc4c77adebe42bbd513717f0903000000009d64838c01e41dbb260238935d92000002000000000000'
//     //     )
//     //       .filter(({ phase }) => phase.type === 'ApplyExtrinsic' && phase.value.eqn(2))
//     //       .map(event => {
//     //         const o = event.toJSON();
//     //         o.method = event.event.data.method;
//     //         return o;
//     //       })
//     //   )
//     // );
//     // console.log(new Method(
//     //   Uint8Array.from('0x14070c4254432a5039bea4301370cea9d438b2fb9000e578b48fc4c77adebe42bbd513717f0903000000009d64838c01e41dbb260238935d92')
//     // ));
//     // console.log(
//     //   chainx.api.tx.xContracts.setTokenErc20(
//     //     'BTC',
//     //     '5D2Bha2QbTHnuPL3B7BwVNkMAt1fYzdWnZuTKCJtERj64Rtd',
//     //     new Map([['Issue', '0x9d64838c'], ['BalanceOf', '0xe41dbb26'], ['TotalSupply', '0x38935d92']])
//     //   ).method.toHex()
//     // );
//     // chainx.api.tx.xContracts.setTokenErc20('BTC', '5D2Bha2QbTHnuPL3B7BwVNkMAt1fYzdWnZuTKCJtERj64Rtd', [
//     //   ['Issue', '0x9d64838c'],
//     //   ['BalanceOf', '0xe41dbb26'],
//     //   ['TotalSupply', '0x38935d92'],
//     // ]);
//     // const resp = chainx.trustee.getTrusteeSessionInfo(1);
//     // // console.log(Vec.with(U8), [1,2,3]));
//     // const C = Vec.with(u8);
//     // console.log(new C([Uint8Array.from([0x11]), Uint8Array.from([0x11]), Uint8Array.from([0x11])]));
//     // new Vec(U8, [Uint8Array.from([0x11]), Uint8Array.from([0x11]), Uint8Array.from([0x11])]);
//     // new Vec(Text, ['1', '23', '345', '4567', new Text('56789')])
//     // console.log(getTypeDef(`{"elems":"Vec<u16>"}`))
//     // console.log(getTypeDef("Vec<u16>"))
//     // console.log(JSON.stringify(abi.constructors[0].args[1].type))
//     // console.log(abi.constructors[0]('2100', [Uint8Array.from([0x11]), Uint8Array.from([0x11]), Uint8Array.from([0x11])], { elems: [1, 2] }, '18'));
//     // console.log(abi.messages.totalSupply());
//     // console.log(abi);
//     // '0x4011';
//     // console.log(createType('StorageData', u8aToU8a('0x206400000000000000')));
//     // console.log(new U8a(JSON.parse("[\"0x0B\",\"0xC5\",\"0x58\",\"0x63\"]")).toHex())
//     // console.log(createType('u32', 949181842).toHex())
//     // console.log(createType('Bytes', JSON.parse('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]')))
//     // console.log(compactAddLength('0x38935d92'))
//     // console.log(compactAddLength(Uint8Array.from([ 56, 147, 93, 146 ])))
//     // console.log(compactAddLength(new U8a(JSON.parse('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]')).toU8a(true)))
//     // console.log(new U8a(JSON.parse('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]')).toU8a(true))
//     // console.log(isU8a('[\"0x38\",\"0x93\",\"0x5D\",\"0x92\"]'))
//     // const code = fs.readFileSync(path.resolve(__dirname, './erc21.wasm'));
//     // const abi = new Abi(erc21);
//     // console.log(JSON.stringify(abi.abi.contract.messages))
//     // chainx.api.rpc.chainx.contractCall(
//     //     {
//     //     origin: '5FjN2LCaoRfCR6Z78XHBE6SMCUPFPRWQD7bHU5M8qxrhTxjj',
//     //     dest: '5GehVasZwiFufHR52jsEe3RdmVYzAr9o8PqxnR5bDSJFUKd6',
//     //     gasLimit: 100000000,
//     //     inputData: abi.messages.totalSupply(),
//     //   }
//     // );
//     // console.log(
//     //   createType('ContractCallRequest', {
//     //     dest: '5D3b9xSw5PYK78pnZSzaS5aA5KJU5Zde8YZcX4icy3FFyL2D',
//     //     gasLimit: 0,
//     //     inputData: Uint8Array.from([16, 146, 93, 147, 56]),
//     //     origin: '5FjN2LCaoRfCR6Z78XHBE6SMCUPFPRWQD7bHU5M8qxrhTxjj',
//     //     value: 0,
//     //   }).toHex()
//     // );
//   });

//   xit('transfer', done => {
//     const ex = chainx.api.tx.xAssets.transfer(Test.address(), 'PCX', 1000000000, '');
//     ex.signAndSend(Alice, (error, result) => {
//       console.log(error, result);
//     });
//   });

//   xit('putCode', done => {
//     const code = compactAddLength(fs.readFileSync(path.resolve(__dirname, './erc20.wasm')));
//     const ex = chainx.api.tx.xContracts.putCode(50000000, code);
//     ex.signAndSend(Test, (error, result) => {
//       console.log(error, result);
//       if (result && result.result === 'ExtrinsicSuccess') {
//         // 获取 codeHash
//         console.log(result.events.find(e => e.method === 'CodeStored').event.data);
//       }
//     });
//   });

//   xit('PristineCode', async () => {
//     const result = await chainx.api.query.xContracts.pristineCode(
//       '0x533eb91e0f1eeb6300cf98ec5181327d49487bf6350a284e9d8cde8deab2da74'
//     );
//     console.log(result.length);
//   });

//   xit('contractInfoOf', async () => {
//     const result = await chainx.api.query.xContracts.contractInfoOf('5CBrqWdcpG3SfMtswjP654xgSNrTZuXDfGRX8D3QFsV4fcyg');
//     console.log(result.toJSON());
//   });

//   xit('abi', () => {
//     const abi = new Abi(ssss);
//     console.log(abi.constructors[0]());
//   });

//   // 5Cwmuq1CdofyzVfa4dG2rWyq8Na8b8FmgkWgwRcr6p8rAy1H
//   xit('hash', () => {
//     const abi = new Abi(erc20);

//     const code = fs.readFileSync(path.resolve(__dirname, './erc20.wasm'));

//     const codeHash = blake2AsU8a(code);
//     console.log(u8aToHex(codeHash));
//     // console.log(createType('u128', 8000000000000).toU8a())
//     // console.log(blake2AsU8a(createType('u128', 8000000000000).toU8a()))
//     console.log(blake2AsU8a(createType('u64', 800000000).toU8a()));
//     console.log(u8aToU8a(Alice.publicKey()));
//     console.log(
//       chainx.account.encodeAddress(
//         blake2AsU8a(
//           u8aConcat(
//             codeHash,
//             // blake2AsU8a(abi.constructors[0](800000000)),
//             blake2AsU8a(createType('u64', 800000000).toU8a()),
//             // blake2AsU8a(compactAddLength(createType('u64', 800000000000).toU8a())),
//             u8aToU8a(Alice.publicKey())
//           )
//         )
//       )
//     );
//   });

//   xit('instantiate', done => {
//     const abi = new Abi(erc20);
//     const code = fs.readFileSync(path.resolve(__dirname, './erc20.wasm'));

//     const codeHash = u8aToHex(blake2AsU8a(code));

//     console.log(codeHash);
//     const ex = chainx.api.tx.xContracts.instantiate(0, 5000000, codeHash, abi.constructors[0](5, 'sss', 'www', 10));

//     ex.signAndSend(Alice, (error, result) => {
//       console.log(error, result);
//       if (result) {
//         console.log(JSON.stringify(result));
//       }
//     });
//   });

//   xit('call', done => {
//     const abi = new Abi(erc20);

//     const ex = chainx.api.tx.xContracts.call(
//       '5GE7vwvDmKCCPrVLc9XZJAiAspM9LhQWbQjPvZ3QxzBUbhT7', // contract address
//       0, // value
//       500000, // gas
//       abi.messages.transfer('5FvHGYk44FHZXznrhoskVyr2zGPYn5CpUXphRKM8eGRJZMtX', 10)
//     );

//     ex.signAndSend(Alice, (error, result) => {
//       console.log(error, result);
//       if (result) {
//         console.log(JSON.stringify(result));
//       }
//     });
//   });
// });
