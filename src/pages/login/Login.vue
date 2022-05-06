<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/xidian-logo-red.png" />
        <span class="title">{{systemName}}</span>
      </div>
      <div class="desc">一个简单的人脸识别系统</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="账户密码登录" key="1">
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入用户名"
                v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <div>
          <a-checkbox :checked="true" >自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
          </div>
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
          </a-form-item>
          <div>
            其他登录方式
            <a-icon class="icon" type="alipay-circle" />
            <a-icon class="icon" type="taobao-circle" />
            <a-icon class="icon" type="weibo-circle" />
            <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>
          </div>
          </a-tab-pane>
          <a-tab-pane tab="刷脸登录" key="2">
            <a-form-item>
              <a-modal
                title="请用微信扫码进行认证"
                :visible="visible"
                :confirm-loading="confirmLoading"
                ok-text="我已完成"
                @ok="handleOk"
                @cancel="handleCancel"
              >
                <a-alert :type="alertType"  v-if="error" :message="message" showIcon style="margin-bottom: 24px;" />
                <img style="width:100%" :src="qrCodeUrl" alt="">
              </a-modal>
                <img style="width:100%" src="@/assets/img/fact-dec-banner.svg" alt="">
              <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary" @click="showModal">开始认证</a-button>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import {login, getRoutesConfig} from '@/services/user'
import {setAuthorization} from '@/utils/request'
import {loadRoutes} from '@/utils/routerUtil'
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      logging: false,
      alertType: "error",
      error: '',
      message: "",
      form: this.$form.createForm(this),
      ModalText: '请用微信扫码进行认证',
      visible: false,
      confirmLoading: false,
      qrCodeUrl: "",
      id: "",
      // baseUrl: "http://43.138.171.232:8088",
      // baseUrl: "http://localhost:8088"
      baseUrl: "https://service-7wtzjrxq-1301774019.gz.apigw.tencentcs.com"
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          const name = this.form.getFieldValue('name')
          const password = this.form.getFieldValue('password')
          login(name, password).then(this.afterLogin)
        }
      })
    },
    showModal() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      var raw = "wzr";

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
   fetch(`${this.baseUrl}/QRCodeServer`, requestOptions)
      // fetch("https://service-rf83c9fw-1301774019.gz.apigw.tencentcs.com/release/getQrCodeUrl", requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log(result);
          this.qrCodeUrl = "data:image/jpeg;base64," + result.image;
          this.id = result.id;
          console.log(this.id);
          this.visible = true;
        })
      },
    handleOk() {
      this.confirmLoading = true;
      fetch(`${this.baseUrl}/checkSateServer`, {method: "POST", body: JSON.stringify({"id": this.id})})
        .then(response => response.json())
        .then(response => {
          if(response.error_code === "1"){
            console.log(response);
            this.confirmLoading = false;
            this.showAlert("success", "验证成功，你是" + response.uid + "正在跳转...");
            setTimeout(()=>{this.visible = false;}, 2000);
            // TODO:cookie中添加用户信息
            setTimeout(() => {
              getRoutesConfig().then(result => {
                const routesConfig = result.data.data
                loadRoutes(routesConfig)
                this.$router.push('/dashboard/workplace')
              })
            }, 3000)
          }else{
            this.showAlert("error", "验证失败，请重新扫码或刷新页面");
            this.confirmLoading = false;
          }
        })
    },
    handleCancel() {
      console.log('Clicked cancel button');
      this.visible = false;
      this.confirmLoading = false;
    },
    afterLogin(res) {
      this.logging = false
      const loginRes = res.data
      if (loginRes.code >= 0) {
        const {user, permissions, roles} = loginRes.data
        this.setUser(user)
        this.setPermissions(permissions)
        this.setRoles(roles)
        setAuthorization({token: loginRes.data.token, expireAt: new Date(loginRes.data.expireAt)})
        // 获取路由配置
        getRoutesConfig().then(result => {
          const routesConfig = result.data.data
          loadRoutes(routesConfig)
          this.$router.push('/dashboard/workplace')
          this.$message.success(loginRes.message, 3)
        })
      } else {
        this.error = loginRes.message
      }
    },
    showAlert(state, message) {
      this.error = false;
      if(state === "success"){
        console.log("alert success");
        this.alertType = "success";
        this.error = true;
      }else if(state === "error") {
        this.alertType = "error";
        this.error = true;
      }
      this.message = message;
      setTimeout(()=>{
        this.error = false;
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
