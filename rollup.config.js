import babel from 'rollup-plugin-babel'
import flow from 'rollup-plugin-flow'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: 'lib/index.js',
  output: [
    {
      file: 'dist/react-translated.es.js',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/react-translated.js',
      format: 'cjs',
      exports: 'named',
      name: 'ReactTranslated',
      globals: {
        'prop-types': 'PropTypes',
        react: 'React',
      },
    },
  ],
  plugins: [
    flow(),
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup', 'stage-0', 'react'],
    }),
    nodeResolve(),
  ],
  external: ['prop-types', 'react'],
}
