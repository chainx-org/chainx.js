// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from '../../codec/Struct';
import Vec from '../../codec/Vec';
import { StorageEntryMetadata, StorageEntryType } from '../v6/Storage';
// Re-export classes that haven't changed between V6 and V7
export { StorageEntryMetadata, StorageEntryType };
export class StorageMetadata extends Struct {
  constructor(value) {
    super(
      {
        prefix: 'Text',
        // NOTE renamed to items from entries (since Struct already has entries from Map)
        items: Vec.with(StorageEntryMetadata),
      },
      value
    );
  }
  /**
   * @description the storage entries
   */
  get items() {
    return this.get('items');
  }
  /**
   * @description the prefix for this module
   */
  get prefix() {
    return this.get('prefix');
  }
}
