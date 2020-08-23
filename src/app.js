/**
 * 通用启动入口
 * */ 

import Vue from 'vue';
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'

import VueMeta from 'vue-meta'

Vue.use(VueMeta)

Vue.mixin({
    metaInfo: {
        titleTemplate: '%s - ssr 测试'
    }
})
// 导出一个工厂函数
// 用于每次创建一个新的 vue实例
export function createApp() {
    const router = createRouter()
    const store = createStore()
    const app = new Vue({
        router,
        store, // 把容器挂载到 vue 根实例中
        render: h => h(App)
    });
    return {
        app,
        router,
        store
    }
}