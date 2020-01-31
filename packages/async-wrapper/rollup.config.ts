import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

const pkg = require('./package.json')

const libraryName = 'async-wrapper'

export default {
  input: `src/${libraryName}.ts`,
  output: [
    //{ file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'cjs', sourcemap: true }
  ],
  external: ['mongoose', 'express', 'pluralize', 'sequelize', 'dot-prop'],
  watch: {
    include: 'src/**'
  },
  plugins: [json(), typescript({ useTsconfigDeclarationDir: true }), sourceMaps()]
}
