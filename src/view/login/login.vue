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

      <div class="login-con" v-if="!showPWModify">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </div>
      <div class="modify-con" v-else>
        <div class="modify-header">
          <img src="@/assets/images/pw-head.png" class="headImg" />
          <p class="headTitle">修改密码</p>
        </div>
        <el-form
          class="modify-form"
          label-position="top"
          :model="pwModify"
          label-width="100px"
          center
          :rules="pwRules"
          ref="pwModify"
        >
          <el-form-item label="原密码：" prop="oldpassword">
            <el-input v-model="pwModify.oldpassword" size="medium" />
          </el-form-item>
          <el-form-item label="新密码：" prop="password">
            <el-input v-model="pwModify.password" show-password size="medium" />
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
          </el-form-item>
          <el-form-item label="密码确认：" prop="passwordConfirm">
            <el-input v-model="pwModify.passwordConfirm" show-password size="medium" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="small"
            type="primary"
            @click="submitModify('pwModify')"
            >确 定</el-button
          >
          <el-button size="small" @click="handleCloseModify">取 消</el-button>
        </div>
      </div>
    </div>
    <div class="lc-content">
      <span class="lc-company">技术支持：北京令才科技有限公司</span>
      <span class="lc-phone">服务电话400-167-8089</span>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions, mapMutations } from "vuex";
import { passwordchange } from "@/api/user";
function checkStrong(sValue) {
  var modes = 0;
  var txt = "低";
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
      txt = "中";
      color = "#ff9900";
      percent = 66;
      break;
    case 4:
      txt = "高";
      txt = sValue.length < 8 ? "中" : "高";
      color = txt === "高" ? "#19be6b" : "#ff9900";
      percent = txt === "高" ? 100 : 66;
      break;
  }
  return { txt, color, percent };
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
        if (this.pwCheckText !== "高") {
          callback(
            new Error(
              "密码请设置8位以上, 需包含大写字母, 小写字母, 数字, 特殊字符"
            )
          );
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.pwModify.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      adminNo: "",
      pwModify: {
        // adminNo: "",
        password: "",
        oldpassword: "",
        passwordConfirm: "",
      },
      pwRules: {
        // adminNo: [{ required: true, message: "请填写账号" }],
        oldpassword: [{ required: true, message: "请填写原密码" }],
        passwordConfirm: [
          { required: true, message: "请再次输入新密码" },
          { validator: validatePass2, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请填写新密码" },
          { validator: validatePass, trigger: "blur" },
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
    ...mapActions(["handleLogin", "getUserPerms"]),
    ...mapMutations(["setShowPWModify"]),
    handleSubmit({ adminNo, password, remember }) {
      const _this = this;
      this.handleLogin({ adminNo, password, remember }).then((res) => {
        _this.adminNo = adminNo;
        if (_this.$store.state.user.isNewUser === 0) {
          _this.getUserPerms(res).then((perms) => {
            if (perms.length > 0) {
              let firstPage = _this.$store.getters.menuList[0].name;
              if (_this.$store.getters.menuList[0].children.length) {
                firstPage = _this.$store.getters.menuList[0].children[0].name;
              }
              _this.$router.replace({
                name: firstPage,
              });
            } else {
              _this.$notify({
                title: "温馨提示",
                type: "warning",
                message: '未获取到登入权限',
              });
            }
          });
        } else {
          this.$Modal.warning({
            title: "提示",
            content: "新用户首次登录请修改密码！",
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
<style lang="less" scoped>
/deep/.ivu-modal-header {
  background-color: #20a3f5;
  .ivu-modal-header-inner {
    color: #fafafa;
  }
}
/deep/.ivu-icon.ivu-icon-ios-close {
  color: #fafafa;
}
.lc-content{
  position: absolute;
  bottom: 4%;
  color: aliceblue;
  width: 400px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
}
.lc-company{
  float: left;
}
.lc-phone{
  float: right;
}
</style>

