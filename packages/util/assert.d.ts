declare type MessageFn = () => string;
declare type Falsy = null | undefined | false | 0 | '';
/**
 * @name assert
 * @summary Checks for a valid test, if not ExtError is thrown.
 * @description
 * Checks that `test` is a truthy value. If value is falsy (`null`, `undefined`, `false`, ...), it throws an ExtError with the supplied `message` and an optional `code` and `data`. When `test` passes, `true` is returned.
 * @example
 * <BR>
 *
 * ```javascript
 * const { assert } from '@chainx/util';
 *
 * assert(true, 'True should be true'); // true returned
 * assert(false, 'False should not be true'); // ExtError thrown
 * assert(false, () => 'message'); // ExtError with 'message'
 * ```
 */
export default function assert<T>(test: Falsy | T, message: string | MessageFn, code?: number, data?: any): test is T;
export {};
