import Tuple from './codec/Tuple';
import H256 from './H256';
import I8 from './I8';

export default class EcdsaSignature extends Tuple.with([H256, H256, I8]) {}
