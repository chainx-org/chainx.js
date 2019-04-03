import Null from './Null';
import U32 from './U32';
import EnumType from './codec/EnumType';
import Tuple from './codec/Tuple';

class NotApplying extends Null {}
class Applying extends Null {}
class Signing extends Null {}
class Broadcasting extends Null {}
class Processing extends Null {}
class Confirming extends Tuple.with([U32, U32]) {}
class Confirmed extends Null {}
class Unknown extends Null {}

export default class TxState extends EnumType {
  constructor(value, index) {
    super(
      {
        NotApplying,
        Applying,
        Signing,
        Broadcasting,
        Processing,
        Confirming,
        Confirmed,
        Unknown,
      },
      value,
      index
    );
  }
}
