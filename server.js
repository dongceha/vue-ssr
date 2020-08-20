const Vue = require('vue')
const fs = require('fs')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const template = fs.readFileSync('./index.template.html', 'utf-8') // 默认是二进制，传入编码之后变成字符
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
    template,
    clientManifest
})
const express = require('express')

const server = express()

server.get('/', (req, res) => {
    const app = new Vue({
        template: `
          <div id="app">
            <h1>{{message}}</h1>
            <input v-model="message"/>
            <button @click="onClick">点击</button>
          </div>
        `,
        data: {
            message: '拉钩教育'
        },
        methods: {
            onClick() {
                console.log('hello world')
            }
        }
    });
    renderer.renderToString(app, {
        title: 'vue ssr',
        meta: `
         <meta name="description" content="试一试">
        `
    }, (err, html) => {
        if (err) {
            res.status(500).end('Internal server Error')
            return;
        }
        res.setHeader('content-type', 'text/html; charset=utf8')
        res.end(html)
    })
})

server.listen(3000, () => {
    console.log('server running at port 3000')
})