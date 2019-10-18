// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Option from '../../codec/Option';
import Struct from '../../codec/Struct';
import Vec from '../../codec/Vec';
import { StorageFunctionMetadata } from './Storage';
/**
 * @name ModuleMetadataV4
 * @description
 * The definition of a module in the system
 */
export class ModuleMetadataV4 extends Struct {
  constructor(value) {
    super(
      {
        name: 'Text',
        prefix: 'Text',
        storage: Option.with(Vec.with(StorageFunctionMetadata)),
        calls: Option.with('Vec<FunctionMetadataV4>'),
        events: Option.with('Vec<EventMetadataV4>'),
      },
      value
    );
  }
  /**
   * @description the module calls
   */
  get calls() {
    return this.get('calls');
  }
  /**
   * @description the module events
   */
  get events() {
    return this.get('events');
  }
  /**
   * @description the module name
   */
  get name() {
    return this.get('name');
  }
  /**
   * @description the module prefix
   */
  get prefix() {
    return this.get('prefix');
  }
  /**
   * @description the associated module storage
   */
  get storage() {
    return this.get('storage');
  }
}
/**
 * @name MetadataV4
 * @description
 * The runtime metadata as a decoded structure
 */
export default class MetadataV4 extends Struct {
  constructor(value) {
    super(
      {
        modules: Vec.with(ModuleMetadataV4),
      },
      value
    );
  }
  /**
   * @description The associated modules for this structure
   */
  get modules() {
    return this.get('modules');
  }
}
