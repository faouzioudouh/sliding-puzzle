module.exports = {
    context: __dirname + "/src",
    entry: {
        index: "./index.js",
        html: "./index.html",      
    },
    target: 'web',    
    output: {
        filename: '[name].js',
        path: __dirname + "/dist",
    },
    module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["babel-loader"],
          },
          {
            test: /\.html$/,
            loader: "file-loader?name=[name].[ext]",
          },
        ],
    },
}