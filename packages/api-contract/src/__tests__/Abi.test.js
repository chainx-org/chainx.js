import ercAbi from '../../test/contracts/Erc20.json';

import { Abi } from '..';
import abijson from './abi';
import testabijson from './testabi';
import testabijson1 from './testabi1';
import { createArgClass } from '../method';
import { encodeType } from '@chainx/types';

describe('Abi', () => {
  it('abi', () => {
    const abi = new Abi(testabijson1);
    console.log(abi.messages.balanceOf('5QpTfTDYSLWkuVEvRqEcugQtFZnhE3qyJLCzwGQgdzNRpiSQ'));
  });

  describe.skip('erc20', () => {
    let abi;
    beforeEach(() => {
      abi = new Abi(ercAbi);
    });
    it('has the attached methods', () => {
      expect(Object.keys(abi.messages)).toEqual([
        'totalSupply',
        'balanceOf',
        'allowance',
        'transfer',
        'approve',
        'transferFrom',
      ]);
    });
  });
  describe.skip('params', () => {
    let abi;

    beforeEach(() => {
      abi = new Abi(abijson);
    });

    it('u128', () => {
      const data = abi.constructors[0](8000000000000);
      expect(Array.from(data)).toEqual([64, 0, 128, 40, 165, 70, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it.skip('createArgClass', () => {
      const aaa = new createArgClass([{ name: 'initValue', type: { info: 6, type: 'u128', displayName: 'Balance' } }], {
        __selector: 'u32',
      });

      console.log(new aaa({ __selector: 0, initValue: 8000000000000 }).toU8a());
      // console.log(encodeType('u128'))
    });
  });
});
