const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // output to /dist
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // handles CSS imports
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  mode: 'development', // or 'production' for production build
};
