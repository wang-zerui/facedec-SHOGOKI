<template>
    <div id="app">
      <!-- <a-space direction="vertical"> -->
        <a-card title="合同详情">
            在这里显示其他信息
        </a-card>
        <a-card title="合同文件" style="margin-top: 24px">
            <div>
              点击右边第一个按钮进行签字，第二个按钮保存到本地
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
                url: 'https://cdn.jsdelivr.net/gh/xinwuyun/facedec-SHOGOKI@main/src/assets/contracts/合同1.pdf',
                title: "《销售合同》",
                createdTime: "2020年5月5日",
                signed: 0
            },
            {
                id: 2,
                url: 'https://cdn.jsdelivr.net/gh/xinwuyun/facedec-SHOGOKI@main/src/assets/contracts/合同2.pdf',
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
  