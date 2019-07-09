export default class Trustee {
  constructor(chainx) {
    this.api = chainx.api;
  }

  getTrusteeSessionInfo = (...args) => {
    return this.api.rpc.chainx.getTrusteeSessionInfo(...args);
  };

  getDepositLimitByToken = (...args) => {
    return this.api.rpc.chainx.getDepositLimitByToken(...args);
  };

  getTrusteeInfoByAccount = (...args) => {
    return this.api.rpc.chainx.getTrusteeInfoByAccount(...args);
  };

  getWithdrawTx = (...args) => {
    return this.api.rpc.chainx.getWithdrawTx(...args);
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
