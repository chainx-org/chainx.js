// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from '../../codec/Struct';
import Tuple from '../../codec/Tuple';
import Vector from '../../codec/Vector';
import Text from '../../Text';
import Type from '../../Type';

export class EventMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        arguments: Vector.with(Type),
        documentation: Vector.with(Text),
      },
      value
    );
  }
  /**
   * @description The arguments of [[Type]]
   */
  get arguments() {
    return this.get('arguments');
  }
  /**
   * @description The [[Text]] documentation
   */
  get documentation() {
    return this.get('documentation');
  }
  /**
   * @description The name for the event
   */
  get name() {
    return this.get('name');
  }
}
export class OuterEventMetadataEvent extends Tuple {
  constructor(value) {
    super(
      {
        Text,
        'Vec<EventMetadata>': Vector.with(EventMetadata),
      },
      value
    );
  }
  /**
   * @description The [[EventMetadata]]
   */
  get events() {
    return this[1];
  }
  /**
   * @description The name of the section
   */
  get name() {
    return this[0];
  }
}
export class OuterEventMetadata extends Struct {
  constructor(value) {
    super(
      {
        name: Text,
        events: Vector.with(OuterEventMetadataEvent),
      },
      value
    );
  }
  /**
   * @description The [[OuterEventMetadataEvent]]
   */
  get events() {
    return this.get('events');
  }
  /**
   * @description The name of the event
   */
  get name() {
    return this.get('name');
  }
}
