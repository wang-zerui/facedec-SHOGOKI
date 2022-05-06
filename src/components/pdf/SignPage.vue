<template>
    <div id="app">
      <WebViewer :path="`${publicPath}lib`" url="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0ae4c3dd-984f-4969-9c9d-65014970e37f/signexample.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220506T111450Z&X-Amz-Expires=86400&X-Amz-Signature=7e7e21e4b4e715ceac2fe6548bb7880c8583ebc73263a928bfa2bbaf8f859c12&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22signexample.pdf%22&x-id=GetObject"/>
    </div>
</template>

<script>
import WebViewer from './WebViewer.vue'

export default {
name: 'SignPage',
components: {
    WebViewer
},
data () {
    return {
        publicPath: process.env.BASE_URL
    }
}
}
</script>

<style>
#app {
font-family: 'Avenir', Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-align: center;
color: #2c3e50;
}
</style>
  