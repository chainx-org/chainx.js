'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _error = _interopRequireDefault(require('../is/error'));

var _ = require('.');

// Copyright 2017-2019 @polkadot/util authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('ExtError', () => {
  describe('constructor', () => {
    it('constructs an Error that is still an Error', () => {
      expect((0, _error.default)(new _.ExtError())).toEqual(true);
    });
  });
  describe('static', () => {
    it('exposes the .CODES as a static', () => {
      expect(Object.keys(_.ExtError.CODES)).not.toEqual(0);
    });
  });
  describe('constructor properties', () => {
    it('sets the .message property', () => {
      expect(new _.ExtError('test message').message).toEqual('test message');
    });
    it("sets the .message to '' when not set", () => {
      expect(new _.ExtError().message).toEqual('');
    });
    it('sets the .code property', () => {
      expect(new _.ExtError('test message', 1234).code).toEqual(1234);
    });
    it('sets the .code to UKNOWN when not set', () => {
      expect(new _.ExtError('test message').code).toEqual(_.ExtError.CODES.UNKNOWN);
    });
    it('sets the .data property', () => {
      const data = {
        some: {
          value: 'here',
        },
      };
      expect(new _.ExtError('test message', 1234, data).data).toEqual(data);
    });
  });
  describe('stack traces', () => {
    let captureStackTrace;
    beforeEach(() => {
      captureStackTrace = Error.captureStackTrace;

      Error.captureStackTrace = function(error) {
        Object.defineProperty(error, 'stack', {
          configurable: true,
          get: function getStack() {
            const value = 'some stack returned';
            Object.defineProperty(this, 'stack', {
              value,
            });
            return value;
          },
        });
      };
    });
    afterEach(() => {
      Error.captureStackTrace = captureStackTrace;
    });
    it('captures via captureStackTrace when available', () => {
      expect(new _.ExtError().stack).toEqual('some stack returned');
    });
    it('captures via stack when captureStackTrace not available', () => {
      Error.captureStackTrace = null; // grrr

      expect(new _.ExtError().stack.length).not.toEqual(0);
    });
  });
});
