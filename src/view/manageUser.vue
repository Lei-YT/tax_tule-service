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
        <Tree :data="TreeData" @on-select-change="onTreeNodeClick" />
      </div>
    </Card>
    <!-- 右 -->
    <div class="rightCon" v-if="!addPostCon" style="width: 74%">
      <!-- 上 -->
      <Card :bordered="false">
        <div slot="title" class="cardHead">
          <Icon type="ios-contact-outline" color="#fff" size="22" />
          <p>用户信息</p>
        </div>
        <div class="userTables" v-if="!isCustom">
          <div class="searchWarp">
            <div class="leftWrap">
              <Input v-model="searchName" placeholder="请输入关键字查询" />
              <Button
                type="primary"
                @click="searchData()"
                icon="ios-search"
                style="margin-left: 15px"
                >查询</Button
              >
            </div>
            <div class="rigthWrap">
              <Button
                type="error"
                v-if="chooseLength.length > 0"
                @click="handel('1')"
                >确认删除</Button
              >
              <Button type="error" icon="md-trash" ghost v-else
                >删除用户</Button
              >
              <Button
                type="primary"
                icon="ios-ionic-outline"
                style="margin: 0 15px"
                >启用</Button
              >
              <Button type="primary" icon="md-add" @click="addUser"
                >添加用户</Button
              >
            </div>
          </div>
          <el-table
            :data="tableData1"
            stripe
            border
            @selection-change="handleSelectionChange"
            empty-text="暂无数据"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              fontWeight: 'normal',
              fontSize: '12px',
            }"
            style="margin-top: 15px"
          >
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60"
            />
            <el-table-column prop="name" label="姓名" align="center" />
            <el-table-column prop="adminNo" label="账号" align="center" />
            <el-table-column prop="organ" label="所属机构" align="center" />
            <el-table-column label="用户状态" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.isEnable == 1"
                  type="text"
                  size="small"
                  @click="changeStatus(scope.row)"
                  >启用</el-button
                >
                <el-button
                  v-else
                  type="text"
                  size="small"
                  style="color: #e02020"
                  @click="handel('3', scope.row)"
                  >禁用</el-button
                >
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column
              prop="created_at"
              label="创建时间"
              align="center"
              width="160"
            />
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
        <div v-if="isCustom">
          <span>自定义添加</span>
          <el-divider />
          <Form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :label-width="80"
            class="demo-ruleForm"
          >
            <el-col :span="12">
              <FormItem label="账号" prop="account">
                <Input v-model="ruleForm.account" placeholder="请输入账号" />
              </FormItem>
              <FormItem label="手机号" prop="phone">
                <Input v-model="ruleForm.phone" placeholder="请输入手机号" />
              </FormItem>
            </el-col>
            <el-col :span="12">
              <FormItem label="姓名" prop="name">
                <Input v-model="ruleForm.name" placeholder="请输入姓名" />
              </FormItem>
              <FormItem label="邮箱" prop="email">
                <Input v-model="ruleForm.email" placeholder="请输入邮箱" />
              </FormItem>
            </el-col>
          </Form>
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
      <!-- 下 -->
      <Card :bordered="false" style="margin-top: 15px" class="ghostHeader">
        <div slot="title" class="cardHeads">
          <div class="leftCon">
            <Button
              type="primary"
              icon="md-add"
              @click="addPost"
              style="margin-right: 15px"
              >添加岗位</Button
            >
            <Button
              type="error"
              v-if="postLength.length > 0"
              @click="handel('2')"
              >确认删除</Button
            >
            <Button type="error" icon="md-trash" ghost v-else
              >删除岗位</Button
            >
          </div>
          <div class="subCon">
            <Button type="primary">提交</Button>
          </div>
        </div>
        <el-table
          :data="tableData2"
          stripe
          border
          height="290"
          @selection-change="handlePostChange"
          empty-text="暂无数据"
          :header-cell-style="{
            background: '#eef1f6',
            color: '#606266',
            fontWeight: 'normal',
            fontSize: '12px',
            marginTop: '10px',
          }"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="name" label="所属机构" align="center" />
          <el-table-column prop="address" label="岗位" align="center" />
        </el-table>
      </Card>
    </div>

    <div class="rightCons" v-if="addPostCon" style="width: 74%">
      <Card :bordered="false">
        <div slot="title" class="cardHead">
          <Icon type="ios-contact-outline" color="#fff" size="22" />
          <p>用户信息</p>
        </div>
        <div>
          <span>岗位信息</span>
          <el-divider />
          <div class="postSearch">
            <Input
              v-model="searchVal"
              placeholder="请输入岗位关键字"
              style="width: 250px"
            />
            <Button type="primary" icon="ios-search" style="margin-left: 15px"
              >查询</Button
            >
          </div>
          <el-table
            :data="postTableData"
            stripe
            border
            @selection-change="postSelected"
            empty-text="暂无数据"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              fontWeight: 'normal',
              fontSize: '12px',
            }"
            style="margin-top: 15px"
          >
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="name" label="岗位名称" align="center" />
            <el-table-column prop="name" label="岗位编号" align="center" />
          </el-table>
          <div class="choosedCon">
            <div>已选机构和岗位：</div>
            <div class="mechanism">
              <p>4454</p>
              <p>4454</p>
              <p>4454</p>
            </div>
            <div class="postName">
              <p>1111</p>
              <p>22222222222</p>
            </div>
          </div>
          <div class="footers">
            <Button type="primary" ghost @click="addPostCon = false"
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

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogTableVisible">
      <div class="userBox">
        用户：<Input
          v-model="userName"
          placeholder="请输入用户账号或者姓名"
          style="width: 55%"
        />
        <Button type="primary" icon="ios-search" />
        <Button type="primary" @click="handleCustom">自定义添加 》</Button>
      </div>
      <el-table
        :data="gridData"
        stripe
        border
        empty-text="暂无数据"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          fontWeight: 'normal',
          fontSize: '12px',
        }"
      >
        <el-table-column property="UserName" label="姓名" align="center" />
        <el-table-column property="UserCode" label="账号" align="center" />
        <el-table-column property="organ" label="所属机构" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleImport(scope.row)" type="text" size="small"
              >导入</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 删除用户/岗位弹框 -->
    <el-dialog title="确认提示" :visible.sync="centerDialogVisible" width="30%">
      <span style="display: flex; justify-content: center; margin: 50px 0">{{
        delCon
      }}</span>
      <span slot="footer" class="dialog-footer">
        <Button type="primary" @click="centerDialogVisible = false" ghost
          >取 消</Button
        >
        <Button type="primary" @click="sureDel" style="margin-left: 20px"
          >确 定</Button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList, // 账号列表
  addUser, // 新增
  getAddlist, // 添加导入用户查询接口
  delUsers, // 删除账号
  enableUser,
  importAddUser,
  getOrganUserList, // 机构用户列表
  getOrganList, // 机构列表
} from "@/api/mangeUser";
export default {
  components: {},
  data() {
    return {
      searchName: "",
      addPostCon: false,
      delCon: "",
      delType: "",
      centerDialogVisible: false,
      chooseLength: [],
      idArr: [],
      postLength: [],
      isCustom: false,
      dialogTableVisible: false,
      searchVal: "",
      userName: "",
      choosedList: [],
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
      tableData1: [],
      tableData2: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区",
        },
      ],
      gridData: [],
      postTableData: [
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区",
        },
      ],
      ruleForm: {
        name: "",
        account: "",
        phone: "",
        email: "",
      },
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        account: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      userInfo: null,
    };
  },
  created() {
    this.query();
    this.getList();
  },
  methods: {
    getTreeData(){
      const r = {
        org_code: '',
        org_name: this.searchOrgan
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getOrganList(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.TreeData = data.data;
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
      this.addPostCon = false;
      this.isCustom = false;
      console.log(currentTree, currentNode);
      const _this = this;
      const r = {
        pageindex: this.page.currentPage,
        pagesize: this.page.size,
        organ: currentNode.id,
      };
      getOrganUserList(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.tableData1 = data.data;
            _this.page.totalElement = data.totalcount;
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
    getList() {
      let params = {
        userName: this.userName.replace(/\s*/g, "") || "",
      };
      getAddlist(params).then((res) => {
        if (res.data.code == 20000) {
          this.gridData = res.data.data.list;
        }
      });
    },
    query() {
      let params = {
        name: this.searchName.replace(/\s*/g, "") || "",
        pageindex: this.page.currentPage,
        pagesize: this.page.size,
      };
      getUserList(params).then((res) => {
        if (res.data.code == 0) {
          this.tableData1 = res.data.data;
          this.page.totalElement = res.data.totalcount;
        }
      });
    },
    // 确认删除
    sureDel() {
      // 禁用账户
      if (this.delType == 3) {
        enableUser(this.userInfo)
          .then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success",
                duration: 1200,
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: res.data.msg,
            });
          });
      } else if (this.delType == 1) {
        // 删除该用户
        delUsers(this.idArr)
          .then((res) => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success",
                duration: 1200,
              });
              this.query();
            }
          })
          .catch((err) => {
            this.$message({
              type: "info",
              message: err,
            });
          });
      }
      this.centerDialogVisible = false;
    },
    handel(type, row) {
      this.userInfo = row;
      this.delType = type;
      if (type == 1) {
        this.delCon = "您是否要删除该用户？";
      } else if (type == 2) {
        this.delCon = "您是否要删除该岗位？";
      } else if (type == 3) {
        this.delCon = "您是否要禁用该用户？";
      }
      this.centerDialogVisible = true;
    },
    handlePostChange(val) {
      this.postLength = val;
    },
    handleSelectionChange(val) {
      this.chooseLength = val;
      let idArr = [];
      val.map((item, index) => {
        return idArr.push(item.id);
      });
      this.idArr = idArr;
    },
    submitForm(formName) {
      let params = {
        name: this.ruleForm.name.replace(/\s*/g, "") || "",
        account: this.ruleForm.account.replace(/\s*/g, "") || "",
        phone: this.ruleForm.phone || "",
        email: this.ruleForm.email || "",
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
        } else {
          return false;
        }
      });
    },
    postSelected(val) {
      console.log(val, "444444444444");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isCustom = false;
    },
    clearCon() {
      this.searchVal = "";
    },
    changeStatus(row) {},
    addUser() {
      this.dialogTableVisible = true;
    },
    addPost() {
      this.addPostCon = true;
    },
    handleImport(row) {
      importAddUser(row).then((res) => {
        console.log(res,'导入添加');
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1500,
          });
          this.query();
        }
      });
    },
    handleCustom() {
      this.dialogTableVisible = false;
      this.isCustom = true;
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.query();
    },
    sizeChange(size) {
      this.page.size = size;
      this.currentChange(1);
      this.query();
    },
    searchData() {
      this.page.currentPage = 1;
      this.query();
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

.treeCon {
  margin-top: 17px;
}
.rightCon {
  /deep/.ivu-card:last-child {
    /deep/.ivu-card-head {
      background: #fff;
    }
  }
}
/deep/.ghostHeader .ivu-card-head {
  background: #fff;
}
.cardHeads,
.searchWarp,
.pageCon {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.leftWrap,
.postSearch {
  display: flex;
}
.pageCon {
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
.userBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
}
.footers {
  display: flex;
  justify-content: center;
  margin-top: 200px;
}
.choosedCon {
  display: flex;
  margin-top: 15px;
  justify-content: flex-start;
}
.postName {
  margin-left: 15px;
}
</style>
