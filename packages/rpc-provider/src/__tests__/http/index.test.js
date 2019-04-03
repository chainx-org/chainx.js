import { TEST_HTTP_URL } from '../../__mocks__/mockHttp';

import Http from '../../http';

describe('Http', () => {
  let http;

  beforeEach(() => {
    http = new Http(TEST_HTTP_URL);
  });

  it('requires an http:// prefixed endpoint', () => {
    expect(() => new Http('ws://')).toThrow(/with 'http/);
  });

  it('allows https:// endpoints', () => {
    expect(() => new Http('https://')).not.toThrow();
  });

  it('always returns isConnected true', () => {
    expect(http.isConnected()).toEqual(true);
  });

  it('does not (yet) support subscribe', () => {
    return http.subscribe().catch(error => {
      expect(error.message).toMatch(/does not have subscriptions/);
    });
  });

  it('does not (yet) support unsubscribe', () => {
    return http.unsubscribe().catch(error => {
      expect(error.message).toMatch(/does not have subscriptions/);
    });
  });
});
