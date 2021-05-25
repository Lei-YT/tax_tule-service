<template>
  <Form
    ref="loginForm"
    :model="form"
    :rules="rules"
    @keydown.enter.native="handleSubmit"
  >
    <FormItem prop="adminNo">
      <div class="inpBox">
        <img src="@/assets/images/users.png" class="users" />
        <Input v-model="form.adminNo" placeholder="请输入登录ID" class="inp" />
      </div>
    </FormItem>
    <FormItem prop="password">
      <div class="inpBox">
        <img src="@/assets/images/pwd.png" class="users" />
        <Input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
          class="inp"
        />
      </div>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long class="btns"
        >登录</Button
      >
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      },
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      },
    },
  },
  data() {
    return {
      form: {
        adminNo: "",
        password: "",
      },
    };
  },
  computed: {
    rules() {
      return {
        adminNo: this.userNameRules,
        password: this.passwordRules,
      };
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit("on-success-valid", {
            adminNo: this.form.adminNo,
            password: this.form.password,
          });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.inpBox {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  border: 1px solid #20a3f5;
  padding: 0 12px;
  box-sizing: border-box;
}
.inp {
  background: transparent;
}

/deep/.ivu-input {
  flex: 1;
  background: transparent;
  border-radius: 0;
  border: 0;
  color: #fff;
}
/deep/.ivu-input::-webkit-input-placeholder{
  color: #fff;
}
/deep/.ivu-input-default {
  background: transparent;
}
.users {
  width: 14px;
  height: 15px;
  margin-right: 5px;
}
.btns {
  width: 100%;
  height: 35px;
  background: #20a3f5;
  color: #fff;
  letter-spacing: 3px;
  margin-top: 45px;
}
</style>
