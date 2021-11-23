<template>
  <div>
    <a-card :bordered="false">
      <div style="display: flex; flex-wrap: wrap">
          <head-info title="用户总数" :content="users.length" :bordered="true"/>
          <head-info title="人脸总数" :content="users.length" :bordered="true"/>
      </div>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="true"
      title="所有用户"
    >
      <a-list size="large">
        <a-list-item :key="index" v-for="(user, index) in users">
          <a-list-item-meta
            :description="'ID:' + user.ID"
          >
            <a-avatar slot="avatar" size="large" shape="square" :src="user.pic_url"/>
            <a slot="title" :href="`#/list/user/` + user.ID">{{user.user_name}}</a>
          </a-list-item-meta>
          <div slot="actions"> 
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a :href="`#/list/user/` + user.ID">人脸管理</a></a-menu-item>
                <a-menu-item><a>编辑</a></a-menu-item>
                <a-menu-item><a>删除</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>
                角色权限
              </span>
              <p>
                {{user.role === "Administrator" ? "Admin" : user.role}}
              </p>
            </div>
            <div class="list-content-item">
              <span>性别</span>
              <p>
                {{ user.gender === "male" ? "男" : "女" }}
              </p>
            </div>
            <div class="list-content-item">
              <span>出勤率</span>
              <p>
                <a-progress :percent="80" style="width: 180px" />
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
      users: []
    }
  },
  created() {
    this.users = [];
    var requestOptions = {
      method: 'GET',
    };

    fetch("http://124.71.174.198:8088/infoGetHttpServer", requestOptions)
      .then(response => response.json())
      .then(result => this.users = result.user_info)
      .catch(error => console.log('error', error));
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
