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
          v-model="searchOrgan"
          icon="md-close"
          placeholder="请输入机构关键字"
          @on-click="clearCon"
          style="width: 83%"
        />
        <Button type="primary" icon="ios-search" @click="getTreeData" />
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
              <Input v-model="searchUser" placeholder="请输入关键字查询" />
              <Button type="primary" icon="ios-search" style="margin-left: 15px" @click="usernameSearch"
                >查询</Button
              >
            </div>
            <div class="rigthWrap">
              <Button type="error" v-if="chooseLength > 0" @click="handel('1')"
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
            @row-click="onUserRowClick"
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
                  v-if="scope.row.result == 0"
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
            <el-table-column prop="created_at" label="创建时间" align="center" />
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
              <FormItem label="账号" prop="name">
                <Input v-model="ruleForm.name" placeholder="请输入账号" />
              </FormItem>
              <FormItem label="手机号" prop="name">
                <Input v-model="ruleForm.name" placeholder="请输入手机号" />
              </FormItem>
            </el-col>
            <el-col :span="12">
              <FormItem label="姓名" prop="name">
                <Input v-model="ruleForm.name" placeholder="请输入姓名" />
              </FormItem>
              <FormItem label="邮箱" prop="name">
                <Input v-model="ruleForm.name" placeholder="请输入邮箱" />
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
            <Button type="error" v-if="postLength > 0" @click="handel('2')"
              >确认删除</Button
            >
            <Button type="error" icon="md-trash" ghost v-else>删除岗位</Button>
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
              v-model="searchPost"
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
          v-model="userVal"
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
        <el-table-column property="name" label="姓名" align="center" />
        <el-table-column property="date" label="账号" align="center" />
        <el-table-column property="name" label="所属机构" align="center" />
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
import { getOrganList, getOrganUserList, getUserList } from "./../api/user";
export default {
  components: {},
  data() {
    return {
      addPostCon: false,
      delCon: "",
      delType: "",
      centerDialogVisible: false,
      chooseLength: 0,
      postLength: 0,
      isCustom: false,
      dialogTableVisible: false,
      searchVal: "",
      searchOrgan: "",
      searchUser: "",
      searchPost: "",
      userVal: "",
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
      gridData: [
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
      ],
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
        region: "",
        date1: "",
        date2: "",
      },
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        region: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
    };
  },
  computed: {},
  mounted() {
    this.getTreeData();
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
    usernameSearch(){
      const _this = this;
      const r = {
        pageindex: this.page.currentPage,
        pagesize: this.page.size,
        name: this.searchUser,
      };
      getUserList(r)
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
    onUserRowClick(row){
      console.log('on row click', row)
    },
    // 确认删除
    sureDel() {
      this.centerDialogVisible = false;
    },
    handel(type, row) {
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
      this.postLength = val.length;
    },
    handleSelectionChange(val) {
      this.chooseLength = val.length;
      console.log(val, "++++++++++");
      //   let idArr = [];
      //   val.map((item, index) => {
      //     return idArr.push(item.id);
      //   });
      //   this.idArr = idArr;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
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
      // this.searchVal = "";
      this.searchOrgan = "";
    },
    changeStatus(row) {
      console.log(row, "++++++");
    },
    addUser() {
      this.dialogTableVisible = true;
    },
    addPost() {
      this.addPostCon = true;
    },
    handleImport(row) {},
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
      // this.query();
    },
    // open(index) {
    //   this.items[index]["open"] = !this.items[index]["open"];
    //   this.$forceUpdate();
    // },
    // open02(index, ii) {
    //   this.items[index]["result"][ii]["open"] = !this.items[index]["result"][
    //     ii
    //   ]["open"];
    //   this.$forceUpdate();
    // },
    // openAll(index) {
    //   let data = this.items[index];
    //   data.open = true;
    //   if (data.result && data.result.length) {
    //     for (let i = 0; i < data.result.length; i++) {
    //       data.result[i].open = true;
    //     }
    //   }
    //   this.$forceUpdate();
    // },
    // rowClick(item) {
    //   if (item.imageData && item.imageData.length) {
    //     let ids = item.imageData.map((item) => {
    //       return item.imageId;
    //     });
    //     this.$emit("row-click", ids);
    //   }
    // },
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
/deep/.ghostHeader .ivu-card-head {
  background: #fff;
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
