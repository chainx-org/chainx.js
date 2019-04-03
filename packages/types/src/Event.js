// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isUndefined, stringCamelCase, u8aToHex, hexToBn } from '@polkadot/util';
import Struct from './codec/Struct';
import Tuple from './codec/Tuple';
import U8aFixed from './codec/U8aFixed';
import { getTypeClass, getTypeDef } from './codec/createType';

const EventTypes = {};
/**
 * @name EventData
 * @description
 * Wrapper for the actual data that forms part of an [[Event]]
 */
export class EventData extends Tuple {
  constructor(Types, value, typeDef, meta, section, method) {
    super(Types, value);
    this._meta = meta;
    this._method = method;
    this._section = section;
    this._typeDef = typeDef;
  }
  /**
   * @description The wrapped [[EventMetadata]]
   */
  get meta() {
    return this._meta;
  }
  /**
   * @description The method as a string
   */
  get method() {
    return this._method;
  }
  /**
   * @description The section as a string
   */
  get section() {
    return this._section;
  }
  /**
   * @description The [[TypeDef]] for this event
   */
  get typeDef() {
    return this._typeDef;
  }
}
/**
 * @name EventIndex
 * @description
 * This follows the same approach as in [[Method]], we have the `[sectionIndex, methodIndex]` pairing
 * that indicates the actual event fired
 */
export class EventIndex extends U8aFixed {
  constructor(value) {
    super(value, 16);
  }

  toJSON() {
    return hexToBn(this.toHex(), { isLe: true, isNegative: true }).toNumber();
  }
}
/**
 * @name Event
 * @description
 * A representation of a system event. These are generated via the [[Metadata]] interfaces and
 * specific to a specific Substrate runtime
 */
export default class Event extends Struct {
  // Currently we _only_ decode from Uint8Array, since we expect it to
  // be used via EventRecord
  constructor(_value) {
    const { DataType, value } = Event.decodeEvent(_value);
    super(
      {
        index: EventIndex,
        data: DataType,
      },
      value
    );
  }
  static decodeEvent(value) {
    const index = value.subarray(0, 2);
    const DataType = EventTypes[index.toString()];
    if (isUndefined(DataType)) {
      throw new Error(`Unable to decode event for index ${u8aToHex(index)}`);
    }
    return {
      DataType,
      value: {
        index,
        data: value.subarray(2),
      },
    };
  }
  // This is called/injected by the API on init, allowing a snapshot of
  // the available system events to be used in lookups
  static injectMetadata(metadata) {
    metadata.events.forEach((section, sectionIndex) => {
      const sectionName = stringCamelCase(section.name.toString());
      section.events.forEach((meta, methodIndex) => {
        const methodName = meta.name.toString();
        const eventIndex = new Uint8Array([sectionIndex, methodIndex]);
        const typeDef = meta.arguments.map(arg => getTypeDef(arg));
        const Types = typeDef.map(getTypeClass);
        EventTypes[eventIndex.toString()] = class EventData extends EventData {
          constructor(value) {
            super(Types, value, typeDef, meta, sectionName, methodName);
          }
        };
      });
    });
  }
  /**
   * @description The wrapped [[EventData]]
   */
  get data() {
    return this.get('data');
  }
  /**
   * @description The [[EventIndex]], identifying the raw event
   */
  get index() {
    return this.get('index');
  }
  /**
   * @description The [[EventMetadata]] with the documentation
   */
  get meta() {
    return this.data.meta;
  }
  /**
   * @description The method string identifying the event
   */
  get method() {
    return this.data.method;
  }
  /**
   * @description The section string identifying the event
   */
  get section() {
    return this.data.section;
  }
  /**
   * @description The [[TypeDef]] for the event
   */
  get typeDef() {
    return this.data.typeDef;
  }

  // event to json
  toJSON() {
    const desc = this.meta.toJSON();
    return {
      index: this.index.toJSON(),
      method: this.method,
      desc: desc && desc.documentation && desc.documentation.join('\n'),
      data: this.data.toJSON(),
    };
  }
}
