// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Struct from './codec/Struct';
import Tuple from './codec/Tuple';
import U8aFixed from './codec/U8aFixed';
import Vec from './codec/Vec';
import Text from './Text';
import U32 from './U32';
/**
 * @name ApiId
 * @description
 * An identifier for the runtime API
 */
export class ApiId extends U8aFixed {
  constructor(value) {
    super(value, 64);
  }
}
/**
 * @name RuntimeVersionApi
 * @description
 * A [[Tuple]] that conatins the [[ApiId]] and [[U32]] version
 */
export class RuntimeVersionApi extends Tuple {
  constructor(value) {
    super([ApiId, U32], value);
  }
  /**
   * @description The [[ApiId]]
   */
  get id() {
    return this[0];
  }
  /**
   * @description The specific version as [[U32]]
   */
  get version() {
    return this[1];
  }
}
/**
 * @name RuntimeVersion
 * @description
 * A defintion of the runtime and the associated versions thereof
 */
export default class RuntimeVersion extends Struct {
  constructor(value) {
    super(
      {
        specName: Text,
        implName: Text,
        authoringVersion: U32,
        specVersion: U32,
        implVersion: U32,
        apis: Vec.with(RuntimeVersionApi),
      },
      value,
      new Map([
        ['authoringVersion', 'authoring_version'],
        ['implName', 'impl_name'],
        ['implVersion', 'impl_version'],
        ['specName', 'spec_name'],
        ['specVersion', 'spec_version'],
      ])
    );
  }
  /**
   * @description The available APIs as [[RuntimeVersionApi]]
   */
  get apis() {
    return this.get('apis');
  }
  /**
   * @description The authoring version as [[U32]]
   */
  get authoringVersion() {
    return this.get('authoringVersion');
  }
  /**
   * @description The implementation name
   */
  get implName() {
    return this.get('implName');
  }
  /**
   * @description The implementation version
   */
  get implVersion() {
    return this.get('implVersion');
  }
  /**
   * @description The specification name
   */
  get specName() {
    return this.get('specName');
  }
  /**
   * @description The specification version
   */
  get specVersion() {
    return this.get('specVersion');
  }
}
