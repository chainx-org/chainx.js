const { ApiBase } = require('chainx.js');
const provider = require('./provider');

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new ApiBase(provider);

  // 等待异步的初始化
  await chainx.isReady;

  //
  const extrinsic = chainx.tx.xAssets.transfer(
    '5To6YjSZaFujsP7XgEyCHMCdbKtqg84c72hPr2xns48JLXps',
    'PCX',
    '1000',
    '转账 PCX'
  );

  console.log(
    await provider.sign('5UgNKWFRfqQdqpPt6wuLVpDyJr2ZdVuqJhYiDUDsg5xyNJ57', {
      acceleration: 1,
      method: extrinsic.method.toHex(),
    })
  );
})();
