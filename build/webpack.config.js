const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')
const isDevelopment = process.env.NODE_ENV !== 'production'
module.exports = {
  entry: {
    bundle: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  devtool: isDevelopment && 'source-map',
  devServer: {
    port: 3021,
    open: true,
    contentBase: path.join(__dirname, '../src')
  },
  module: {
    rules: [
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment
              // minimize: !isDevelopment
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions']
              },
              sourceMap: isDevelopment,
              plugins: () => [autoprefixer]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
              useRelativePath: true
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: true
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    /** Since Webpack 4 */
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-styles.css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Test',
      template: './src/index.handlebars',
      minify: !isDevelopment && {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true
        // removeEmptyElements: true
      }
    }),
    new CopyWebpackPlugin([{ from: './src/img/', to: './img' }]),
    new CopyWebpackPlugin([{ from: './src/fonts/', to: './fonts' }]),
    new CopyWebpackPlugin([{ from: './src/css/', to: './css/' }])

  ]
}
