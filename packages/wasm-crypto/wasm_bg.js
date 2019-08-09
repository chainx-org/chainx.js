const pkg = require('./package.json');
const bytes = require('./wasm_wasm');
const js = require('./wasm');

module.exports = async function createExportPromise() {
  const imports = {
    './wasm': js,
  };

  if (!WebAssembly) {
    console.error(`ERROR: Unable to initialize ${pkg.name}, WebAssembly is not available in this environment`);

    // TODO: Return asm version when not detected
    return null;
  }

  try {
    const { instance } = await WebAssembly.instantiate(bytes, imports);

    return instance.exports;
  } catch (error) {
    console.error(`ERROR: Unable to initialize ${pkg.name}:: ${error.message}`);

    // TODO: Return asm version here as a fallback
    return null;
  }
};
