import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import pkg from '../package.json';

const extentions = [
  '.js', '.jsx', '.ts', '.tsx'
];

const nodeExternals = [
  'atom',
  'os',
  'fs'
]

const externals = Object.keys(pkg.dependencies).concat(...nodeExternals);

const plugIns = [
  commonjs({ // so Rollup can convert `ms` to an ES module
    include: [ 'node_modules/**' ]
  }),
  resolve({ extentions }), // so Rollup can find `ms`
  json(),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  }),
  globals(),
  builtins()
];

export default {
  input: 'src/container.js',
  output: [
    { file: pkg.main, format: 'cjs' }
  ],
  plugins: plugIns,
  external: externals
};

