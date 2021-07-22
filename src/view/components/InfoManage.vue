<template>
  <div class="wraps">
    <div id="list">
      <Card style="width: 100%">
        <div style="display: flex; justify-content: space-between">
          <Form
            :inline="true"
            :model="formInline"
            :label-width="140"
            class="demo-form-inline"
            ref="formInline"
          >
            <FormItem label="机器人名称或标签：" prop="name">
              <Input v-model="formInline.name" placeholder="请输入" />
            </FormItem>
            <FormItem :label-width="20">
              <el-button
                type="primary"
                @click="searchData()"
                icon="el-icon-search"
                size="small"
                >查询</el-button
              >
              <el-button
                @click="handleReset('formInline')"
                style="margin-left: 15px"
                icon="el-icon-refresh-left"
                size="small"
                >重置</el-button
              >
            </FormItem>
          </Form>
          <div class="addBox">
            <el-button
              type="primary"
              @click="handleClick('add', '')"
              icon="el-icon-plus"
              size="small"
              >添加机器人</el-button
            >
          </div>
        </div>

        <div class="tableList">
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{ background: '#eef1f6' }"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            />
            <el-table-column
              prop="name"
              label="名称"
              align="center"
              width="150"
            />
            <el-table-column
              prop="label"
              label="标签"
              align="center"
              width="220"
            />
            <el-table-column prop="describe" label="字段描述" align="center" />
            <el-table-column label="操作" width="250" align="left">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color: red"
                  @click="handleDel(scope.row)"
                  >删除</el-button
                >
                <el-button
                  @click="handleClick('edit', scope.row)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
                <el-button
                  @click="handleClick('sets', scope.row)"
                  type="text"
                  size="small"
                  >单量设置</el-button
                >
                <el-button
                  @click="handleOperat(2, scope.row.id)"
                  type="text"
                  size="small"
                  v-if="
                    scope.row.scene_info && scope.row.scene_info.status == 1
                  "
                  >启动</el-button
                >
                <el-button
                  @click="handleOperat(2, scope.row.id)"
                  type="text"
                  size="small"
                  v-if="
                    scope.row.scene_info && scope.row.scene_info.status == 3
                  "
                  >继续</el-button
                >
                <el-button
                  @click="handleOperat(4, scope.row.id)"
                  type="text"
                  size="small"
                  v-if="
                    scope.row.scene_info &&
                    [3, 4].includes(scope.row.scene_info.status)
                  "
                  >结束</el-button
                >
                <!-- <el-button
                  @click="handleOperat(scope.row.id)"
                  type="text"
                  size="small"
                  >重启</el-button
                > -->
                <el-button
                  @click="handleOperat(3, scope.row.id)"
                  type="text"
                  size="small"
                  v-if="
                    scope.row.scene_info && scope.row.scene_info.status == 2
                  "
                  >暂停</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-if="
                    scope.row.scene_info && scope.row.scene_info.status == 5
                  "
                  @click="
                    handleOperat(
                      scope.row.scene_info.status || null,
                      scope.row.id
                    )
                  "
                  >需人工处理</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footBox">
          <div class="totalBox">合计：{{ page.totalElement }}条</div>
          <el-row class="paginationStyle">
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
            />
          </el-row>
        </div>
      </Card>
    </div>
    <!-- 编辑列表资料弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="400px">

      <template slot="title">
        <div class="dialog-title">
          <i class="el-icon-edit" v-if="type==='edit'"></i>
          <Icon type="md-person-add" size="20" v-if="type==='add'" />
          <span class="el-dialog__title">{{title}}</span>
        </div>
      </template>
      <el-form
        :model="ruleForm"
        label-width="100px"
        center
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="名称：" prop="name">
          <Input v-model="ruleForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="ip：" prop="ip">
          <Input v-model="ruleForm.ip" placeholder="请输入ip" />
        </el-form-item>
        <el-form-item label="标签：" prop="label">
          <Select v-model="ruleForm.label" placeholder="请选择标签">
            <Option label="取单回传机器人" value="取单回传机器人"></Option>
            <Option label="自定义" value="自定义"></Option>
          </Select>
          <Input
            v-model="ruleForm.value"
            v-if="ruleForm.label == '自定义'"
            placeholder="请输入标签"
          />
        </el-form-item>
        <el-form-item label="字段描述：" prop="describe">
          <Input
            type="textarea"
            :rows="2"
            placeholder="请输入字段描述"
            v-model="ruleForm.describe"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 单量设置弹框 -->
    <el-dialog :title="title" :visible.sync="numFormVisible" width="400px">
      <template slot="title">
        <div class="dialog-title">
          <svg
            style="display: block"
            t="1620485144823"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1160"
            width="24"
            height="24"
          >
            <path
              d="M594.466 454.588c0-37.137 23.484-68.813 56.252-81.374-7.646-30.584-19.66-59.529-35.499-86.29-32.222 14.2-70.997 8.193-97.212-18.022-26.214-26.214-32.221-64.99-18.022-97.211a363.318 363.318 0 0 0-86.289-35.499c-12.561 32.768-44.237 56.252-81.374 56.252-37.137 0-68.813-23.484-81.374-56.252-30.583 7.646-59.528 19.66-86.289 35.499 14.2 32.222 8.192 70.997-18.022 97.211s-64.99 32.222-97.212 18.023c-15.838 26.76-27.853 55.705-35.499 86.289 32.768 12.56 56.252 44.237 56.252 81.374 0 37.137-23.484 68.813-56.252 81.374 7.646 30.583 19.661 59.528 35.5 86.289 32.22-14.2 70.996-8.192 97.21 18.022 26.215 26.214 32.223 64.99 18.023 97.212 26.76 15.838 55.706 27.853 86.29 35.498 12.56-32.768 44.236-56.251 81.373-56.251 37.137 0 68.813 23.483 81.374 56.251 30.583-7.645 59.529-19.66 86.29-35.498-14.2-32.222-8.193-70.998 18.021-97.212 26.215-26.214 64.99-32.222 97.212-18.022 15.838-26.76 27.853-55.706 35.499-86.29-32.768-12.56-56.252-43.69-56.252-81.373z m-262.144 87.381c-48.06 0-87.381-39.322-87.381-87.381s39.321-87.382 87.381-87.382 87.381 39.322 87.381 87.382-39.321 87.381-87.38 87.381z m359.356-369.732h318.396v80.281H691.678z m0 323.31h318.396v80.282H691.678zM175.582 818.86h834.492v80.281H175.582z"
              p-id="1161"
              fill="#1991DD"
            ></path>
          </svg>
          <span class="el-dialog__title">{{title}}</span>
        </div>
      </template>
      <el-form :model="ruleForm" label-width="100px" center>
        <el-form-item label="取单量：" prop="getbill">
          <Select v-model="ruleForm.getbill" placeholder="请选择取单量">
            <Option label="10" value="10"></Option>
            <Option label="20" value="20"></Option>
            <Option label="50" value="50"></Option>
            <Option label="70" value="70"></Option>
            <Option label="100" value="100"></Option>
          </Select>
        </el-form-item>
        <el-form-item label="回传量：" prop="backbill">
          <Select v-model="ruleForm.backbill" placeholder="请选择回传量">
            <Option label="10" value="10"></Option>
            <Option label="20" value="20"></Option>
            <Option label="50" value="50"></Option>
            <Option label="70" value="70"></Option>
            <Option label="100" value="100"></Option>
          </Select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="numFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="setSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import infoMange from "@/dataJson/infoMange.json";
