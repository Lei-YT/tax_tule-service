<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="leftImg">
      <img src="@/assets/images/jiqirenshou.png" class="shouImg" />
    </div>
    <div class="rightCon">
      <div class="topLogo">
        <img src="@/assets/images/logo.png" class="logImg" />
        <p>中铁隧道局AI-human协同平台</p>
      </div>
      
      <div class="login-con">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </div>
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
    ...mapActions(["handleLogin"]),
    handleSubmit({ adminNo, password }) {
      // this.$router.push({
      //   name: "home",
      // });
      this.handleLogin({ adminNo, password }).then((res) => {
        this.$router.push({
          name: "home",
        });
      });
    },
  },
};
</script>

