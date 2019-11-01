// Copyright 2017-2019 @polkadot/api-contract authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { MetaRegistryItem, MetaTypeInfo, TypeDefInfo } from '@chainx/types/types';
import { assert } from '@chainx/util';
import { displayType, withTypeString } from '@chainx/types';
const builtinMap = [
  [id => typeof id === 'string', MetaTypeInfo.BuiltinPlain],
  [id => Array.isArray(id), MetaTypeInfo.BuiltinTuple],
  [id => !!id['array.type'], MetaTypeInfo.BuiltinVecFixed],
  [id => !!id['slice.type'], MetaTypeInfo.BuiltinVec],
];
const typeMap = [
  ['enum.variants', MetaTypeInfo.Enum],
  ['clike_enum.variants', MetaTypeInfo.ClikeEnum],
  ['struct.fields', MetaTypeInfo.Struct],
  ['tuple_struct.types', MetaTypeInfo.TupleStruct],
];
function detectedType({ def, id }) {
  assert(!def['union.fields'], 'Invalid union type definition found');
  const lookup = def === 'builtin' ? builtinMap.find(([test]) => test(id)) : typeMap.find(([test]) => !!def[test]);
  return lookup ? lookup[1] : MetaTypeInfo.Null;
}
class MetadataRegistryLookup {
  constructor({ registry: { strings, types } }) {
    this._strings = [];
    this._types = [];
    this.typeDefs = [];
    this._strings = strings;
    this._types = types;
  }
  hasItemAt(index, variant) {
    switch (variant) {
      case MetaRegistryItem.String:
        return this._strings && !!this._strings[index - 1];
      case MetaRegistryItem.Type:
        return this._types && !!this._types[index - 1];
      case MetaRegistryItem.TypeDef:
        return this.typeDefs && !!this.typeDefs[index - 1];
    }
  }
  itemAt(index, variant) {
    assert(this.hasItemAt(index, variant), `MetaRegistry: Invalid ${variant} index ${index} found in metadata`);
    switch (variant) {
      case MetaRegistryItem.String:
        return this._strings[index - 1];
      case MetaRegistryItem.Type:
        return this._types[index - 1];
      case MetaRegistryItem.TypeDef:
        return this.typeDefs[index - 1];
    }
  }
  itemsAt(indices, variant) {
    return indices.map(index => this.itemAt(index, variant));
  }
  stringAt(index) {
    return this.itemAt(index, MetaRegistryItem.String);
  }
  stringsAt(indices) {
    return this.itemsAt(indices, MetaRegistryItem.String);
  }
  typeAt(index) {
    return this.itemAt(index, MetaRegistryItem.Type);
  }
  typesAt(indices) {
    return this.itemsAt(indices, MetaRegistryItem.Type);
  }
  hasTypeDefAt(index) {
    return this.hasItemAt(index, MetaRegistryItem.TypeDef);
  }
  typeDefAt(index, extra = {}) {
    return {
      ...this.itemAt(index, MetaRegistryItem.TypeDef),
      ...extra,
    };
  }
}
export default class MetaRegistry extends MetadataRegistryLookup {
  constructor(json) {
    super(json);
    // Generate TypeDefs for each provided registry type
    this._types.forEach((_, index) => this.setTypeDefAtIndex(index + 1));
  }
  setTypeDefAtIndex(typeIndex) {
    this.typeDefs[typeIndex - 1] = this.typeDefFromMetaType(this.typeAt(typeIndex), typeIndex);
  }
  typeDefIdFields({ id }) {
    const { 'custom.name': nameIndex, 'custom.namespace': namespaceIndices, 'custom.params': paramsIndices } = id;
    if (!nameIndex) {
      return {};
    }
    return {
      name: this.stringAt(nameIndex),
      ...(namespaceIndices && namespaceIndices.length
        ? { namespace: this.stringsAt(namespaceIndices).join('::') }
        : {}),
      ...(paramsIndices && paramsIndices.length
        ? { params: this.typesAt(paramsIndices).map(type => this.typeDefFromMetaType(type)) }
        : {}),
    };
  }
  typeDefDefFields(metaType, typeIndex) {
    let typeDef;
    switch (detectedType(metaType)) {
      case MetaTypeInfo.BuiltinPlain:
        typeDef = this.typeDefForBuiltinPlain(metaType.id);
        break;
      case MetaTypeInfo.BuiltinTuple:
        typeDef = this.typeDefForBuiltinTuple(metaType.id);
        break;
      case MetaTypeInfo.BuiltinVec:
        typeDef = this.typeDefForBuiltinVec(metaType.id, typeIndex);
        break;
      case MetaTypeInfo.BuiltinVecFixed:
        typeDef = this.typeDefForBuiltinVecFixed(metaType.id, typeIndex);
        break;
      case MetaTypeInfo.Enum:
        typeDef = this.typeDefForEnum(metaType.def, metaType.id, typeIndex);
        break;
      case MetaTypeInfo.ClikeEnum:
        typeDef = this.typeDefForClikeEnum(metaType.def);
        break;
      case MetaTypeInfo.Struct:
        typeDef = this.typeDefForStruct(metaType.def);
        break;
      case MetaTypeInfo.TupleStruct:
        typeDef = this.typeDefForTupleStruct(metaType.def);
        break;
      case MetaTypeInfo.Null:
      default:
        throw new Error(`Invalid type detected at index ${typeIndex}`);
    }
    return typeDef;
  }
  typeDefFromMetaType(metaType, typeIndex) {
    return withTypeString({
      info: TypeDefInfo.Null,
      type: '',
      ...this.typeDefDefFields(metaType, typeIndex),
      ...this.typeDefIdFields(metaType),
    });
  }
  typeDefFromMetaTypeAt(typeIndex) {
    if (!this.hasTypeDefAt(typeIndex)) {
      this.setTypeDefAtIndex(typeIndex);
    }
    return this.typeDefAt(typeIndex);
  }
  typeDefForEnumVariant(variant) {
    const { 'unit_variant.name': unitNameIndex } = variant;
    if (unitNameIndex) {
      return {
        info: TypeDefInfo.Plain,
        name: this.stringAt(unitNameIndex),
        type: 'Null',
      };
    }
    const { 'tuple_struct_variant.name': tupleStructVariantNameIndex } = variant;
    if (tupleStructVariantNameIndex) {
      return this.typeDefForTupleStruct(variant);
    }
    const { 'struct_variant.name': structVariantNameIndex } = variant;
    if (structVariantNameIndex) {
      return this.typeDefForStruct(variant);
    }
    return {
      info: TypeDefInfo.Null,
      type: 'Null',
    };
  }
  typeDefForBuiltinPlain(id) {
    return {
      info: TypeDefInfo.Plain,
      type: id,
    };
  }
  typeDefForBuiltinTuple(id) {
    const sub = id.map(tupleTypeIndex => this.typeDefFromMetaTypeAt(tupleTypeIndex));
    return {
      info: TypeDefInfo.Tuple,
      sub,
    };
  }
  typeDefForBuiltinVec(id, typeIndex) {
    const { 'slice.type': vecTypeIndex } = id;
    assert(
      !typeIndex || vecTypeIndex !== typeIndex,
      `MetaRegistry: self-referencing registry type at index ${typeIndex}`
    );
    const type = displayType(this.typeDefFromMetaTypeAt(vecTypeIndex));
    assert(type && type.length > 0, `MetaRegistry: Invalid builtin Vec type found at index ${typeIndex}`);
    return {
      info: TypeDefInfo.Vec,
      type: `Vec<${type}>`,
      sub: this.typeDefFromMetaTypeAt(vecTypeIndex),
    };
  }
  typeDefForBuiltinVecFixed(id, typeIndex) {
    const { 'array.type': vecTypeIndex, 'array.len': vecLength } = id;
    assert(!vecLength || vecLength <= 256, 'MetaRegistry: Only support for [Type; <length>], where length <= 256');
    assert(
      !typeIndex || vecTypeIndex !== typeIndex,
      `MetaRegistry: self-referencing registry type at index ${typeIndex}`
    );
    const type = displayType(this.typeDefFromMetaTypeAt(vecTypeIndex));
    assert(type && type.length > 0, `MetaRegistry: Invalid vector type found at index ${typeIndex}`);
    return {
      info: TypeDefInfo.VecFixed,
      ext: { length: vecLength, type },
      type: `[${type};${vecLength}]`,
      sub: this.typeDefFromMetaTypeAt(vecTypeIndex),
    };
  }
  typeDefForEnum(def, id, typeIndex) {
    const name = id && this.stringAt(id['custom.name']);
    switch (name) {
      case 'Option':
        return this.typeDefForOption(id, typeIndex);
      case 'Result':
        return this.typeDefForResult(id, typeIndex);
      default: {
        const sub = def['enum.variants'].map(variant => this.typeDefForEnumVariant(variant));
        return {
          info: TypeDefInfo.Enum,
          sub,
        };
      }
    }
  }
  typeDefForClikeEnum(def) {
    return {
      info: TypeDefInfo.Enum,
      sub: def['clike_enum.variants'].map(({ name: nameIndex, discriminant }) => ({
        ext: { discriminant },
        info: TypeDefInfo.Plain,
        name: this.stringAt(nameIndex),
        type: 'Null',
      })),
    };
  }
  typeDefForOption(id, typeIndex) {
    assert(id['custom.params'] && id['custom.params'][0], `Invalid Option type defined at index ${typeIndex}`);
    return {
      info: TypeDefInfo.Option,
      sub: this.typeDefFromMetaTypeAt(id['custom.params'][0]),
    };
  }
  typeDefForResult(id, typeIndex) {
    assert(
      id['custom.params'] && id['custom.params'][0] && id['custom.params'][1],
      `Invalid Result type defined at index ${typeIndex}`
    );
    return {
      info: TypeDefInfo.Result,
      sub: id['custom.params'].map(typeIndex => this.typeDefFromMetaTypeAt(typeIndex)),
    };
  }
  typeDefForStruct(def) {
    const structFields = def['struct.fields'] || def['struct_variant.fields'];
    const structNameIndex = def['struct_variant.name'];
    return withTypeString({
      info: TypeDefInfo.Struct,
      ...(structNameIndex ? { name: this.stringAt(structNameIndex) } : {}),
      sub: structFields.map(field => ({
        ...this.typeDefFromMetaTypeAt(field.type),
        name: this.stringAt(field.name),
      })),
    });
  }
  typeDefForTupleStruct(def) {
    const tupleStructTypes = def['tuple_struct.types'] || def['tuple_struct_variant.types'];
    const tupleStructNameIndex = def['tuple_struct_variant.name'];
    return withTypeString({
      info: TypeDefInfo.Tuple,
      ...(tupleStructNameIndex ? { name: this.stringAt(tupleStructNameIndex) } : {}),
      sub: tupleStructTypes.map((fieldIndex, index) => ({
        ...this.typeDefFromMetaTypeAt(fieldIndex),
        index,
      })),
    });
  }
}
