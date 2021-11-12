import type webpack from 'webpack'
import { join, resolve } from 'path'
import { STYLE_EXTENSISONS, SCRIPT_EXTENSISONS, CWD, EXAMPLE_TEMPLATE_PATH } from './constant'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { MergeManifest } from '@greatrpa/plugins/dist/manifest'

export type WebpackConfig = webpack.Configuration

export type Env = 'dev' | 'test' | 'pre' | 'prod'

const setPlugins = (): webpack.WebpackPluginInstance[] => {
  return [
    new HtmlWebpackPlugin({
      template: join(EXAMPLE_TEMPLATE_PATH, '.public', 'design.html'),
      filename: 'design.html',
      hash: false,
      env: 'dev',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new MergeManifest({
      copy: '../../../editor/dist',
      merge() {
        return true
      },
    }),
  ]
}

export const baseConfig: WebpackConfig = {
  mode: 'development',
  entry: {
    example: join(EXAMPLE_TEMPLATE_PATH, 'app', 'index.tsx'),
  },
  resolve: {
    extensions: [...SCRIPT_EXTENSISONS, ...STYLE_EXTENSISONS],
    fallback: { crypto: false },
  },
  output: {
    path: join(CWD, 'dist'),
    publicPath: './',
    filename: '[name].js',
  },
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
              env: 'test',
              rule: ['app'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        sideEffects: true,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        sideEffects: true,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: setPlugins(),
}
