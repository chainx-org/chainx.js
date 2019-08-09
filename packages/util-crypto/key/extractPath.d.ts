import DeriveJunction from './DeriveJunction';
declare type ExtractResult = {
    parts: null | Array<string>;
    path: Array<DeriveJunction>;
};
/**
 * @description Extract derivation juntions from the supplied path
 */
export default function keyExtractPath(derivePath: string): ExtractResult;
export {};
