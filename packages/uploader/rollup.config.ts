import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

export default {
  input: 'src/uploader.ts',
  output: {
    file: 'dist/uploader.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [json(), typescript()]
}
