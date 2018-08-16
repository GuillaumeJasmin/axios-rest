const { BABEL_ENV, NODE_ENV } = process.env

const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test'

module.exports = {
  presets: [['@babel/env', { loose: true, modules: false }], '@babel/flow'],
  plugins: [
    '@babel/plugin-syntax-object-rest-spread',
    cjs && '@babel/plugin-transform-modules-commonjs',
  ].filter(Boolean),
  env: {
    test: {
      presets: ['@babel/env'],
    },
  },
}
