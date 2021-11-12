import { merge } from 'webpack-merge'
import { resolve } from 'path'
import devConfig from './webpack.dev'

const preConfig = merge(devConfig, {
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: resolve(__dirname, '../node_modules/@greatrpa/plugins/dist/windowInject'),
            options: {
              env: 'pre',
              rule: ['app'],
            },
          },
        ],
      },
    ],
  },
})

export default preConfig
