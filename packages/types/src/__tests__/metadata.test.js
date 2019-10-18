import Metadata from '../Metadata/MetadataVersioned';
import {} from '../Metadata/Storage';
import { StorageFunctionMetadata } from '../Metadata/v5/Storage';
import staticV4 from './staticV4';
import staticV5 from './staticV5';

Storage;
describe('chainx.js', () => {
  // console.log(staticV4, staticV5)
  // new Metadata(staticV4)
  // new Metadata(staticV4);
  console.log(
    new StorageFunctionMetadata(
      Buffer.from(
        '304163636f756e744e6f6e636501010130543a3a4163636f756e74496420543a3a496e64657800200000000000000000047c2045787472696e73696373206e6f6e636520666f72206163636f756e74732e',
        'hex'
      )
    )
  );
  // new MetadataV5(Uint8Array.from(Buffer.from(staticV5.substr(12), 'hex')))
});

describe('chainx.js', () => {
  // console.log(staticV4, staticV5)
  // new Metadata(staticV4)
  // new Metadata(staticV5);
  // new MetadataV5(Uint8Array.from(Buffer.from(staticV5.substr(12), 'hex')))
});
