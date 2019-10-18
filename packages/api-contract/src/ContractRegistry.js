// Copyright 2017-2019 @polkadot/api-contract authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Compact } from '@chainx/types';
import { assert, isNumber, isString, isNull, isObject, isUndefined, stringCamelCase } from '@chainx/util';
import MetaRegistry from './MetaRegistry';
import { createArgClass } from './method';

export default class ContractRegistry extends MetaRegistry {
  // Contract ABI helpers
  validateArgs(name, args) {
    assert(Array.isArray(args), `Expected 'args' to exist on ${name}`);
    args.forEach(arg => {
      const unknownKeys = Object.keys(arg).filter(key => !['name', 'type'].includes(key));
      assert(unknownKeys.length === 0, `Unknown keys ${unknownKeys.join(', ')} found in ABI args for ${name}`);
      assert(isNumber(arg.name) && isString(this.stringAt(arg.name)), `${name} args should have valid name `);
      assert(isNumber(arg.type.ty) && isObject(this.typeDefAt(arg.type.ty)), `${name} args should have valid type`);
    });
  }

  validateConstructors({ contract: { constructors } }) {
    constructors.forEach((constructor, index) => {
      const unknownKeys = Object.keys(constructor).filter(key => !['args', 'docs', 'name', 'selector'].includes(key));
      assert(unknownKeys.length === 0, `Unknown keys ${unknownKeys.join(', ')} found in ABI constructor`);
      this.validateArgs(`constructor ${index}`, constructor.args);
    });
  }

  validateMethods({ contract: { messages } }) {
    messages.forEach(method => {
      const unknownKeys = Object.keys(method).filter(
        key => !['args', 'docs', 'mutates', 'name', 'selector', 'return_type'].includes(key)
      );
      assert(
        unknownKeys.length === 0,
        `Unknown keys ${unknownKeys.join(', ')} found in ABI args for messages.${method.name}`
      );
      const { name, selector, return_type: returnType } = method;
      assert(isNumber(name) && isString(this.stringAt(name)), `Expected name for messages.${method.name}`);
      assert(isNumber(selector), `Expected selector for messages.${method.name}`);
      assert(
        isNull(returnType) || (isNumber(returnType.ty) && isObject(this.typeDefAt(returnType.ty))),
        `Expected return_type for messages.${method.name}`
      );
      this.validateArgs(`messages.${method.name}`, method.args);
    });
  }
  validateAbi(abi) {
    const unknownKeys = Object.keys(abi.contract).filter(
      key => !['constructors', 'docs', 'events', 'messages', 'name'].includes(key)
    );
    assert(unknownKeys.length === 0, `Unknown fields ${unknownKeys.join(', ')} found in ABI`);
    const {
      contract: { constructors, messages, name },
    } = abi;
    assert(
      constructors && messages && isString(this.stringAt(name)),
      'ABI should have constructors, messages & name sections'
    );
    this.validateConstructors(abi);
    this.validateMethods(abi);
  }
  createMethod(name, method) {
    const args = method.args.map(({ name, type }) => {
      assert(isObject(type), `Invalid type at index ${type}`);
      return {
        name: stringCamelCase(name),
        type,
      };
    });
    const Clazz = createArgClass(args, isUndefined(method.selector) ? {} : { __selector: 'u32' });
    const baseStruct = { __selector: method.selector };
    const encoder = (...params) => {
      assert(
        params.length === args.length,
        `Expected ${args.length} arguments to contract ${name}, found ${params.length}`
      );
      const u8a = new Clazz(
        args.reduce(
          (mapped, { name }, index) => {
            mapped[name] = params[index];
            return mapped;
          },
          { ...baseStruct }
        )
      ).toU8a();
      return Compact.addLengthPrefix(u8a);
    };
    const fn = encoder;
    fn.args = args;
    fn.isConstant = !(method.mutates || false);
    fn.type = method.returnType || null;
    return fn;
  }
  convertAbi({ contract, storage }) {
    return {
      contract: this.convertContract(contract),
      storage: this.convertStorage(storage),
    };
  }
  convertArgs(args) {
    return args.map(({ name, type, ...arg }) => ({ ...arg, name: this.stringAt(name), type: this.convertType(type) }));
  }
  convertType({ ty, display_name: displayNameIndices }) {
    const displayName = this.stringsAt(displayNameIndices).join('::');
    return this.typeDefAt(ty, { displayName });
  }
  convertContract({ constructors, messages, name, events, ...contract }) {
    return {
      constructors: this.convertConstructors(constructors),
      messages: messages.map(method => this.convertMethod(method)),
      name: this.stringAt(name),
      ...(events ? { events: events.map(event => this.convertEvent(event)) } : {}),
      ...contract,
    };
  }
  convertConstructors(constructors) {
    return constructors.map(constructor => {
      return this.convertMethod(constructor);
    });
  }
  convertMethod({ args, name, return_type: returnType, ...method }) {
    return {
      ...method,
      args: this.convertArgs(args),
      name: this.stringAt(name),
      returnType: returnType ? this.convertType(returnType) : null,
    };
  }
  convertEvent({ args }) {
    return {
      args: this.convertArgs(args),
    };
  }
  convertStorage(storage) {
    return this.convertStorageStruct(storage);
  }
  convertStorageLayout(storageLayout) {
    if (storageLayout['struct.type']) {
      return this.convertStorageStruct(storageLayout);
    } else {
      return this.convertStorageRange(storageLayout);
    }
  }
  convertStorageStruct({ 'struct.type': structType, 'struct.fields': structFields }) {
    return {
      'struct.type': this.typeDefAt(structType),
      'struct.fields': structFields.map(({ name, layout }) => ({
        name: this.stringAt(name),
        layout: this.convertStorageLayout(layout),
      })),
    };
  }
  convertStorageRange({ 'range.elem_type': type, ...range }) {
    return {
      ...range,
      'range.elem_type': this.typeDefAt(type),
    };
  }
}
