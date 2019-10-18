// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from '../../codec/Struct';
import Vec from '../../codec/Vec';
import Text from '../../Text';
import U16 from '../../U16';

export class OuterDispatchCall extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        prefix: Text,
        index: U16,
      },
      value
    );
  }
  /**
   * @description The [[U16]] index for the call
   */
  get index() {
    return this.get('index');
  }
  /**
   * @description The name for the call
   */
  get name() {
    return this.get('name');
  }
  /**
   * @description The call prefix (or section)
   */
  get prefix() {
    return this.get('prefix');
  }
}
export class OuterDispatchMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        calls: Vec.with(OuterDispatchCall),
      },
      value
    );
  }
  /**
   * @description The [[OuterDispathCall]] wrapped
   */
  get calls() {
    return this.get('calls');
  }
  /**
   * @description The name for the dispatch
   */
  get name() {
    return this.get('name');
  }
}
