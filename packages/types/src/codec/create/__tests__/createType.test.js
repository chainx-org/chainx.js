import '../../../injector';

import { createType } from '..';
import staticdata from '../static';

describe('createType', () => {
  // @ts-ignore
  console.log(createType('Metadata', [staticdata]));
});
