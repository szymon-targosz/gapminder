const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
   const isProd = env === 'production';
   return {
      entry: ['@babel/polyfill', './src/js/index.js'],
      output: {
         path: path.resolve(__dirname, 'public/dist'),
         filename: 'bundle.js'
      },
      mode: isProd ? 'production' : 'development',
      module: {
         rules: [
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                  loader: 'babel-loader'
               }
            }, {
               test: /\.css$/,
               exclude: /node_modules/,
               use: [
                  {
                     loader: MiniCssExtractPlugin.loader
                  },
                  {
                     loader: 'css-loader',
                     options: {
                        importLoaders: 1,
                        sourceMap: true,
                     }
                  },
                  {
                     loader: 'postcss-loader',
                     options: {
                        ident: 'postcss',
                        plugins: () => [
                           autoprefixer({ browsers: ["> 1%", "last 2 versions, not ie < 9"] })
                        ]
                     }
                  }
               ]
            }
         ]
      },
      plugins: [
         new MiniCssExtractPlugin({ filename: 'style.css' })
      ],
      devServer: {
         contentBase: path.resolve(__dirname, 'public'),
         publicPath: '/dist/',
         watchContentBase: true
      },
      devtool: isProd ? 'source-map' : 'inline-source-map'
   }
}