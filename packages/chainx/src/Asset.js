export default class Asset {
  constructor(chainx) {
    this.api = chainx.api;
  }

  getAssetsByAccount = (...args) => {
    return this.api.rpc.chainx.getAssetsByAccount(...args);
  };

  getAssets = (...args) => {
    return this.api.rpc.chainx.getAssets(...args);
  };

  getWithdrawalList = (...args) => {
    return this.api.rpc.chainx.getWithdrawalList(...args);
  };

  getWithdrawalListByAccount = (...args) => {
    return this.api.rpc.chainx.getWithdrawalListByAccount(...args);
  };

  getDepositList = (...args) => {
    return this.api.rpc.chainx.getDepositList(...args);
  };

  verifyAddressValidity = (...args) => {
    return this.api.rpc.chainx.verifyAddressValidity(...args);
  };

  getAddressByAccount = (...args) => {
    return this.api.rpc.chainx.getAddressByAccount(...args);
  };

  getWithdrawalLimitByToken = (...args) => {
    return this.api.rpc.chainx.getWithdrawalLimitByToken(...args);
  };

  getSdotClaims = address => {
    return this.api.query.xBridgeOfSDOT.claims(address).then(result => (result.length ? result.toJSON() : undefined));
  };

  /**
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xassets/assets/src/lib.rs#L146
   */
  transfer = (dest, token, value, memo) => {
    return this.api.tx.xAssets.transfer(dest, token, value, memo);
  };

  /**
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xassets/process/src/lib.rs#L63
   */
  withdraw = (token, value, addr, ext) => {
    return this.api.tx.withdrawal.withdraw(token, value, addr, ext);
  };

  revokeWithdraw = id => {
    return this.api.tx.withdrawal.revokeWithdraw(id);
  };

  claimSdot = (ethereumSignature, signData, inputData) => {
    return this.api.tx.xBridgeOfSdot.claim(ethereumSignature, signData, inputData);
  };
}
