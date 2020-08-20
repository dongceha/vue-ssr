/**
 * 通用启动入口
 * */ 

import Vue from 'vue';
import App from './App.vue'

export function createApp() {
    const app = new Vue({
        render: h => h(App)
    });
    return {
        app
    }
}