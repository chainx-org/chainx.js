import { MetaRegistryItem, MetaTypeInfo, TypeDefInfo } from '@chainx/types/types';
import { assert } from '@chainx/util';
import { displayType, withTypeString } from '@chainx/types';
const { BuiltinPlain, BuiltinTuple, BuiltinArray, ClikeEnum, Enum, Struct, TupleStruct, Null } = MetaTypeInfo;
const { String, Type, TypeDef: TypeDefItem } = MetaRegistryItem;

export default class MetaRegistry {
  constructor({ registry: { strings, types } }) {
    this._strings = [];
    this._types = [];
    this.typeDefs = [];
    this._strings = strings;
    this._types = types;
    // Generate TypeDefs for each provided registry type
    this._types.forEach((_, index) => this.setTypeDefAtIndex(index + 1));
  }
  static detectedType({ def, id }) {
    assert(!def['union.fields'], 'Invalid union type definition found');
    let metaTypeInfo = MetaTypeInfo.Null;
    if (def === 'builtin') {
      if (typeof id === 'string') {
        metaTypeInfo = MetaTypeInfo.BuiltinPlain;
      }
      if (Array.isArray(id)) {
        metaTypeInfo = MetaTypeInfo.BuiltinTuple;
      }
      if (id['array.type']) {
        metaTypeInfo = MetaTypeInfo.BuiltinArray;
      }
    }
    if (def['enum.variants']) {
      metaTypeInfo = MetaTypeInfo.Enum;
    }
    if (def['clike_enum.variants']) {
      metaTypeInfo = MetaTypeInfo.ClikeEnum;
    }
    if (def['struct.fields']) {
      metaTypeInfo = MetaTypeInfo.Struct;
    }
    if (def['tuple_struct.types']) {
      metaTypeInfo = MetaTypeInfo.TupleStruct;
    }
    return metaTypeInfo;
  }
  hasItemAt(index, variant) {
    switch (variant) {
      case String:
        return this._strings && !!this._strings[index - 1];
      case Type:
        return this._types && !!this._types[index - 1];
      case TypeDefItem:
        return this.typeDefs && !!this.typeDefs[index - 1];
    }
  }
  itemAt(index, variant) {
    assert(this.hasItemAt(index, variant), `MetaRegistry: Invalid ${variant} index ${index} found in metadata`);
    switch (variant) {
      case String:
        return this._strings[index - 1];
      case Type:
        return this._types[index - 1];
      case TypeDefItem:
        return this.typeDefs[index - 1];
    }
  }
  itemsAt(indices, variant) {
    return indices.map(index => {
      return this.itemAt(index, variant);
    });
  }
  stringAt(index) {
    return this.itemAt(index, String);
  }
  stringsAt(indices) {
    return this.itemsAt(indices, String);
  }
  typeAt(index) {
    return this.itemAt(index, Type);
  }
  typesAt(indices) {
    return this.itemsAt(indices, Type);
  }
  hasTypeDefAt(index) {
    return this.hasItemAt(index, TypeDefItem);
  }
  typeDefAt(index, extra = {}) {
    return {
      ...this.itemAt(index, TypeDefItem),
      ...extra,
    };
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
    switch (MetaRegistry.detectedType(metaType)) {
      case BuiltinPlain:
        typeDef = this.typeDefForBuiltinPlain(metaType.id);
        break;
      case BuiltinTuple:
        typeDef = this.typeDefForBuiltinTuple(metaType.id);
        break;
      case BuiltinArray:
        typeDef = this.typeDefForBuiltinArray(metaType.id, typeIndex);
        break;
      case Enum:
        typeDef = this.typeDefForEnum(metaType.def, metaType.id, typeIndex);
        break;
      case ClikeEnum:
        typeDef = this.typeDefForClikeEnum(metaType.def);
        break;
      case Struct:
        typeDef = this.typeDefForStruct(metaType.def);
        break;
      case TupleStruct:
        typeDef = this.typeDefForTupleStruct(metaType.def);
        break;
      case Null:
      default:
        throw new Error(`Invalid type detected at index ${typeIndex}`);
    }
    return typeDef;
  }
  typeDefFromMetaType(metaType, typeIndex) {
    const typeDef = {
      info: TypeDefInfo.Null,
      type: '',
      ...this.typeDefDefFields(metaType, typeIndex),
      ...this.typeDefIdFields(metaType),
    };
    return withTypeString(typeDef);
  }
  setTypeDefAtIndex(typeIndex) {
    const metaType = this.typeAt(typeIndex);
    this.typeDefs[typeIndex - 1] = this.typeDefFromMetaType(metaType, typeIndex);
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
  typeDefForBuiltinArray(id, typeIndex) {
    const { 'array.type': vecTypeIndex, 'array.len': vecLength } = id;
    assert(!vecLength || vecLength <= 256, 'MetaRegistry: Only support for [Type; <length>], where length <= 256');
    assert(
      !typeIndex || vecTypeIndex !== typeIndex,
      `MetaRegistry: self-referencing registry type at index ${typeIndex}`
    );
    const type = displayType(this.typeDefFromMetaTypeAt(vecTypeIndex));
    assert(type && type.length > 0, `MetaRegistry: Invalid vector type found at index ${typeIndex}`);
    return {
      ...(vecLength
        ? {
            info: TypeDefInfo.VecFixed,
            ext: { length: vecLength, type },
            type: `[${type};${vecLength}]`,
          }
        : {
            info: TypeDefInfo.Vec,
            type: `Vec<${type}>`,
          }),
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
    const sub = def['clike_enum.variants'].map(({ name: nameIndex, discriminant }) => {
      return {
        ext: { discriminant },
        info: TypeDefInfo.Plain,
        name: this.stringAt(nameIndex),
        type: 'Null',
      };
    });
    return {
      info: TypeDefInfo.Enum,
      sub,
    };
  }
  typeDefForOption(id, typeIndex) {
    assert(id['custom.params'][0], `Invalid Option type defined at index ${typeIndex}`);
    return {
      info: TypeDefInfo.Option,
      sub: this.typeDefFromMetaTypeAt(id['custom.params'][0]),
    };
  }
  typeDefForResult(id, typeIndex) {
    assert(id['custom.params'][0] && id['custom.params'][1], `Invalid Result type defined at index ${typeIndex}`);
    return {
      info: TypeDefInfo.Result,
      sub: id['custom.params'].map(typeIndex => this.typeDefFromMetaTypeAt(typeIndex)),
    };
  }
  typeDefForStruct(def) {
    const structFields = def['struct.fields'] || def['struct_variant.fields'];
    const structNameIndex = def['struct_variant.name'];
    const sub = structFields.map(field => {
      const { name: nameIndex, type: fieldTypeIndex } = field;
      return {
        ...this.typeDefFromMetaTypeAt(fieldTypeIndex),
        name: this.stringAt(nameIndex),
      };
    });
    return withTypeString({
      info: TypeDefInfo.Struct,
      ...(structNameIndex
        ? {
            name: this.stringAt(structNameIndex),
          }
        : {}),
      sub,
    });
  }
  typeDefForTupleStruct(def) {
    const tupleStructTypes = def['tuple_struct.types'] || def['tuple_struct_variant.types'];
    const tupleStructNameIndex = def['tuple_struct_variant.name'];
    const sub = tupleStructTypes.map((tupleStructFieldTypeIndex, index) => {
      return {
        ...this.typeDefFromMetaTypeAt(tupleStructFieldTypeIndex),
        index,
      };
    });
    return withTypeString({
      info: TypeDefInfo.Tuple,
      ...(tupleStructNameIndex
        ? {
            name: this.stringAt(tupleStructNameIndex),
          }
        : {}),
      sub,
    });
  }
}
