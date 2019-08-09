// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { blake2AsU8a } from '@chainx/util-crypto';
import Struct from './codec/Struct';
import Extrinsics from './Extrinsics';
import Hash from './Hash';
import Header from './Header';
/**
 * @name Block
 * @description
 * A block encoded with header and extrinsics
 */
export default class Block extends Struct {
  constructor(value) {
    super(
      {
        header: Header,
        extrinsics: Extrinsics,
      },
      value
    );
  }
  /**
   * @description The [[Extrinsics]] conatined in the block
   */
  get extrinsics() {
    return this.get('extrinsics');
  }
  /**
   * @description Coinvenience getter, encoded the [[Hash]] for the block
   */
  get hash() {
    return new Hash(blake2AsU8a(this.toU8a(), 256));
  }
  /**
   * @description The [[Header]] in the block
   */
  get header() {
    return this.get('header');
  }
}
