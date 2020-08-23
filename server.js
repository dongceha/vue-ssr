const fs = require('fs')
const express = require('express')

const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')


const server = express()
// 把静态资源释放出来，处理的是 物理磁盘中的文件，
// 需要修改成内存中的文件 ==> server.use(clientDevMiddleware)
server.use('/dist', express.static('./dist'))


const isProd = process.env.NODE_ENV === 'production'

let renderer
let onReady

if (isProd) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')

    const template = fs.readFileSync('./index.template.html', 'utf-8') // 默认是二进制，传入编码之后变成字符
    renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    })
} else {
    // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器
    onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
        renderer = createBundleRenderer(serverBundle, {
            template,
            clientManifest
        })
    })
}


const render = async (req, res) => {
    try {
        const html = await renderer.renderToString({
            title: 'vue ssr',
            meta: `
             <meta name="description" content="试一试">
            `,
            url: req.url
        })
        res.setHeader('content-type', 'text/html; charset=utf8')
        res.end(html)
    } catch (error) {
        return res.status(500).end('Internal Server Error')
    }
}

// 服务端路由设置为 * ，意味着所有的路由都会进入这里
server.get('*', isProd 
  ? render
  : async (req, res) => {
    // 等待有了 Renderer 渲染器以后，调用 render 进行渲染
    await onReady
    render(req, res)
  }
)

server.listen(3000, () => {
    console.log('server running at port 3000')
})