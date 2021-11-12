import { merge } from 'webpack-merge'
import { baseConfig } from './webpack.base'
import { join } from 'path'
import { EXAMPLE_TEMPLATE_PATH } from './constant'
import webpack from 'webpack'



const devConfig = merge(baseConfig, {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    content: join(EXAMPLE_TEMPLATE_PATH, 'content'),
    background: join(EXAMPLE_TEMPLATE_PATH, 'background'),
    inject: join(EXAMPLE_TEMPLATE_PATH, 'inject'),
  },
  watch: true,
  plugins: [new webpack.HotModuleReplacementPlugin()],
})

export default devConfig
