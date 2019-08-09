import { KeypairType, Keypair } from '../types';
import DeriveJunction from './DeriveJunction';
export default function keyFromPath(pair: Keypair, path: Array<DeriveJunction>, type: KeypairType): Keypair;
