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
        <p>中铁隧道局Human-AI协同平台</p>
      </div>

      <div class="login-con">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </div>
    </div>
    <el-dialog
      title="首次登录, 请修改密码"
      :visible="showPWModify"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="handleCloseModify"
    >
      <el-form
        :model="pwModify"
        label-width="100px"
        center
        :rules="pwRules"
        ref="pwModify"
      >
        <el-form-item label="旧密码：" prop="oldpassword">
          <el-input v-model="pwModify.oldpassword" />
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input v-model="pwModify.password" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitModify('pwModify')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions, mapMutations } from "vuex";
import { passwordchange } from "@/api/user";
export default {
  components: {
    LoginForm,
  },
  computed: {
    showPWModify: {
      get() {
        return this.$store.state.user.showPWModify;
      },
      set() {},
    },
  },
  data() {
    return {
      pwModify: {
        // adminNo: "",
        password: "",
        oldpassword: "",
      },
      pwRules: {
        // adminNo: [{ required: true, message: "请填写账号" }],
        password: [{ required: true, message: "请填写新密码" }],
        oldpassword: [{ required: true, message: "请填写旧密码" }],
      },
    };
  },
  methods: {
    ...mapActions(["handleLogin"]),
    ...mapMutations(["setShowPWModify"]),
    handleSubmit({ adminNo, password }) {
      const _this = this;
      this.handleLogin({ adminNo, password }).then((res) => {
        if (_this.$store.state.user.isNewUser === 0) {
          this.$router.push({
            name: "home",
          });
        }
      });
    },
    handleCloseModify() {
      this.setShowPWModify(false);
    },
    submitModify(formName) {
      const _this = this;
      let params = {
        adminNo: this.adminNo,
        password: this.pwModify.password.replace(/\s*/g, "") || "",
        oldpassword: this.pwModify.oldpassword.replace(/\s*/g, "") || "",
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          passwordchange(params).then((res) => {
            if (res.data.code == 0) {
              _this.$notify({
                title: res.data.msg,
                type: "success",
                message: '请重新登录.',
              });
              _this.setShowPWModify(false);
            } else {
              _this.$notify({
                title: "温馨提示",
                type: "warning",
                message: res.data.msg,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

