<template>
  <div class="wrapper">
    <!-- 左 -->
    <Card :bordered="false" style="width: 25%">
      <div slot="title" class="cardHead">
        <Icon type="ios-school-outline" color="#fff" size="22" />
        <p>组织机构</p>
      </div>
      <div class="searchCon">
        <Input
          v-model="searchVal"
          icon="md-close"
          placeholder="请输入机构关键字"
          @on-click="clearCon"
          style="width: 83%"
        />
        <Button type="primary" icon="ios-search" />
      </div>
      <div class="treeCon">
        <Tree :data="TreeData" />
      </div>
    </Card>
    <!-- 右 -->
    <div class="rightCon" style="width: 74%">
      <Card :bordered="false">
        <div slot="title" class="cardHead">
          <Icon type="ios-contact-outline" color="#fff" size="22" />
          <p>机构信息</p>
        </div>
        <div class="userTables">
          <div class="searchWarp">
            <Button type="primary" icon="md-add" @click="addUser"
              >添加机构</Button
            >
          </div>
          <el-table
            :data="tableData1"
            stripe
            border
            empty-text="暂无数据"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              fontWeight: 'normal',
              fontSize: '12px',
            }"
            style="margin-top: 15px"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60"
            />
            <el-table-column prop="name" label="机构名称" align="center" />
            <el-table-column prop="name" label="机构编号" align="center" />
            <el-table-column prop="name" label="业务分组" align="center" />
            <el-table-column label="业务类型" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.result == 0" type="text" size="small"
                  >启用</el-button
                >
                <el-button
                  v-else
                  type="text"
                  size="small"
                  style="color: #e02020"
                  >禁用</el-button
                >
              </template>
            </el-table-column>
            <el-table-column prop="name" label="描述" align="center" />
            <el-table-column prop="address" label="创建时间" align="center" />
          </el-table>
          <div class="pageCon">
            <div class="showCon">
              显示 1-10 条，共 {{ page.totalElement }} 条
            </div>
            <div class="paginationStyle">
              <el-button @click="currentChange(1)" type="text" size="small"
                >首页</el-button
              >
              <Page
                @on-change="currentChange"
                @on-page-size-change="sizeChange"
                :current="page.currentPage"
                :total="page.totalElement"
                prev-text="< 上一页"
                next-text="下一页 >"
                show-elevator
                show-sizer
                class-name="page-box"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 添加添加机构 -->
    <el-dialog title="添加机构" :visible.sync="centerDialogVisible" width="30%">
      <div class="centerCon">
        <Form
          :model="organForm"
          :rules="formRules"
          ref="organForm"
          :inline="true"
          :label-width="80"
          class="demo-ruleForm"
        >
          <FormItem label="机构：" prop="val">
            <Input
              v-model="organForm.val"
              placeholder="请输入机构编号"
              style="width: 230px"
            />
            <p>备注：从中间库导入机构</p>
          </FormItem>
        </Form>
        <div>机构：</div>
        <div>
          <Input
            v-model="searchVal"
            placeholder="请输入机构编号"
            style="width: 250px"
          />
          <p>备注：从中间库导入机构</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button type="primary" @click="centerDialogVisible = false" ghost
          >取 消</Button
        >
        <Button type="primary" @click="handleImport" style="margin-left: 20px"
          >导 入</Button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrganList, addOrgan } from "@/api/mangeUser";
export default {
  components: {},
  data() {
    return {
      centerDialogVisible: false,
      searchVal: "",
      organForm: {
        val: "",
      },
      formRules: {
        val: [{ required: true, message: "请输入机构编号", trigger: "blur" }],
      },
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      TreeData: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1",
                },
                {
                  title: "leaf 1-1-2",
                },
              ],
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1",
                },
                {
                  title: "leaf 1-2-1",
                },
              ],
            },
          ],
        },
      ],
      tableData1: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区",
          result: 0,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区",
          result: 1,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区",
          result: 0,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区",
          result: 1,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区",
          result: 1,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区",
          result: 0,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区",
          result: 0,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区",
          result: 1,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区",
          result: 0,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区",
          result: 1,
        },
      ],
    };
  },
  mounted() {
    this.getTreeData()
  },
  methods: {
    getTreeData() {
      const _this = this;
      const r = {
        org_code: "",
        org_name: this.searchOrgan,
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getOrganList(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            // _this.TreeData = data.data;
            _this.tableData1 = data.data;
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
    onTreeNodeClick(currentTree, currentNode) {
      console.log(currentTree, currentNode);
      const _this = this;
    },
    parseTree(obj, childrenKey) {
      const _this = this;
      const o = { ...obj };
      o.title = o.name;
      // o.selected = true;
      o.expand = true;
      if (o.hasOwnProperty(childrenKey))
        o.children = o[childrenKey].map((ch) => _this.parseTree(ch));
      return o;
    },
    clearCon() {
      this.searchVal = "";
    },
    addUser() {
      this.centerDialogVisible = true;
    },
    handleImport() {
      const _this = this;
      const r = {
        orgCode: this.organForm.val.replace(/\s*/g, "") || "",
      }
      this.$refs.organForm.validate((valid) => {
        if (valid) {
          addOrgan(r)
            .then((resp) => {
              let data = resp.data;
              if (data.code === 20000) {
                _this.$message({
                  message: `${data.message}`,
                  type: "success",
                  duration: 1500,
                });
                _this.centerDialogVisible = false;
              } else {
                _this.$notify({
                  title: "温馨提示",
                  type: "warning",
                  message: data.message,
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
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.query();
    },
    sizeChange(size) {
      this.page.size = size;
      this.currentChange(1);
      // this.query();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
}
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
.searchCon {
  width: 100%;
  display: flex;
  padding-bottom: 15px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #999;
}
.centerCon {
  display: flex;
  justify-content: flex-start;
  margin: 50px 0;
  p {
    margin-top: 5px;
  }
}
.treeCon {
  margin-top: 17px;
}
.searchWarp {
  display: flex;
  justify-content: flex-end;
}
.pageCon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
/deep/.paginationStyle {
  display: flex;
  margin-top: 0;
}
.paginationStyle > .el-button {
  margin-right: 1rem;
}
/deep/.el-dialog {
  width: 33%;
}
/deep/.el-dialog__body {
  padding: 20px;
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #999;
}
/deep/.el-dialog__footer {
  border: 1px solid;
  display: flex;
  justify-content: center;
}
</style>
