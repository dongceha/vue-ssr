<template>
   <div id="app">
        <h1>{{message}}</h1>
        <input v-model="message"/>
        <button @click="onClick">点击</button>
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