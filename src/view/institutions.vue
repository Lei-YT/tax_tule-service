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
        <Button type="primary" icon="ios-search" @click="getTreeData" />
      </div>
      <div class="treeCon">
        <Tree
          :data="TreeData"
          @on-select-change="onTreeNodeClick"
          @on-toggle-expand="onTreeToggle"
        />
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
            <el-table-column type="index" label="序号" align="center" width="60" />
            <el-table-column prop="OrgName" label="机构名称" align="center"  />
            <el-table-column prop="OrgCode" label="机构编号" align="center" width="200"/>
            <el-table-column prop="created_at" label="创建时间" align="center" width="160" />
          </el-table>
          <!-- <div class="pageCon">
            <div class="showCon">共 {{ page.totalElement }} 条</div>
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
          </div> -->
        </div>
      </Card>
    </div>

    <!-- 添加添加机构 -->
    <el-dialog title="添加机构" :visible.sync="centerDialogVisible" width="400px">
      <template slot="title">
        <div class="dialog-title">
      <svg t="1626971687342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13173" width="24" height="24" fill="#1991DD"><path d="M911.36 888.8H872V418.4c0-38.4-31.2-69.6-69.6-69.6H620v-192c0-39.84-32.16-72-72-72H212c-39.84 0-72 32.16-72 72v732h-33.12c-16.32 0-29.76 13.44-29.76 29.76s13.44 29.76 29.76 29.76h804c16.32 0 29.76-13.44 29.76-29.76s-12.96-29.76-29.28-29.76z m-351.36 0H200v-720c0-13.44 10.56-24 24-24h312c13.44 0 24 10.56 24 24v720z m252 0H620v-480h164.16c15.36 0 27.84 12.48 27.84 27.84V888.8z" p-id="13174"></path><path d="M761.6 552.8h-91.2c-14.4 0-26.4 12-26.4 26.4s12 26.4 26.4 26.4h91.2c14.4 0 26.4-12 26.4-26.4s-11.52-26.4-26.4-26.4zM764 692h-96c-13.44 0-24 10.56-24 24v4.8c0 13.44 10.56 24 24 24h96c13.44 0 24-10.56 24-24V716c0-12.96-10.56-24-24-24zM492.8 586.4h-72c-13.44 0-24 10.56-24 24v4.8c0 13.44 10.56 24 24 24h72c13.44 0 24-10.56 24-24v-4.8c0-13.44-10.56-24-24-24z m-156 0h-72c-13.44 0-24 10.56-24 24v4.8c0 13.44 10.56 24 24 24h72c13.44 0 24-10.56 24-24v-4.8c0-13.44-11.04-24-24-24zM494.24 440h-72c-13.44 0-24 10.56-24 24v4.8c0 13.44 10.56 24 24 24h72c13.44 0 24-10.56 24-24V464c0-13.44-10.56-24-24-24z m-156 0h-72c-13.44 0-24 10.56-24 24v4.8c0 13.44 10.56 24 24 24h72c13.44 0 24-10.56 24-24V464c0-13.44-11.04-24-24-24z m156-146.4h-72c-13.44 0-24 10.56-24 24v4.8c0 13.44 10.56 24 24 24h72c13.44 0 24-10.56 24-24v-4.8c0-13.44-10.56-24-24-24z m-156 0h-72c-13.44 0-24 10.56-24 24v4.8c0 13.44 10.56 24 24 24h72c13.44 0 24-10.56 24-24v-4.8c0-13.44-11.04-24-24-24z" p-id="13175"></path></svg>
          <span class="el-dialog__title">添加机构</span>
        </div>
      </template>
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
import { getOrganList, getOrganChildren, addOrgan } from "@/api/mangeUser";
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
      TreeData: [],
      currentOrgan: {},
      tableData1: [],
    };
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      const _this = this;
      const r = {
        org_name: this.searchVal,
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getOrganList(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.TreeData = data.data.map((row) => _this.parseOrganTree(row, 'twolevel'));
            if (data.data.length > 0) {
              _this.currentOrgan = _this.TreeData[0];
              const firstRoot = data.data.findIndex(
                (ee) => Number(ee.IsLowest) === 0
              );
              _this.getCurrentOrganChildren(_this.TreeData[firstRoot], true);
            }
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
      const _this = this;
      _this.currentOrgan = currentNode;
      if (Number(currentNode.IsLowest) === 0) {
        this.getCurrentOrganChildren(currentNode, true);
      }
    },
    onTreeToggle(currentNode) {
      const _this = this;
      if (Number(currentNode.IsLowest) === 0) {
        this.getCurrentOrganChildren(currentNode);
      }
    },
    getCurrentOrganChildren(currentNode, updateTable = false) {
      const _this = this;
      if (currentNode.children[0].hasOwnProperty("title")) {
        if (updateTable) {
          _this.tableData1 = currentNode.children;
        }
        return false;
      }
      const r2 = { OrgID: currentNode.OrgID };
      getOrganChildren(r2)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            currentNode.expand = true;
            currentNode.children = data.data.map((row) =>
              _this.parseOrganTree(row, 'twolevel')
            );
            if (updateTable) {
              _this.tableData1 = data.data;
            }
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
    parseOrganTree(obj, childrenKey = null) {
      const _this = this;
      const o = { ...obj };
      o.title = o.OrgName;
      // o.selected = true;
      o.expand = false;
      o.children = Number(o.IsLowest) === 0 ? [{ expand: false }] : [];
      if (childrenKey && o.hasOwnProperty(childrenKey)) {
        o.children = o[childrenKey].map((ch) => _this.parseOrganTree(ch, childrenKey));
        o.expand = true;
      }
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
      };
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
