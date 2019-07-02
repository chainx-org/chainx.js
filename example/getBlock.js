const { ApiBase, HttpProvider, WsProvider } = require('chainx.js');
const { Observable, timer } = require('rxjs');
const { timeout, retryWhen, delayWhen, take } = require('rxjs/operators');

(async () => {
  // 使用 http 连接
  const api = new ApiBase(new WsProvider('wss://w1.chainx.org/ws'));
  // 使用 websocket 连接
  // const api = new ApiBase(new WsProvider('wss://w1.chainx.org/ws'))

  await api.isReady;

  async function getTransfers(blockNumber) {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const block = await api.rpc.chain.getBlock(blockHash);
    const estrinsics = block.block.extrinsics;
    const transfers = [];

    for (let i = 0; i < estrinsics.length; i++) {
      const e = estrinsics[i];

      const allEvents = await api.query.system.events.at(blockHash);
      events = allEvents
        .filter(({ phase }) => phase.type === 'ApplyExtrinsic' && phase.value.eqn(i))
        .map(event => {
          const o = event.toJSON();
          o.method = event.event.data.method;
          return o;
        });
      result = events[events.length - 1].method;

      transfers.push({
        index: i,
        blockHash: blockHash.toHex(),
        blockNumber: blockNumber,
        result,
        tx: {
          signature: e.signature.toJSON(),
          method: e.method.toJSON(),
        },
        events: events,
        txHash: e.hash.toHex(),
      });
    }

    return transfers;
  }

  // 错误重试
  const getTransfersWithRetry = async function getTransfersWithRetry(blockNumber) {
    return new Observable(async subscriber => {
      try {
        const result = await getTransfers(blockNumber);
        subscriber.next(result);
        subscriber.complete();
      } catch (error) {
        if (!subscriber.closed) {
          console.log(error);
          subscriber.error(error);
        }
      }
    })
      .pipe(
        timeout(5000),
        retryWhen(errors => {
          console.log('发生了一个错误，等待重试');
          return errors.pipe(delayWhen(val => timer(5000)));
        })
      )
      .toPromise();
  };

  api.rpc$.chain.subscribeNewHead().subscribe(data => {
    const blockNumber = data.blockNumber.toNumber();
    getTransfersWithRetry(blockNumber)
      .then(() => {
        console.log(blockNumber, 'success');
      })
      .catch(error => {
        console.log(error, blockNumber);
      });
  });
})();
