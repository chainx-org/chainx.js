// Copyright 2017-2019 @polkadot/api-contract authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { stringCamelCase } from '@chainx/util';
import ContractRegistry from './ContractRegistry';

export default class ContractAbi extends ContractRegistry {
  constructor(abi) {
    super(abi);
    this.messages = {};
    [this.abi, this.constructors, this.messages] = this.decodeAbi(abi);
  }

  decodeAbi(abiPre) {
    this.validateAbi(abiPre);
    const abi = this.convertAbi(abiPre);
    const constructors = abi.contract.constructors.map((constructor, index) => {
      return this.createMethod(`constructor ${index}`, constructor);
    });
    const messages = {};
    abi.contract.messages.forEach(method => {
      const name = stringCamelCase(method.name);
      messages[name] = this.createMethod(`messages.${name}`, method);
    });
    return [abi, constructors, messages];
  }
}
