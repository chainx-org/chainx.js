import Http from '@chainx/rpc-provider/http';
import { Metadata } from '@chainx/types';
import fs from 'fs';

const HTTP_URL = 'http://192.168.0.100:10000';
// const HTTP_URL = 'https://w1.chainx.org/rpc';
const METADATA_STATIC_PATH = './packages/types/src/Metadata/static.js';
const METADATA_JSON_PATH = './json/metadata.json';

const writeToStatic = data => {
  return new Promise(resolve => {
    const staticData = `export default '${data}'`;
    const writeStream = fs.createWriteStream(METADATA_STATIC_PATH, { encoding: 'utf8' });
    writeStream.write(staticData);
    writeStream.on('finish', () => {
      console.info(`${METADATA_STATIC_PATH} 写入完成`);
      resolve(staticData);
    });
    writeStream.end('\n');
  });
};

const writeToJson = data => {
  return new Promise(resolve => {
    const decoded = new Metadata(data);
    const jsonData = JSON.stringify(decoded.toJSON(), null, 2);
    const writeStream = fs.createWriteStream(METADATA_JSON_PATH, { encoding: 'ascii' });
    writeStream.write(jsonData);
    writeStream.on('finish', () => {
      console.info(`${METADATA_JSON_PATH} 写入完成`);
      resolve(jsonData);
    });
    writeStream.end('\n');
  });
};

const main = async () => {
  const http = new Http(HTTP_URL);
  const data = await http.send('state_getMetadata');
  writeToJson(data);
  writeToStatic(data);
};

main();
