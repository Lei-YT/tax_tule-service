<template>
  <div class="wraps">
    <div id="list">
      <Card style="width: 100%">
        <div style="display: flex; justify-content: space-between">
          <Form
            :inline="true"
            :model="formInline"
            :label-width="120"
            class="demo-form-inline"
            ref="formInline"
          >
            <FormItem label="机器人名称或标签：" prop="name">
              <Input v-model="formInline.name" placeholder="请输入" />
            </FormItem>
            <FormItem>
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
                  v-if="scope.row.scene_info && scope.row.scene_info.status == 1"
                  >启动</el-button
                >
                <el-button
                  @click="handleOperat(2, scope.row.id)"
                  type="text"
                  size="small"
                  v-if="scope.row.scene_info && scope.row.scene_info.status == 3"
                  >继续</el-button
                >
                <el-button
                  @click="handleOperat(4, scope.row.id)"
                  type="text"
                  size="small"
                  v-if="scope.row.scene_info && [3,4].includes(scope.row.scene_info.status)"
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
                  v-if="scope.row.scene_info && scope.row.scene_info.status == 2"
                  >暂停</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.scene_info && scope.row.scene_info.status == 5"
                  @click="
                    handleOperat(scope.row.scene_info.status || null, scope.row.id)
                  "
                  >需人工处理</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
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
      </Card>
    </div>
    <!-- 编辑列表资料弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 单量设置弹框 -->
    <el-dialog :title="title" :visible.sync="numFormVisible">
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
        <el-button @click="numFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setSubmit()">确 定</el-button>
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
      },
      rules: {
        label: [{ required: true, message: "请选择标签" }],
        name: [{ required: true, message: "请填写姓名" }],
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
    // this.tableData=infoMange.data
    // return
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
        console.log(res.data, "111111111111111");
        if (res.data.code == 0) {
          _this.tableData = res.data.data;
          console.log(_this.tableData, "............");
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
    handleOperat(status, id) {
      changeStatus({ status, id }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1200,
          });
          this.query();
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
      this.query();
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
      let params = {
        id: this.id,
        getbill: this.ruleForm.getbill || "",
        backbill: this.ruleForm.backbill || "",
      };
      setbill(params).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1300,
          });
          this.query();
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
                  type: "success",
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
                  type: "success",
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
.paginationStyle {
  display: flex;
  justify-content: flex-end;
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
</style>
