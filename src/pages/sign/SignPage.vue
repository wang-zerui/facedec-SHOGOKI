<template>
    <div id="app">
      <!-- <a-space direction="vertical"> -->
        <a-card title="合同详情">
            在这里显示其他信息
        </a-card>
        <a-card title="合同文件" style="margin-top: 24px">
            <div>
              点击右边第一个按钮进行签字，第二个按钮保存到本地。（暂未实现更新云端文件）
            </div>
            <WebViewer :path="`${publicPath}lib`" :url="contract.url"/>
        </a-card>
      <!-- </a-space> -->
    </div>
</template>

<script>
import WebViewer from './WebViewer.vue'

export default {
    name: 'SignPage',
    components: {
        WebViewer,
    },
    data () {
        return {
            publicPath: process.env.BASE_URL,
            contract: {
                id: undefined,
                url: undefined,
                title: undefined,
                createdTime: undefined,
                signed: undefined
            }
        }
    },
    created() {
        const contracts = [
            {
                id: 1,
                url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/91f92fbe-4205-44ff-afd5-675013f57637/%E5%90%88%E5%90%8C1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T093443Z&X-Amz-Expires=86400&X-Amz-Signature=307cd825ef1de357f12a44e144146ca601e111886d5d018e1998af5a26864e5e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E5%2590%2588%25E5%2590%258C1.pdf%22&x-id=GetObject',
                title: "《销售合同》",
                createdTime: "2020年5月5日",
                signed: 0
            },
            {
                id: 2,
                url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3fdc7f48-7b12-4bef-a778-9aa4deb45ccd/%E5%90%88%E5%90%8C2.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220507T094213Z&X-Amz-Expires=86400&X-Amz-Signature=3e9b913685080396c0f5502050fe7b19729c400fb4c1ced147f1d3441536d972&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E5%2590%2588%25E5%2590%258C2.pdf%22&x-id=GetObject',
                title: "《租赁合同》",
                createdTime: "2020年5月5日",
                signed: 1
            }
        ]
        const contractId = this.$route.params.id;
        this.contract = contracts.filter((item) => {
            return item.id == contractId;
        })[0]
    }
}
</script>

<style>
#app {
font-family: 'Avenir', Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
/* text-align: center; */
color: #2c3e50;
}
</style>
  