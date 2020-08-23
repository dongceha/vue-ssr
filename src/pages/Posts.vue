<template>
  <div>
      <ul>
          <li v-for="post in posts" :key="post.id">{{post.title}}</li>
      </ul>
  </div>
</template>

<script>
// import axios from 'axios'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'PostList',
    metaInfo: {
        title: 'Posts'
    },
    computed: {
        ...mapState(['posts'])
    },
    data() {
        return {
            // posts: []
        }
    },
    // vue ssr 特殊为 服务端渲染提供的一个 生命周期钩子函数
    serverPrefetch() {
        // 调用 action 返回 promise
        return this.getPosts()
    },
    methods: {
        ...mapActions(['getPosts'])
    }
    // 服务端渲染
    //   只支持 beforeCreate 和 created
    //   不会等待 beforeCreate 和 created 中的异步操作
    //   不支持响应式数据
    // 所有这总做法在 服务端渲染中是不会工作的！！
    // async created() {
    //     console.log('created start')
    //     const { data } = await axios({
    //         method: 'GET',
    //         url: 'https://cnodejs.org/api/v1/topics'
    //     })
    //     this.posts = data.data;
    //     console.log('created end')
    // }
}
</script>

<style>

</style>