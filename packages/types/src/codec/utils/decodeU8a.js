export default function decodeU8a(u8a, _types) {
  const types = Array.isArray(_types) ? _types : Object.values(_types);
  if (!types.length) {
    return [];
  }
  const Type = types[0];
  try {
    const value = new Type(u8a);
    return [value].concat(decodeU8a(u8a.subarray(value.encodedLength), types.slice(1)));
  } catch (error) {
    throw new Error(`U8a: failed on '${Type.name}':: ${error.message}`);
  }
}
