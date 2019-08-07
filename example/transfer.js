const Chainx = require('chainx.js').default;

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new Chainx('wss://w1.chainx.org.cn/ws');

  // 等待异步的初始化
  await chainx.isRpcReady();

  // 查询某个账户的资产情况
  const bobAssets = await chainx.asset.getAssetsByAccount('5Pjajd12o9hVixBPRPHZEdjsrct3NZp9Ge7QP4PiSivQrBZa', 0, 10);

  console.log('bobAssets: ', JSON.stringify(bobAssets));

  // 构造交易参数（同步）

  const extrinsic = chainx.asset.transfer(
    '5Pjajd12o9hVixBPRPHZEdjsrct3NZp9Ge7QP4PiSivQrBZa',
    'PCX',
    '1000',
    '转账 PCX'
  );

  // 查看 method 哈希
  console.log(extrinsic.method.meta);
  console.log('Function: ', extrinsic.method.toJSON());

  // 签名并发送交易，0x0000000000000000000000000000000000000000000000000000000000000000 是用于签名的私钥
  // extrinsic.signAndSend('0x0000000000000000000000000000000000000000000000000000000000000000', (error, response) => {
  //   if (error) {
  //     console.log(error);
  //   } else if (response.status === 'Finalized') {
  //     if (response.result === 'ExtrinsicSuccess') {
  //       console.log('交易成功');
  //     }
  //   }
  // });
})();
