/**
 * 客户端入口
 * */ 
import { createApp } from './app'

const { app } = createApp()
// 根组件的 App 必须有一个 #app
app.$mount('#app')
