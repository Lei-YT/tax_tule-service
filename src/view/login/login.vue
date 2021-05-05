<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="header">
      <img src="@/assets/images/compyLogo.png" class="compyLogo" />
    </div>
    <div class="logBox">
      <img src="@/assets/images/logo.png" class="logImg" />
      <p>中铁隧道局智能审单管理平台</p>
    </div>
    <div class="login-con">
      <Card title="用户登录 / USER LOGIN">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm,
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ adminNo, password }) {
      // this.$router.push({ path: "/" });
      this.handleLogin({ adminNo, password }).then((res) => {
        console.log(res, "-------------------");
        if (res.code == 0) {
          //   this.$router.push({ path: "/" });
          // this.getUserInfo().then((res) => {
            this.$router.push({
              name: this.$config.homeName,
            });
          // });
        }
      });
    },
  },
};
</script>

<style>
</style>
