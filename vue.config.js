// vue.config.js 配置说明
// 这里只列一部分，具体配置惨考文档啊
var webpack = require('webpack')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/video' : '/',
    configureWebpack: {
        externals: {
            // "BMap": "BMap",
        }
    },
    outputDir: 'dist',

    lintOnSave: true,
    // productionSourceMap：{ type:Bollean,default:true } 生产源映射
    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,
    // devServer:{type:Object} 3个属性host,port,https
    // 它支持webPack-dev-server的所有选项
    devServer: {
        port: 8080, // 端口号
        // host: 'localhost',
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        proxy: {
            
            '/v1': {
               
                target: 'http://changyou.speeed.cn:8003/',
                // ws:'8095',
                changeOrigin: true,// 是否跨域
                pathRewrite: {
                       '^/v1': '/v1/'  // 替换target中的请求地址，也就是说，在请求的时候，url用'http://changyou.speeed.cn:8003/'
                }
            },
            '/src': {
                target: 'http://changyou.speeed.cn:8003/',
                // ws:'8095',
                changeOrigin: true,// 是否跨域
                pathRewrite: {
                       '^/src': ''  // 替换target中的请求地址，也就是说，在请求的时候，url用'/proxy'代替'http://changyou.speeed.cn:8003/'
                }
            },
        },  // 配置多个代理

    },
    // 第三方插件配置
    pluginOptions: {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    },
    configureWebpack:(config)=>{
        config.module.rules.push({
            test: /\.(swf|ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/,
            loader: 'file-loader',
        })
    },

}
