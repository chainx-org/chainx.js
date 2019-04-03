import fs from 'fs';
import interfaces from '@chainx/jsonrpc';

const writeToJson = () => {
  return new Promise(resolve => {
    const PATH = './packages/type-jsonrpc/jsonrpc.json';
    const jsonData = JSON.stringify(interfaces, null, 2);
    const writeStream = fs.createWriteStream('./json/rpc.json', { encoding: 'utf8' });
    writeStream.write(jsonData);
    writeStream.on('finish', () => {
      console.info(`${PATH} 写入完成`);
      resolve(jsonData);
    });
    writeStream.end('\n');
  });
};

writeToJson();
