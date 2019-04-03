module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
};
