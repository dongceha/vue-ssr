const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')

const resolve = file => path.resolve(__dirname, file);

module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)
    // 监视构建 -> 更新render
    let template
    let serverBundle
    let clientManifest

    const update = () => {
        if (template && serverBundle && clientManifest) {
            ready()
            callback(serverBundle, template, clientManifest)
            
        }
    }
    // 监视构建 template -> 调用 update -> 更新 Renderer 渲染器
    const templatePath = path.resolve(__dirname, '../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8');
    update()
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8');
        update()
    })
    // console.log(template)
    // 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    const serverDevMiddleware =  devMiddleware(serverCompiler, {
        logLevel: 'silent', // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 统一管理日志输出
    })
    // 添加一个钩子，构建结束的时候
    serverCompiler.hooks.done.tap('server', () => {
        serverBundle = JSON.parse(
            // 操作内部 内存中的文件
            serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
        )
        // console.log(serverBundle)
        update()
    })
    // serverCompiler.watch({}, (err, status) => {// 监视资源的变动
    //     if (err) throw err
    //     // 源代码中的错误
    //     if (status.hasErrors()) return;
    //     serverBundle = JSON.parse(
    //         fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    //     )
    //     console.log(serverBundle)
    //     update()
    // })
    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器
    const clientConfig = require('./webpack.client.config')
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware =  devMiddleware(clientCompiler, {
        publicPath: clientConfig.output.path,
        logLevel: 'silent', // 关闭日志输出，由 FriendlyErrorsWebpackPlugin 统一管理日志输出
    })
    // 添加一个钩子，构建结束的时候
    clientCompiler.hooks.done.tap('client', () => {
        clientManifest = JSON.parse(
            // 操作内部 内存中的文件
            clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
        )
        // console.log(clientManifest)
        update()
    })
    // server.use(hotMiddleware(clientCompiler, {
    //     log: false // 关闭它本身的日志输出
    // }))
    // 重要！！将 clientDevMiddleware 挂载到 Express 中，
    // 提供对其内部内存中数据的访问
    server.use(clientDevMiddleware)

    return onReady
}