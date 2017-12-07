module.exports = {
    context: __dirname + "/src",
    entry: {
        index: "./index.js",
        html: "./index.html",
        css: "./styles/styles.css",
        image: "./assets/monks.jpg",
    },
    target: 'web',    
    output: {
        filename: '[name].js',
        path: __dirname + "/dist",
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader"],
          },
          {
            test: /\.(html|css|jpg)$/,
            loader: "file-loader",
            options: {
                name: '[name].[ext]'
            }
          },
        ],
    }
}