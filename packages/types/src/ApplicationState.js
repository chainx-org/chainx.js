import Enum from './codec/Enum';

export default class ApplicationState extends Enum {
  constructor(index) {
    super(['Applying', 'Processing', 'NormalFinish', 'RootFinish', 'NormalCancel', 'RootCancel'], index);
  }
}
