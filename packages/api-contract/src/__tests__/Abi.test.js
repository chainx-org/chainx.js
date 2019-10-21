import ercAbi from '../../test/contracts/Erc20.json';

import { Abi } from '..';

describe('Abi', () => {
  describe('erc20', () => {
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
});
