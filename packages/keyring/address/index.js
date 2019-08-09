'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'decodeAddress', {
  enumerable: true,
  get: function get() {
    return _decode.default;
  },
});
Object.defineProperty(exports, 'encodeAddress', {
  enumerable: true,
  get: function get() {
    return _encode.default;
  },
});
Object.defineProperty(exports, 'setAddressPrefix', {
  enumerable: true,
  get: function get() {
    return _setPrefix.default;
  },
});

var _decode = _interopRequireDefault(require('./decode'));

var _encode = _interopRequireDefault(require('./encode'));

var _setPrefix = _interopRequireDefault(require('./setPrefix'));
