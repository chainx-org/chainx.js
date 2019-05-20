export default class Trustee {
  constructor(chainx) {
    this.api = chainx.api;
  }

  getTrusteeSessionInfo = Chain => {
    return this.api.rpc.chainx.getTrusteeSessionInfo(Chain);
  };

  getTrusteeInfoByAccount = (...args) => {
    return this.api.rpc.chainx.getTrusteeInfoByAccount(...args);
  };

  getWithdrawTx = Chain => {
    return this.api.rpc.chainx.getWithdrawTx(Chain);
  };

  createWithdrawTx = (withdrawalIdList, tx) => {
    return this.api.tx.xbitcoin.createWithdrawTx(withdrawalIdList, tx);
  };

  signWithdrawTx = tx => {
    return this.api.tx.xbitcoin.signWithdrawTx(tx);
  };

  /**
   * 设置信托
   */
  setupBitcoinTrustee = (about, hotEntity, coldEntity) => {
    return this.api.tx.xbridgeFeatures.setupBitcoinTrustee(about, hotEntity, coldEntity);
  };
}
