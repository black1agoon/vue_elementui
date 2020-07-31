module.exports = {
  devServer: {
    port: 8006,
    proxy: 'http://192.168.2.140:9855/'
    // proxy: {
    //   '^/(?!(web|app|login))': {
    //     target: 'http://data.nfc96315.cn',
    //   },
    // },
  },
  assetsDir: 'static',
  productionSourceMap: false,
  chainWebpack(config) {
    config.plugin('define').tap(args => {
      return [
        {
          TITLE: JSON.stringify(process.env.TITLE),
          PREV: JSON.stringify(process.env.PREV),
          SERVER_URI: JSON.stringify(process.env.SERVER_URI)
        }
      ];
    });
  }
}