export default class Trade {
  constructor(chainx) {
    this.api = chainx.api;
  }

  getTradingPairs = (...args) => {
    return this.api.rpc.chainx.getTradingPairs(...args);
  };

  getQuotations = (...args) => {
    return this.api.rpc.chainx.getQuotations(...args);
  };

  getOrders = (...args) => {
    return this.api.rpc.chainx.getOrders(...args);
  };

  /**
   * 挂单
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xdex/spot/src/lib.rs#L104
   */
  putOrder = (pairid, ordertype, direction, amount, price) => {
    return this.api.tx.xspot.putOrder(pairid, ordertype, direction, amount, price);
  };

  /**
   * 撤单
   * https://github.com/chainpool/ChainX/blob/develop/xrml/xdex/spot/src/lib.rs#L116
   */
  cancelOrder = (pairid, index) => {
    return this.api.tx.xspot.cancelOrder(pairid, index);
  };
}
