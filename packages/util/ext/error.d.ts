import { ExtErrorInterface } from '../types';
/**
 * @name ExtError
 * @summary Extension to the basic JS Error.
 * @description
 * The built-in JavaScript Error class is extended by adding a code to allow for Error categorization. In addition to the normal `stack`, `message`, the numeric `code` and `data` (any types) parameters are available on the object.
 * @example
 * <BR>
 *
 * ```javascript
 * const { ExtError } from '@chainx/util');
 *
 * throw new ExtError('some message', ExtError.CODES.METHOD_NOT_FOUND); // => error.code = -32601
 * ```
 */
export default class ExtError extends Error implements ExtErrorInterface {
    code: number;
    data: any;
    message: string;
    name: string;
    stack: string;
    constructor(message?: string, code?: number, data?: any);
    static CODES: {
        ASSERT: number;
        UNKNOWN: number;
        INVALID_JSONRPC: number;
        METHOD_NOT_FOUND: number;
    };
}
