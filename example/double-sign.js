const { ApiBase, WsProvider } = require('chainx.js');

(async () => {
  const provider = new WsProvider('ws://39.100.113.164:8087');
  const chainx = new ApiBase(provider);

  await chainx.isReady;

  const extrinsic = chainx.tx.xFisher.reportDoubleSigner(
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    null,
    [null, null, null],
    [null, null, null]
  );

  await new Promise((resolve, reject) => {
    extrinsic.signAndSend('0x0000000000000000000000000000000000000000000000000000000000000000', (error, response) => {
      if (error) {
        reject(error);
      } else if (response.status === 'Finalized') {
        if (response.result === 'ExtrinsicSuccess') {
          resolve(response);
        }
      }
    });
  });
})();
