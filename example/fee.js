const Chainx = require('chainx.js').default;

(async () => {
  // 目前只支持 websocket 链接
  const chainx = new Chainx('ws://47.101.192.115:8681');

  // 等待异步的初始化
  await chainx.isRpcReady();

  const e = chainx.asset.transfer('5Pjajd12o9hVixBPRPHZEdjsrct3NZp9Ge7QP4PiSivQrBZa', 'PCX', '1000', '转账 PCX');

  console.log(e.getFeeSync({ nonce: 65 }));
  console.log(await e.getFee('5SBvx5YnPKxCikZiLZmhY2sARoMw2nF9d2vxboU26NzM1ZWd'));
})();
