import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { drr } from './utils/drr';

class Chain {
  constructor(chainx) {
    this.api = chainx.api;
    this.isRpcReady = chainx.isRpcReady;
  }

  getBlockByNumber = (...args) => {
    return this.api.rpc.chainx.getBlockByNumber(...args);
  };

  systemPeers = () => {
    return this.api.rpc.system.peers();
  };

  systemHealth = () => {
    return this.api.rpc.system.health();
  };

  async getInfo() {
    await this.isRpcReady();

    const [chain, version, name] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.version(),
      this.api.rpc.system.name(),
    ]);

    return {
      name: chain.toString(),
      version: version.toString(),
      era: name.toString(),
    };
  }

  async getBlockNumber() {
    await this.isRpcReady();

    return this.api.rpc.chain.getHeader().then(header => {
      return header.get('number').toString();
    });
  }

  getMinimumPeriod() {
    return this.api.query.timestamp.minimumPeriod().then(result => result.toJSON() * 2);
  }

  getFeeByCallAndLength(method, length) {
    return this.api.rpc.chainx.getFeeByCallAndLength(method, length);
  }

  chainProperties() {
    return this.api.rpc.system.properties();
  }

  subscribeNewHead() {
    return this.api.rpc$.chain.subscribeNewHead().pipe(
      filter(header => header && !!header.blockNumber),
      switchMap(header => {
        return combineLatest(of(header), this.api.rpc$.chain.getBlockHash(header.blockNumber));
      }),
      switchMap(([header, blockHash]) => {
        return combineLatest(
          of(header),
          of(blockHash.toString()),
          this.api.subscribeStorage$.timestamp.now.at(blockHash).pipe(map(data => data.toNumber()))
        );
      }),
      map(([header, hash, now]) => {
        return {
          number: header.blockNumber.toNumber(),
          hash,
          now,
        };
      }),
      drr()
    );
  }
}

export default Chain;
