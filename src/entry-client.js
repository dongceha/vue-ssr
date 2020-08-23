/**
 * 客户端入口
 * */ 
import { createApp } from './app'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

// 根组件的 App 必须有一个 #app
router.onReady(() => {
    app.$mount('#app')
})
