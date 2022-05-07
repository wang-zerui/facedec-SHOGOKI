<template>
  <div class="card-list"> 
    <div v-if="!loading">
      <a-list
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
      >
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- <template>
          <a-button class="new-btn" type="dashed">
            <a-icon type="plus" />新增产品
          </a-button>
        </template> -->
        <template>
          <a-card :hoverable="true">
            <a-card-meta >
              <a-avatar class="card-avatar" slot="avatar" :src="item.image" size="larger" shape="square" />
              <p class="meta-content" slot="description">创建时间：{{item.create_time}}</p>
            </a-card-meta>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
    </div>
    <a-card v-show="loading">
      <a-icon type="loading"/>加载中...
    </a-card>

  </div>
</template>

<script>

export default {
  name: 'Demo',
  data () {
    return {
      desc: '人脸识别服务由百度智能云提供，人脸库中该用户存储的人脸图片如下。',
      extraImage: 'https://bce.bdstatic.com/logo/logo@2x.png',
      linkList: [
        {icon: "file-text", href: 'https://cloud.baidu.com/doc/FACE/index.html', title: '产品文档'},
        {icon: 'cloud', href: 'https://cloud.baidu.com/', title: '智能云首页'}
      ],
      dataSource: [],
      loading: true,
      haveFace: false
    }
  },
  created() {
    const id = this.$route.params.id;
    // this.$route.meta.page.title = "wzr"
    if(!id){
      return
    }
    var raw = JSON.stringify({"user_id": id});
    var requestOptions = {method: 'POST', body: raw};
    fetch("https://service-c408r0iq-1301774019.gz.apigw.tencentcs.com/release/getUserInfo", requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.error_code === "0"){
          setTimeout(() => {
            this.dataSource = result.result;
            console.log("111")
          this.loading = false;
          }, 2000)
          
        }else{
          this.loading = false;
          this.haveFace = false;
        }
      })
      .catch(error => {console.log('error', error); this.loading = false; this.haveFace = false;});
    
  }
}
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 80px;
    height: 80px;
  }
  .new-btn{
    border-radius: 2px;
    width: 100%;
    height: 187px;
  }
  .meta-content{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

</style>
