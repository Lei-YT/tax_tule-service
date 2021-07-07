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
          <Row
            v-if="pwModify.password !== ''"
            type="flex"
            :gutter="16"
            justify="start"
          >
            <Col>强度</Col>
            <Col style="flex: 0 0 200px"
              ><Progress
                :percent="pwCheckPercent"
                :stroke-color="pwCheckColor"
                hide-info
            /></Col>
            <Col>{{ pwCheckText }}</Col>
          </Row>
          <!-- stroke-color -->
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
function checkStrong(sValue) {
  var modes = 0;
  var txt = '低';
  var color = "#ed4014"; // #ff9900 #19be6b
  var percent = 33;
  //正则表达式验证符合要求的
  if (sValue.length < 1) return txt;
  if (/\d/.test(sValue)) modes++; //数字
  if (/[a-z]/.test(sValue)) modes++; //小写
  if (/[A-Z]/.test(sValue)) modes++; //大写
  if (/\W/.test(sValue)) modes++; //特殊字符
  switch (modes) {
    case 1:
    case 2:
      break;
    case 3:
      txt = '中';
      color = '#ff9900';
      percent = 66;
      break;
    case 4:
      txt = '高';
      txt = sValue.length < 8 ? '中' : '高';
      color = txt === '高' ? '#19be6b' : '#ff9900';
      percent = txt === '高' ? 100 : 66;
      break;
  }
  return {txt, color, percent};
}
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
    newPw() {
      return this.pwModify.password;
    },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写新密码"));
      } else {
        if (this.pwCheckText !== '高') {
            callback(new Error("密码请设置8位以上, 需包含大写字母, 小写字母, 数字, 特殊字符"));
        }
        callback();
      }
    };
    return {
      pwModify: {
        // adminNo: "",
        password: "",
        oldpassword: "",
      },
      pwRules: {
        // adminNo: [{ required: true, message: "请填写账号" }],
        oldpassword: [{ required: true, message: "请填写旧密码" }],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
      },
      pwCheckColor: "#ed4014", // #ff9900 #19be6b
      pwCheckText: "低",
      pwCheckPercent: 33,
    };
  },
  watch: {
    newPw(newValue, oldValue) {
      const pwCheck = checkStrong(newValue);
      this.pwCheckColor = pwCheck.color;
      this.pwCheckText = pwCheck.txt;
      this.pwCheckPercent = pwCheck.percent;
    },
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
                message: "请重新登录.",
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

