'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'blake2AsHex', {
  enumerable: true,
  get: function get() {
    return _asHex.default;
  },
});
Object.defineProperty(exports, 'blake2AsU8a', {
  enumerable: true,
  get: function get() {
    return _asU8a.default;
  },
});

var _asHex = _interopRequireDefault(require('./asHex'));

var _asU8a = _interopRequireDefault(require('./asU8a'));