const path = require('path')
module.exports = {
   devtool:'source-map',
    mode : 'production',
   entry: './client/index.js', // Our frontend will be inside the src folder
   output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].build.js' // The final file will be created in dist/build.js
   },
 
 
   devServer : {
    contentBase: path.join(__dirname,'public'),
    compress: true,
    port:8086
   }
}