// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from '../../codec/Struct';
import Vector from '../../codec/Vector';
import Text from '../../Text';
import Type from '../../Type';
/**
 * @name MetadataEvent
 * @description
 * The definition of an event
 */
export class MetadataEvent extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        args: Vector.with(Type),
        docs: Vector.with(Text),
      },
      value
    );
  }
  /**
   * @description The [[Type]] for args
   */
  get args() {
    return this.get('args');
  }
  /**
   * @description The [[Text]] documentation
   */
  get docs() {
    return this.get('docs');
  }
  /**
   * @description The call name
   */
  get name() {
    return this.get('name');
  }
}
