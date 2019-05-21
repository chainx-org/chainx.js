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
    return this.api.tx.xBridgeOfBtc.createWithdrawTx(withdrawalIdList, tx);
  };

  signWithdrawTx = tx => {
    return this.api.tx.xBridgeOfBtc.signWithdrawTx(tx);
  };

  /**
   * 设置信托
   */
  setupBitcoinTrustee = (about, hotEntity, coldEntity) => {
    return this.api.tx.xBridgeFeatures.setupBitcoinTrustee(about, hotEntity, coldEntity);
  };
}
