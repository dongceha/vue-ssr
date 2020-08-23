<template>
   <div id="app">
        <h1>{{message}}</h1>
        <input v-model="message"/>
        <button @click="onClick">点击</button>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="/about">About</router-link>
            </li>
            <li>
                <router-link to="/posts">Posts</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            message: '拉钩教育'
        }
    },
    methods: {
        onClick() {
            console.log('hello world')
        }
    }
}
</script>

<style>

</style>