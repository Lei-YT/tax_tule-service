<template>
  <div class="wraps">
    <div id="list">
      <Card style="width: 100%">
        <div style="display: flex;justify-content: space-between;">
            <Form
              :inline="true"
              :model="formInline"
              :label-width="80"
              class="demo-form-inline"
              ref="formInline"
            >
              <FormItem label="姓名：" prop="name">
                <Input v-model="formInline.name" placeholder="请输入" />
              </FormItem>
              <FormItem label="账号：" prop="stationName">
                <Input v-model="formInline.stationName" placeholder="请输入" />
              </FormItem>
              <FormItem>
                <el-button type="primary" @click="searchData()"  icon="el-icon-search" size="small">查询</el-button>
                <el-button @click="handleReset('formInline')" style="margin-left: 15px" icon="el-icon-refresh-left" size="small"
                  >重置</el-button>
              </FormItem>
            </Form>
            <div class="addBox">
              <el-button type="primary" @click="handleClick('add', '')" icon="el-icon-plus" size="small"
                >添加账号</el-button>
            </div>
        </div>
       
      </Card>

      <Card style="width: 100%; margin-top: 20px">
        
        <div class="tableList">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{ background: '#eef1f6' }"
          >
            <el-table-column type="index" label="序号" align="center" width="50" />
            <el-table-column
              prop="stationName"
              label="岗位名称"
              align="center"
            />
            <el-table-column prop="name" label="姓名" align="center" />
            <el-table-column prop="adminNo" label="账号" align="center" />
            <el-table-column
              prop="created_at"
              label="创建时间"
              align="center"
            />
            <el-table-column prop="isEnable" label="启用/禁用" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isEnable === 1">禁用</span>
                <span v-if="scope.row.isEnable === 0">启用</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick('edit', scope.row)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  style="color: red"
                  @click="handleDel(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row class="paginationStyle">
          <el-button
            @click="currentChange(1)"
            type="text"
            size="small"
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
          />
        </el-row>
      </Card>
    </div>
    <!-- 弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        label-width="100px"
        center
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="岗位名称：" prop="stationName">
          <el-input v-model="ruleForm.stationName" />
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="账号：" prop="adminNo">
          <el-input v-model="ruleForm.adminNo" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="ruleForm.password" show-password />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import user from "@/dataJson/user.json";
import {
  getUserList, // 列表
  addUser, // 新增
  editUser, // 编辑
  delUser, // 删除
} from "@/api/user";
export default {
  data() {
    return {
      title: "",
      type: "",
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        stationName: "",
        adminNo: "",
        password: "",
      },
      id: "",
      rules: {
        stationName: [{ required: true, message: "请输入岗位名称" }],
        name: [{ required: true, message: "请填写姓名" }],
        adminNo: [{ required: true, message: "请填写账号" }],
        password: [{ required: true, message: "请填写密码" }],
      },
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      formInline: {
        name: "",
        stationName: "",
      },
      tableData: [],
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      // if (user.code == 0) {
      //   this.tableData = user.data;
      // }
      let params = {
        name: this.formInline.name.replace(/\s*/g, "") || "",
        stationName: this.formInline.stationName.replace(/\s*/g, "") || "",
        pageindex: this.page.currentPage,
        pagesize: this.page.size,
      };
      getUserList(params).then((res) => {
        if (res.data.code == 0) {
          this.tableData = res.data.data;
          this.page.totalElement = res.data.totalcount;
        }
      });
    },
    handleClick(type, row) {
      console.log(row,'44444444');
      this.type = type;
      this.title = type == "edit" ? "编辑账号" : "添加账号";
      if (type == "edit") {
        this.ruleForm = row;
        this.ruleForm.password=window.sessionStorage.getItem("password");
      }else{
        this.ruleForm = {};
      }
      this.id = row.id;
      this.dialogFormVisible = true;
    },
    searchData() {
      this.page.currentPage = 1;
      this.query();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.query();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.query();
    },
    sizeChange(size) {
      this.page.size = size;
      this.query();
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delUser(row.id).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success",
                duration: 1200,
              });
              this.query();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    submit(formName) {
      let params = {
        id: this.type == "edit" ? this.id : "",
        name: this.ruleForm.name.replace(/\s*/g, "") || "",
        stationName: this.ruleForm.stationName.replace(/\s*/g, "") || "",
        adminNo: this.ruleForm.adminNo.replace(/\s*/g, "") || "",
        password: this.ruleForm.password.replace(/\s*/g, "") || "",
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type == "add") {
            addUser(params).then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1500,
                });
                this.query();
              }
            });
          } else if (this.type == "edit") {
            editUser(params).then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1500,
                });
                this.query();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.numCount {
  display: flex;
}
/deep/.el-dialog {
  width: 30%;
}
/deep/.ivu-form-item {
  margin-bottom: 0;
}
/deep/.addBox {
  margin-bottom: 0;
}

.paginationStyle{
  display: flex;
  justify-content: flex-end;
}
.paginationStyle > .el-button {
  margin-right: 1rem;
}
/deep/.ivu-page-prev,/deep/.ivu-page-next {
  display: inline-block;
  vertical-align: middle;
  min-width: 32px;
  height: 32px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  list-style: none;
  background-color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  font-family: Arial;
  font-weight: 500;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  -webkit-transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
/deep/.ivu-page-prev a,/deep/.ivu-page-next a{
  margin: 0 6px;
}
/deep/.ivu-page-item, /deep/.ivu-page-item-jump-next {
  display:none;
}
</style>
