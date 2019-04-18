// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Text from './Text';
const ALLOWED_BOXES = ['Compact', 'Option', 'Vec', 'BTreeMap'];
/**
 * @name Type
 * @description
 * This is a extended version of String, specifically to handle types. Here we rely fully
 * on what string provides us, however we also adjust the types received from the runtime,
 * i.e. we remove the `T::` prefixes found in some types for consistency accross implementation.
 */
export default class Type extends Text {
  constructor(value = '') {
    // First decode it with Text
    const textValue = new Text(value);
    // Then cleanup the textValue to get the @polkadot/types type, and pass the
    // sanitized value to constructor
    super(Type.decodeType(textValue.toString()));
    this._originalLength = textValue.encodedLength;
  }
  static decodeType(value) {
    const mappings = [
      // alias <T::InherentOfflineReport as InherentOfflineReport>::Inherent -> InherentOfflineReport
      Type._alias('<T::InherentOfflineReport as InherentOfflineReport>::Inherent', 'InherentOfflineReport'),
      // <T::Balance as HasCompact>
      Type._cleanupCompact(),
      // Remove all the trait prefixes
      Type._removeTraits(),
      // remove PairOf<T> -> (T, T)
      Type._removePairOf(),
      // remove boxing, `Box<Proposal>` -> `Proposal`
      Type._removeWrap('Box'),
      // remove generics, `MisbehaviorReport<Hash, BlockNumber>` -> `MisbehaviorReport`
      Type._removeGenerics(),
      // alias XString -> Text
      Type._alias('XString', 'Text'),
      // alias String -> Text (compat with jsonrpc methods)
      Type._alias('String', 'Text'),
      // alias () -> Null
      Type._alias('\\(\\)', 'Null'),
      // alias Vec<u8> -> Bytes
      Type._alias('Compact<Index>', 'IndexCompact'),
      // alias Vec<u8> -> Bytes
      Type._alias('Vec<u8>', 'Bytes'),
      // alias RawAddress -> Address
      Type._alias('keys::Address', 'BTCAddress'),
      // alias RawAddress -> Address
      Type._alias('RawAddress', 'Address'),
      // alias Lookup::Source to Address (_could_ be AccountId on certain chains)
      Type._alias('Lookup::Source', 'Address'),
      // alias Lookup::Target to AccountId (always the case)
      Type._alias('Lookup::Target', 'AccountId'),
      // flattens tuples with one value, `(AccountId)` -> `AccountId`
      Type._flattenSingleTuple(),
    ];
    return mappings
      .reduce((result, fn) => {
        return fn(result);
      }, value)
      .trim();
  }
  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  get encodedLength() {
    // NOTE Length is used in the decoding calculations, so return the original (pre-cleanup)
    // length of the data. Since toU8a is disabled, this does not affect encoding, but rather
    // only the decoding leg, allowing the decoders to work with original pointers
    return this._originalLength;
  }
  /**
   * @description Encodes the value as a Uint8Array as per the parity-codec specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a(isBare) {
    // Note Since we are mangling what we get in beyond recognition, we really should
    // not allow the re-encoding. Additionally, this is probably more of a decoder-only
    // helper, so treat it as such.
    throw new Error('Type::toU8a: unimplemented');
  }
  // given a starting index, find the closing >
  static _findClosing(value, start) {
    let depth = 0;
    for (let index = start; index < value.length; index++) {
      if (value[index] === '>') {
        if (!depth) {
          return index;
        }
        depth--;
      } else if (value[index] === '<') {
        depth++;
      }
    }
    throw new Error(`Unable to find closing matching <> on '${value}' (start ${start})`);
  }
  static _alias(src, dest) {
    return value => {
      return value.replace(new RegExp(src, 'g'), dest);
    };
  }
  static _cleanupCompact() {
    return value => {
      for (let index = 0; index < value.length; index++) {
        if (value[index] !== '<') {
          continue;
        }
        const end = Type._findClosing(value, index + 1) - 14;
        if (value.substr(end, 14) === ' as HasCompact') {
          value = `Compact<${value.substr(index + 1, end - index - 1)}>`;
        }
      }
      return value;
    };
  }
  static _flattenSingleTuple() {
    return value => {
      return value.replace(/\(([^,]*)\)/, '$1');
    };
  }
  static _removeGenerics() {
    return value => {
      for (let index = 0; index < value.length; index++) {
        if (value[index] === '<') {
          // check against the allowed wrappers, be it Vec<..>, Option<...> ...
          const box = ALLOWED_BOXES.find(box => {
            const start = index - box.length;
            return start >= 0 && value.substr(start, box.length) === box;
          });
          // we have not found anything, unwrap generic innards
          if (!box) {
            const end = Type._findClosing(value, index + 1);
            value = `${value.substr(0, index)}${value.substr(end + 1)}`;
          }
        }
      }
      return value;
    };
  }
  // remove the PairOf wrappers
  static _removePairOf() {
    return value => {
      for (let index = 0; index < value.length; index++) {
        if (value.substr(index, 7) === 'PairOf<') {
          const start = index + 7;
          const end = Type._findClosing(value, start);
          const type = value.substr(start, end - start);
          value = `${value.substr(0, index)}(${type},${type})${value.substr(end + 1)}`;
        }
      }
      return value;
    };
  }
  // remove the type traits
  static _removeTraits() {
    return value => {
      return (
        value
          // remove all whitespaces
          .replace(/\s/g, '')
          // anything `T::<type>` to end up as `<type>`
          .replace(/T::/g, '')
          // anything `Self::<type>` to end up as `<type>`
          .replace(/Self::/g, '')
          // `system::` with `` - basically we find `<T as system::Trait>`
          .replace(/system::/g, '')
          // replace `<T as Trait>::` (whitespaces were removed above)
          .replace(/<TasTrait>::/g, '')
          // replace `<Self as Trait>::` (whitespaces were removed above)
          .replace(/<SelfasTrait>::/g, '')
          // replace <Lookup as StaticLookup>
          .replace(/<LookupasStaticLookup>/g, 'Lookup')
          // replace `<...>::Type`
          .replace(/::Type/g, '')
      );
    };
  }
  // remove wrapping values, i.e. Box<Proposal> -> Proposal
  static _removeWrap(_check) {
    const check = `${_check}<`;
    return value => {
      let index = 0;
      while (index !== -1) {
        index = value.indexOf(check);
        if (index !== -1) {
          const start = index + check.length;
          const end = Type._findClosing(value, start);
          value = `${value.substr(0, index)}${value.substr(start, end - start)}${value.substr(end + 1)}`;
        }
      }
      return value;
    };
  }
}