import {
  getScenelist, // 列表
  addscene, // 新增
  editscene, // 编辑
  deletescene, // 删除
  setbill, // 单量设置
} from "@/api/processMonitor";
import { changeStatus } from "@/api/user";
export default {
  data() {
    return {
      tableData: [],
      title: "",
      type: "",
      dialogFormVisible: false,
      numFormVisible: false,
      ruleForm: {
        describe: "",
        name: "",
        label: "",
        value: "",
        getbill: "",
        backbill: "",
        ip: "",
      },
      rules: {
        label: [{ required: true, message: "请选择标签" }],
        name: [{ required: true, message: "请输入姓名" }],
        ip: [{ required: true, message: "请输入ip" }],
        describe: [{ required: true, message: "请输入字段描述" }],
      },
      id: "",
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      formInline: {
        name: "",
      },
    };
  },
  created() {
    // this.tableData = infoMange.data;
    // return;
    this.query();
  },
  methods: {
    query() {
      let _this = this;
      let params = {
        name: _this.formInline.name || "",
        pageindex: _this.page.currentPage,
        pagesize: _this.page.size,
      };
      getScenelist(params).then((res) => {
        if (res.data.code == 0) {
          _this.tableData = res.data.data;
          _this.page.totalElement = res.data.totalcount;
        }
      });
    },
    handleClick(type, row) {
      this.type = type;
      this.id = row.id;
      this.title =
        type == "edit" ? "编辑" : type == "add" ? "添加机器人" : "单量设置";
      if (type == "sets") {
        this.numFormVisible = true;
      } else {
        this.dialogFormVisible = true;
      }
      if (type == "edit") {
        this.ruleForm = row;
      } else {
        this.ruleForm = {};
      }
    },
    handleOperat(status, sceneId) {
      changeStatus({ status, sceneId }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1200,
          });
          this.query();
        } else {
          _this.$message({
            message: res.data.msg,
            type: "error",
            duration: 1300,
          });
        }
      });
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
      this.currentChange(1);
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletescene(row.id).then((res) => {
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
    setSubmit() {
      const _this = this;
      let params = {
        id: this.id,
        getbill: this.ruleForm.getbill || "",
        backbill: this.ruleForm.backbill || "",
      };
      setbill(params).then((res) => {
        if (res.data.code == 0) {
          _this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1000,
          });
          _this.numFormVisible = false;
          this.numFormVisible = false;
          _this.query();
          this.query();
        } else {
          _this.$message({
            message: res.data.msg,
            type: "error",
            duration: 1300,
          });
        }
      });
    },
    submit(name) {
      let params = {
        id: this.type == "edit" ? this.id : "",
        name: this.ruleForm.name || "",
        label:
          this.ruleForm.label == "自定义"
            ? this.ruleForm.value
            : this.ruleForm.label || "",
        describe: this.ruleForm.describe || "",
        ip: this.ruleForm.ip || "",
      };
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.type == "add") {
            addscene(params).then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1500,
                });
                this.dialogFormVisible = false;
                this.query();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error",
                  duration: 1500,
                });
              }
            });
          } else if (this.type == "edit") {
            editscene(params).then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1500,
                });
                this.dialogFormVisible = false;
                this.query();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error",
                  duration: 1500,
                });
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
.tableList {
  margin-top: 20px;
}
.footBox{
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .totalBox{
    font-weight: 550;
  }
}
.paginationStyle {
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
}
.paginationStyle > .el-button {
  margin-right: 1rem;
}
/deep/.el-dialog {
  width: 38%;
}
/deep/.ivu-page-prev,
/deep/.ivu-page-next {
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
/deep/.ivu-page-prev a,
/deep/.ivu-page-next a {
  margin: 0 6px;
}
/deep/.ivu-page-item,
/deep/.ivu-page-item-jump-next {
  display: none;
}
/deep/.ivu-input {
  width: 100%;
}
</style>
