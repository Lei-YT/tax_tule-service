<template>
  <div class="wrapper">
    <!-- 上 -->
    <Card :bordered="false">
      <div slot="title" class="cardHead">
        <Icon type="ios-nuclear-outline" color="#fff" size="22" />
        <p>岗位信息</p>
      </div>
      <div class="searchCon">
        <div class="leftCon">
          <Input
            v-model="searchVal"
            icon="md-close"
            placeholder="请输入关键字查询"
            @on-click="clearCon"
            style="width: 250px; margin-right: 15px"
          />
          <Button type="primary" icon="ios-search">查询</Button>
        </div>
        <div class="rightCon">
          <Button type="error" v-if="postLength.length > 0" @click="handel('1')"
            >确认删除</Button
          >
          <Button type="primary" icon="md-trash" ghost v-else>删除岗位</Button>
          <Button
            type="primary"
            icon="md-add"
            @click="addPost('jobs')"
            style="margin-left: 15px"
            >添加岗位</Button
          >
        </div>
      </div>
      <el-table
        :data="tableData1"
        stripe
        border
        empty-text="暂无数据"
        @selection-change="handleJobsChange"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          fontWeight: 'normal',
          fontSize: '12px',
        }"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column prop="name" label="岗位名称" align="center" />
        <el-table-column prop="name" label="岗位编号" align="center" />
        <el-table-column prop="name" label="描述" align="center" />
        <el-table-column prop="address" label="创建时间" align="center" />
      </el-table>
      <div class="pageCon">
        <div class="showCon">显示 1-10 条，共 {{ page.totalElement }} 条</div>
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
    </Card>
    <!-- 下 -->
    <Card :bordered="false" style="margin-top: 15px">
      <div class="searchCon">
        <div class="leftCon">
          <Button
            type="primary"
            icon="md-add"
            @click="addPost('root')"
            style="margin-right: 15px"
            >添加授权</Button
          >
          <Button type="error" v-if="authorData.length > 0" @click="handel('2')"
            >删除授权</Button
          >
          <Button type="primary" icon="md-trash" ghost v-else>删除授权</Button>
        </div>
        <div class="rightCon">
          <Button type="primary" @click="submit">提交</Button>
        </div>
      </div>
      <el-table
        :data="tableData2"
        stripe
        border
        empty-text="暂无数据"
        @selection-change="handleAuthorChange"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          fontWeight: 'normal',
          fontSize: '12px',
        }"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column prop="name" label="权限名称" align="center" />
        <el-table-column prop="name" label="子权限" align="center" />
      </el-table>
    </Card>
    <!-- 添加添加机构 -->
    <el-dialog title="添加机构" :visible.sync="centerFormVisible" width="30%">
      <div class="centerCon">
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
    <!-- 删除授权/岗位弹框 -->
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
export default {
  components: {},
  data() {
    return {
      centerFormVisible: false,
      centerDialogVisible: false,
      delCon: "",
      searchVal: "",
      postLength: [],
      authorData: [],
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
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
      ],
    };
  },
  mounted() {},
  methods: {
    clearCon() {
      this.searchVal = "";
    },
    addUser() {
      this.centerDialogVisible = true;
    },
    submit() {},
    handleJobsChange(val) {
      this.postLength = val;
    },
    handleAuthorChange(val) {
      this.authorData = val;
    },
    addPost(type) {
      this.$router.push({
        name: "addWorks",
        params: {
          type,
        },
      });
    },
    handleImport(row) {
      this.centerDialogVisible = false;
    },
    handel(type) {
      if (type == 1) {
        this.delCon =
          "您是否要删除该岗位？ 可能存在配置为岗位的用户，将导致删除失败。";
      } else if (type == 2) {
        this.delCon = "您是否要删除该岗位的此项授权？";
      }
      this.centerDialogVisible = true;
    },
    sureDel() {},
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
  flex-direction: column;
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
.centerCon {
  display: flex;
  justify-content: flex-start;
  margin: 50px 0;
  p {
    margin-top: 5px;
  }
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