import { assert } from '@chainx/util';
import Abi from './Abi';

export default class RxBase {
  constructor(api, abi) {
    this.abi = abi instanceof Abi ? abi : new Abi(abi);
    this.api = api;
    // cater for substrate 2.x & 1.x (in order)
    this.apiContracts = api.tx.contracts || api.tx.contract;
    assert(
      this.apiContracts && this.apiContracts.putCode,
      'You need to connect to a node with the contracts module, the metadata does not enable api.tx.contracts on this instance'
    );
  }
}
