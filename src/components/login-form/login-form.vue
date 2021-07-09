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
        <Poptip placement="bottom" width="250" v-model="visibleSaved" :disabled="savedEmpty" >
          <Input
            v-model="form.adminNo"
            placeholder="请输入登录ID"
            class="inp"
          />
          <div class="api" slot="content">
            <Card :bordered="false">
              <div slot="title" class="cardHead">
                <p>保存的密码</p>
              </div>
              <Button type="text" long
                v-for="(a, ii) in saveAccount"
                :key="a.adminNo"
                @click="onSelectSaved(ii)"
              >
                <!-- style="display: flex; justify-content: space-between;" -->
              <Row
                type="flex"
                justify="space-between"
              >
                <Col>{{ a.adminNo }}</Col>
                <Col>••••••</Col>
              </Row>
              </Button>
              <!-- <Row
                type="flex"
                justify="space-between"
                v-for="(a, i) in saveAccount"
                :key="a.adminNo"
                @click.native="onSelectSaved(i)"
              >
                <Col>{{ a.adminNo }}</Col>
                <Col>••••••</Col>
              </Row> -->
            </Card>
          </div>
        </Poptip>
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
      <Checkbox v-model="remember">记住密码</Checkbox>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long class="btns"
        >登录</Button
      >
    </FormItem>
  </Form>
</template>
<script>
import { readSaved } from "@/libs/util";
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
      remember: false,
      visibleSaved: false,
      saveAccount: readSaved(),
    };
  },
  computed: {
    rules() {
      return {
        adminNo: this.userNameRules,
        password: this.passwordRules,
      };
    },
    savedEmpty(){
      return this.saveAccount.length === 0;
    },
  },
  methods: {
    handleSubmit() {
      window.sessionStorage.setItem("password", this.form.password);
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit("on-success-valid", {
            adminNo: this.form.adminNo,
            password: this.form.password,
            remember: this.remember,
          });
        }
      });
    },
    onSelectSaved(i){
      this.visibleSaved = false;
      this.form.adminNo = this.saveAccount[i].adminNo
      this.form.password = this.saveAccount[i].password
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
/deep/.ivu-checkbox-input,
/deep/.ivu-checkbox-inner {
  border-radius: 0;
  border: 1px solid #20a3f5;
  background: transparent;
}
/deep/.ivu-poptip {
  width: 100%;
  .ivu-poptip-rel {
    width: inherit;
  }
  .ivu-poptip-body {
    padding: 0;
  }
  .ivu-poptip-arrow,
  .ivu-poptip-arrow::after {
    content: "";
    border: none;
  }
  .ivu-card-head {
    border-radius: 4px 4px 0 0;
    background: #1991dd;
    p {
      color: #fff;
      font-weight: 400;
    }
  }
  .ivu-card-body {
    color: #000;
    padding: 0;
    display: flex;
    flex-direction: column;
    .ivu-row-flex{
      padding: 0.5em 0;
    }
  }
}
/deep/.ivu-input {
  flex: 1;
  background: transparent;
  border-radius: 0;
  border: 0;
  color: #fff;
}
/deep/.ivu-input::-webkit-input-placeholder,
/deep/.ivu-form-item-content {
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
  // margin-top: 45px;
}
</style>
