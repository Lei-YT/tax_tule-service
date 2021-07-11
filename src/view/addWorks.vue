<template>
  <div class="wrapper">
    <Card :bordered="false">
      <div slot="title" class="cardHead">
        <Icon type="ios-nuclear-outline" color="#fff" size="22" />
        <p>添加岗位</p>
      </div>
      <!-- 添加岗位 -->
      <div class="addWorks">
        <!-- <div class="adds" v-if="type == 'jobs'">添加岗位</div> -->
        <div class="workCon">
          <Form
            v-if="type == 'jobs'"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :inline="true"
            :label-width="80"
            class="demo-ruleForm"
          >
            <FormItem label="岗位名称" prop="name">
              <Input
                v-model="ruleForm.name"
                placeholder="请输入岗位名称"
                style="width: 230px"
              />
            </FormItem>
            <FormItem label="岗位描述" prop="desc">
              <Input
                v-model="ruleForm.desc"
                placeholder="请输入描述"
                style="width: 230px"
              />
            </FormItem>
          </Form>
          <p style="margin: 0">权限配置：</p>
          <div class="rootCon">
            <div class="collapseBox">
              <Collapse v-model="value2" simple>
                <Panel
                  name="菜单权限"
                >
                  菜单权限
                  <Tree
                    slot="content"
                    :data="powerList"
                    show-checkbox
                    check-directly
                    multiple
                    @on-check-change="onCheckPower"
                  ></Tree>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
        <div class="footers">
          <Button type="primary" ghost @click="resetForm('ruleForm')"
            >取消</Button
          >
          <Button
            type="primary"
            @click="submitForm('ruleForm')"
            style="margin-left: 15px"
            >提交</Button
          >
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import { getPower, addStation, editStation } from "@/api/mangeUser";
export default {
  components: {},
  data() {
    return {
      rootName: "",
      type: "",
      stationId: 0,
      value2: ["菜单权限"],
      powerList: [],
      powerTree: [],
      selectedPower: [],
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      ruleForm: {
        name: "",
        account: "",
        desc: "",
      },
      rules: {
        name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
      },
    };
  },
  created() {
    this.type = this.$route.params.type;
    this.stationId = this.$route.params.stationId || 0;
  },
  mounted() {
    this.getPowerList();
  },
  methods: {
    getPowerList() {
      const _this = this;
      const r = {
        name: this.rootName,
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getPower(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            const allPower = data.data.map((p) => _this.parseTree(p));
            _this.powerList = [
              { title: "全选", children: allPower, expand: true },
            ];
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    parseTree(obj) {
      const _this = this;
      const o = { ...obj };
      o.title = o.name;
      o.expand = true;
      if (o.powerchilds)
        o.children = o.powerchilds.map((ch) => _this.parseTree(ch));
      return o;
    },
    onCheckPower(selected, current) {
      this.selectedPower = selected;
    },
    submitForm(formName) {
      const _this = this;
      const r = {
        // stationId: this.stationId, // ? 新增岗位哪来的id
        name: this.ruleForm.name.replace(/\s*/g, "") || "",
        describe: this.ruleForm.desc.replace(/\s*/g, "") || "",
        powerIdArr: this.selectedPower.map((e) => e.id),
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      if (this.type === "jobs") {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addStation(r)
              .then((resp) => {
                let data = resp.data;
                if (data.code === 0) {
                  _this.$message({
                    message: `${data.msg}`, // ${data.message}
                    type: "success",
                    duration: 1500,
                  });
                  _this.$router.push({
                    name: "workPermiss",
                  });
                } else {
                  _this.$notify({
                    title: "温馨提示",
                    type: "warning",
                    message: data.msg,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            return false;
          }
        });
      }
    },
    resetForm(formName) {
      this.$router.push({
        name: "workPermiss",
      });
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
/deep/.ivu-card-head {
  border-radius: 5px 5px 0 0;
  background: #1991dd;
  p {
    color: #fff;
    font-weight: 400;
  }
}
.cardHead {
  display: flex;
  align-items: center;
  p {
    margin-left: 10px;
  }
}
.adds {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #999;
  margin-bottom: 15px;
}
.addWorks {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.rootSearch {
  margin-bottom: 20px;
}
/deep/.ivu-form-item {
  margin-bottom: 15px;
}
.rootCon {
  // border: 1px solid #999;
  padding: 15px 0;
  box-sizing: border-box;
  margin-top: 15px;
}
.footers {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
