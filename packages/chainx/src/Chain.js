import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { drr } from './utils/drr';
import { u8aToHex, hexToU8a, u8aConcat } from '@chainx/util';
import { u64 } from '@chainx/types';

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

  async getHeader() {
    await this.isRpcReady();

    const result = await this.api.rpc.chain.getHeader();
    return result._raw;
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

  particularAccounts() {
    return this.api.rpc.chainx.particularAccounts();
  }

  convertToAsset(token, balance, value, gas) {
    return this.api.rpc.chainx.contractXRCTokenInfo().then(data => {
      const contractAddress = data.BTC.XRC20.address;
      const selector = data.BTC.XRC20.selectors.Destroy;

      return this.api.tx.xContracts.call(
        contractAddress,
        value,
        gas,
        u8aToHex(u8aConcat(hexToU8a(selector), new u64(balance).toU8a()))
      );
    });
  }

  subscribeNewHead() {
    return this.api.rpc$.chain.subscribeNewHead().pipe(
      filter(header => header && !!header.blockNumber),
      switchMap(header => {
        return combineLatest(of(header), this.api.rpc$.chain.getBlockHash(header.blockNumber));
      }),
      switchMap(([header, blockHash]) => {
        return combineLatest(of(header), of(blockHash.toString()), this.api.rpc$.chain.getBlock(blockHash));
      }),
      map(([header, hash, block]) => {
        const estrinsics = block.block.extrinsics;
        return {
          number: header.blockNumber.toNumber(),
          hash,
          now: estrinsics[0] && estrinsics[0].method.toJSON().args.now,
          producer: estrinsics[1] && estrinsics[1].method.toJSON().args.producer,
        };
      }),
      drr()
    );
  }
}

export default Chain;
