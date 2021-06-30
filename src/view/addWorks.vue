<template>
  <div class="wrapper">
    <Card :bordered="false">
      <div slot="title" class="cardHead">
        <Icon type="ios-nuclear-outline" color="#fff" size="22" />
        <p>岗位信息</p>
      </div>
      <!-- 添加岗位 -->
      <div class="addWorks">
        <div class="adds" v-if="type == 'jobs'">添加岗位</div>
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
            <div class="rootSearch">
              <Input
                v-model="rootName"
                placeholder="请输入权限名称"
                style="width: 250px"
              />
              <Button
                type="primary"
                icon="ios-search"
                style="margin-left: 15px"
                @click="getPowerList"
                >查询</Button
              >
            </div>
            <div class="collapseBox">
              <Collapse v-model="value2" accordion>
                <Panel
                  v-for="powerGroup in powerList"
                  :key="powerGroup.id"
                  :name="powerGroup.name"
                >
                  {{ powerGroup.name }}
                  <Tree
                    slot="content"
                    :data="powerGroup.tree"
                    show-checkbox
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
      <!-- 权限·配置· -->
      <!-- <div class="addWorks" v-else>
        <div class="adds">权限配置</div>
        <div class="workCon">
          <div class="rootCon">
            <div class="rootSearch">
              权限名称：
              <Input
                v-model="rootName"
                placeholder="请输入权限名称"
                style="width: 250px"
              />
              <Button type="primary" icon="ios-search" style="margin-left: 15px"
                >查询</Button
              >
            </div>
            <div class="collapseBox">
              <Collapse v-model="value2" accordion>
                <Panel name="1">
                  史蒂夫·乔布斯
                  <p slot="content">
                    史蒂夫·乔布斯（Steve
                    Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。
                  </p>
                </Panel>
                <Panel name="2">
                  斯蒂夫·盖瑞·沃兹尼亚克
                  <p slot="content">
                    斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary
                    Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC
                    Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。
                  </p>
                </Panel>
                <Panel name="3">
                  乔纳森·伊夫
                  <p slot="content">
                    乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                  </p>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
        <div class="footers">
          <Button type="primary" ghost @click="resetForm()">取消</Button>
          <Button type="primary" @click="submitForm()" style="margin-left: 15px"
            >提交</Button
          >
        </div>
      </div> -->
    </Card>
  </div>
</template>

<script>
import { getPower, addStation } from "@/api/mangeUser";
export default {
  components: {},
  data() {
    return {
      rootName: "",
      type: "",
      stationId: 0,
      value2: "",
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
            // _this.powerList = data.data;
            _this.powerList = data.data.map((p) => ({
              ...p,
              tree: [_this.parseTree(p)],
            }));
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
      // o.selected = true;
      o.expand = true;
      if (o.powerchilds)
        o.children = o.powerchilds.map((ch) => _this.parseTree(ch));
      return o;
    },
    onCheckPower(selected, current) {
      this.selectedPower = selected;
    },
    addPost() {},
    sureDel() {},
    submitForm(formName) {
      const _this = this;
      const r = {
        stationId: this.stationId, // ? 新增岗位哪来的id
        name: this.ruleForm.name.replace(/\s*/g, "") || "",
        desc: this.ruleForm.desc.replace(/\s*/g, "") || "",
        powerIdArr: this.selectedPower.map((e) => e.id),
      };
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
      } else {
        Object.keys(r).forEach(
          (key) => (r[key] == null || r[key] == "") && delete r[key]
        );
        if (this.selectedPower.length === 0) {
          _this.$Notice.warning({
            title: "请勾选需要配置的权限",
          });
          return false;
        }
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
  border: 1px solid #999;
  padding: 15px 20px;
  box-sizing: border-box;
  margin-top: 15px;
}
.footers {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
