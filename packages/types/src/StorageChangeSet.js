// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from './codec/Struct';
import Vector from './codec/Vector';
import Hash from './Hash';
import { KeyValueOption } from './KeyValue';
/**
 * @name StorageChangeSet
 * @description
 * A set of storage changes. It contains the [[Block]] hash and
 * a list of the actual changes that took place as an array of
 * [[KeyValueOption]]
 */
export default class StorageChangeSet extends Struct {
  constructor(value) {
    super(
      {
        block: Hash,
        changes: Vector.with(KeyValueOption),
      },
      value
    );
  }
  /**
   * @description The applicable changes as [[KeyValueOption]]
   */
  get changes() {
    return this.get('changes');
  }
  /**
   * @description The block [[Hash]]
   */
  get block() {
    return this.get('block');
  }
}
