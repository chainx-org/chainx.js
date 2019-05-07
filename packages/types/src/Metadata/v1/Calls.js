// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from '../../codec/Struct';
import Vector from '../../codec/Vector';
import Text from '../../Text';
import Type from '../../Type';
export class MetadataCallArg extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        type: Type,
      },
      value
    );
  }
  /**
   * @description The argument name
   */
  get name() {
    return this.get('name');
  }
  /**
   * @description The [[Type]]
   */
  get type() {
    return this.get('type');
  }
}
/**
 * @name MetadataCall
 * @description
 * The definition of a call
 */
export class MetadataCall extends Struct {
  constructor(value) {
    super(
      {
        // NOTE Just commented out, it is not available in current, but an open question
        // around the usefulness of supplying this remains (could be re-added)
        // id: u16,
        name: Text,
        args: Vector.with(MetadataCallArg),
        documentation: Vector.with(Text),
      },
      value
    );
  }
  /**
   * @description The [[MetadataCallArg]] for arguments
   */
  get args() {
    return this.get('args');
  }
  /**
   * @description The [[Text]] documentation
   */
  get documentation() {
    return this.get('documentation');
  }
  /**
   * @description The [[Text]] documentation
   * @deprecated Use `.documentation` instead.
   */
  get docs() {
    return this.documentation;
  }
  // /**
  //  * @description The call function id
  //  */
  // get id (): u16 {
  //   return this.get('id') as u16;
  // }
  /**
   * @description The call name
   */
  get name() {
    return this.get('name');
  }
}
