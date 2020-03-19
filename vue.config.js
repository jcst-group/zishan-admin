// 作为配置文件，直接导出配置对象即可
module.exports = {
  // publicPath:'/back',
  productionSourceMap:false,
  configureWebpack: config => {
    config.entry.app = ["babel-polyfill", "./src/main.js"];
  },
  devServer: {
    // 设置主机地址
    // 设置默认端口
    port: 8091,
    // 设置代理
    proxy: {
      '/api2': {
        // 目标 API 地址
        target: 'http://192.168.101.185:8084',
        //target: 'http://192.168.1.107:8081',
        // 如果要代理websockets
        ws: false,
        // 将主机标头的原点更改为目标URL
        changeOrigin: false,
        pathRewrite: {
          '/api2': ''  //默认所有请求都加了api前缀，需要去掉
        }
      },
      '/ip': {
        // 目标 API 地址
        target: 'https://restapi.amap.com',
        // 如果要代理 websockets
        ws: false,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          '/ip': '/v3/ip'  //默认所有请求都加了api前缀，需要去掉
        }
      },
    }
  }
}
