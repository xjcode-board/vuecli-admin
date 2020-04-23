module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://api.com', //开发环境
                changeOrigin: true
            }
        }
    }
};
