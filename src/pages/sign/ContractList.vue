<template>
    <div>
      <a-card :bordered="false">
        <div style="display: flex; flex-wrap: wrap">
            <head-info title="合同总数" :content="contracts.length" :bordered="true"/>
            <head-info title="待签署" :content="getUnsignedNumber" :bordered="true"/>
        </div>
      </a-card>
      <a-card
        style="margin-top: 24px"
        :bordered="true"
        title="所有合同"
      >
        <a-list size="large">
          <a-list-item :key="index" v-for="(c, index) in contracts">
            <a-list-item-meta
              
            >
              <a slot="title" :href="`#/list/user/` + c.id">{{c.title}}</a>
            </a-list-item-meta>
            <div slot="actions"> 
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <router-link :to="`/contract/${c.id}/sign`">
                      {{c.signed?'重新签署':'签署'}}
                    </router-link>
                  </a-menu-item>
                  
                  <a-menu-item><a>删除</a></a-menu-item>
                </a-menu>
                <a>更多<a-icon type="down"/></a>
              </a-dropdown>
            </div>
            <div class="list-content">
              <div class="list-content-item">
                <span>
                  状态
                </span>
                <p>
                  {{c.signed?'已签署':'待签署'}}
                </p>
              </div>
              <div class="list-content-item">
                <span>创建时间</span>
                <p>
                  {{c.createdTime}}
                </p>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
  </template>
  
  <script>
  import HeadInfo from '../../components/tool/HeadInfo'
  export default {
    name: 'StandardList',
    components: {HeadInfo},
    data() {
      return {
        contracts: []
      }
    },
    created() {
      // TODO: 可以改为通过API获取
      this.contracts = [ 
          {
            id: 1,
            title: "《销售合同》",
            createdTime: "2022年5月5日",
            signed: 0
          },
          {
            id: 2,
            title: "《租赁合同》",
            createdTime: "2022年5月6日",
            signed: 1
          },
      ]
    },
    computed: {
      getUnsignedNumber(){
        let count = 0;
        for(let i of this.contracts){
          if(!i.signed){
            count++;
          }
        }
        return count;
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
    .list-content-item{
      color: @text-color-second;
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      margin-left: 40px;
      span{
        color: rgba(0,0,0, 0.65);
        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
      }
      p{
        margin: 4px 0 0;
        line-height: 22px;
      }
    }
  </style>
  