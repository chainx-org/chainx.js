describe('http/polyfill', () => {
  let origFetch;

  beforeEach(() => {
    origFetch = global.fetch;
    global.fetch = null;
  });

  afterEach(() => {
    global.fetch = origFetch;
  });

  it('polyfills with no exceptions (without fetch)', () => {
    expect(require('../../http/polyfill')).toBeDefined();
  });

  it('polyfills with no exceptions (with fetch)', () => {
    global.fetch = () => true;

    expect(require('../../http/polyfill')).toBeDefined();
  });
});
