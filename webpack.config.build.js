const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (_, options) => {

  return {
    mode: options.mode,
    entry: path.resolve(__dirname, './src/index.tsx'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: `example_course.${options.mode}.js`,
    },
  
    //enable dev source map
    devtool: 'source-map',
  
    resolve: {
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      alias: {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
        '@': path.resolve(__dirname, 'src'),
      },
    },
  
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            { loader: 'ts-loader'},
            { 
              loader: 'babel-loader',
              options: {
                babelrc: false,
                "plugins": [
                  ["@babel/plugin-syntax-typescript",
                {
                  isTSX: true
                }],
                  "@babel/plugin-syntax-jsx",
                  [
                    "babel-plugin-react-css-modules",
                    {
                      "handleMissingStyleName": "throw",
                      "generateScopedName": "[local]-[hash:base64:10]",
                      "filetypes": {
                        ".less": {
                          "syntax": "postcss-less"
                        }
                      }
                    }
                  ]
                ]
              }
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              sourceMap: true,
              modules: true,
              localIdentName: "[local]-[hash:base64:10]",
            }
          }, {
            loader: 'less-loader', options: {
              strictMath: true,
              noIeCompat: true
            }
          }]
        }
      ]
    },
  
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './index.html'), 
      }),
      new MiniCssExtractPlugin({
        filename: `example_course.${options.mode}.css`
      }),
      new DefinePlugin({
        WEBPACK_CONFIG_MODE: '"build"'
      })
    ],
  
    externals: {
      mobx: 'mobx',
      react: 'React',
      'react-dom': 'ReactDOM',
      'mobx-react': 'mobxReact',
      'mobx-react-lite': 'mobxReactLite',
      '@imoka/imoka-react': 'imokaReact',
      '@imoka/imoka-mobweb-reactor': 'imokaMobwebReactor',
      '@imoka/imoka-mobweb-reactor-support': 'imokaMobwebReactorSupport',
    }
  }
}