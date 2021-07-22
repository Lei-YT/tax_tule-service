<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <div class="avatarBox">
        <!-- <img :src="userAvatar" class="icon" /> -->
        <svg
          t="1620487856051"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="10694"
          width="48"
          height="48"
        >
          <path
            d="M922.93 338.39c-22.46-53.11-54.62-100.81-95.57-141.76-40.95-40.95-88.64-73.1-141.76-95.57C630.61 77.8 572.2 66 512 66c-60.2 0-118.61 11.8-173.61 35.06-53.11 22.46-100.81 54.62-141.76 95.57-40.95 40.95-73.1 88.64-95.57 141.76C77.8 393.39 66 451.8 66 512c0 60.2 11.8 118.61 35.06 173.61 22.46 53.11 54.62 100.81 95.57 141.76 40.95 40.95 88.64 73.1 141.76 95.57C393.39 946.2 451.8 958 512 958c60.2 0 118.61-11.8 173.61-35.06 53.11-22.46 100.81-54.62 141.76-95.57 40.95-40.95 73.1-88.64 95.57-141.76C946.2 630.61 958 572.2 958 512c0-60.2-11.8-118.61-35.07-173.61zM796.07 773.07v-11.59c0-99.38-51-152.26-93.77-179.14-18.41-11.57-39.43-20.94-62.89-28.02-34.05 29.81-78.69 47.9-127.41 47.9s-93.36-18.09-127.41-47.9c-23.46 7.08-44.48 16.46-62.89 28.02-42.77 26.8-93.76 79.75-93.76 179.14v11.6C164.68 704.3 126 612.58 126 512c0-212.84 173.16-386 386-386s386 173.16 386 386c0 100.58-38.68 192.29-101.93 261.07z"
            fill="#1991DD"
            p-id="10695"
          ></path>
          <path
            d="M512 408.57m-154.95 0a154.95 154.95 0 1 0 309.9 0 154.95 154.95 0 1 0-309.9 0Z"
            fill="#1991DD"
            p-id="10696"
          ></path>
        </svg>
        <span>{{ userName }}</span>
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
      </div>

      <DropdownMenu slot="list">
        <DropdownItem name="changepassword">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <el-dialog title="修改密码" :visible.sync="centerDialogVisible" width="500px">
      <div slot="title" style="color: #2d8cf0;">
        <Icon type="ios-lock-outline" size="20" style="font-weight: 600;" />
        <span style="margin-left: .5em;">修改密码</span>
      </div>
      <div class="centerCon">
        <el-form
          class="modify-form"
          :model="pwModify"
          label-width="100px"
          center
          :rules="pwRules"
          ref="pwModify"
        >
          <el-form-item label="原密码：" prop="oldpassword">
            <el-input v-model="pwModify.oldpassword" size="medium" placeholder="请输入原密码" />
          </el-form-item>
          <el-form-item label="新密码：" prop="password">
            <el-input v-model="pwModify.password" show-password size="medium" placeholder="请输入新密码" />
            <Row
              v-if="pwModify.password !== ''"
              :gutter="16"
              typr="flex"
              justify="start"
            >
              <Col>强度</Col>
              <Col style="flex: 0 0 150px">
                <Progress
                  :percent="pwCheckPercent"
                  :stroke-color="pwCheckColor"
                  hide-info
                />
              </Col>
              <Col>{{ pwCheckText }}</Col>
            </Row>
          </el-form-item>
          <el-form-item label="密码确认：" prop="passwordConfirm">
            <el-input
              v-model="pwModify.passwordConfirm"
              show-password
              size="medium" placeholder="请再次输入新密码"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button type="primary" @click="centerDialogVisible = false" ghost
          >取 消</Button
        >
        <Button
          type="primary"
          style="margin-left: 20px"
          @click="submitModify('pwModify')"
          >确 定</Button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
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
  name: "User",
  props: {
    userName: {
      type: String,
      default: "",
    },
    userAvatar: {
      type: String,
      default: "",
    },
    messageUnreadCount: {
      type: Number,
      default: 0,
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
      centerDialogVisible: false,
      pwform: {},
      formRules: {},
      adminNo: "",
      uid: "",
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
  computed: {
    newPw() {
      return this.pwModify.password;
    },
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
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: "login",
        });
      });
    },
    message() {
      this.$router.push({
        name: "message_page",
      });
    },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "changepassword":
          this.centerDialogVisible = true;
          break;
        case "message":
          this.message();
          break;
      }
    },
    submitModify(formName) {
      const _this = this;
      let params = {
        adminNo: this.$store.state.user.adminNo,
        password: this.pwModify.password.replace(/\s*/g, "") || "",
        oldpassword: this.pwModify.oldpassword.replace(/\s*/g, "") || "",
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          passwordchange(params).then((res) => {
            if (res.data.code == 0) {
              _this.$confirm("重新登录?", res.data.msg, {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                .then(() => {
                  _this.logout();
                })
                .catch(() => {});
              _this.centerDialogVisible = false;
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
.avatarBox {
  height: 100%;
  // background: red;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    width: 45px;
    height: 45px;
  }
}
.centerCon {
  p {
    margin-top: 5px;
  }
}
/deep/.el-dialog {
  line-height: 1;
  .el-dialog__body {
    padding: 20px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #999;
  }
  .el-dialog__footer {
    border-top: 1px solid;
    display: flex;
    justify-content: center;
  }
}
</style>
