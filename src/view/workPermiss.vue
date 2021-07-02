<template>
  <div class="wrapper">
    <!-- 上 -->
    <Card :bordered="false">
      <div slot="title" class="cardHead">
        <Icon type="ios-nuclear-outline" color="#fff" size="22" />
        <p>岗位信息</p>
      </div>
      <div class="searchCon">
        <div class="leftCon" v-if="hasPerm('station_search')">
          <Input
            v-model="searchVal"
            placeholder="请输入关键字查询"
            style="width: 250px; margin-right: 15px"
          />
          <Button type="primary" icon="ios-search" @click="searchData()"
            >查询</Button
          >
        </div>
        <div class="rightCon" v-if="hasPerm('station_operate')">
          <Button type="error" v-if="postLength.length > 0" @click="handel('1')"
            >确认删除</Button
          >
          <Button type="error" icon="md-trash" ghost v-else>删除岗位</Button>
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
        highlight-current-row
        @current-change="onJobsClick"
        @selection-change="handleJobsChange"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          fontWeight: 'normal',
          fontSize: '12px',
        }"
      >
        <el-table-column type="selection" align="center" width="55" v-if="hasPerm('station_operate')" />
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column prop="name" label="岗位名称" align="center" />
        <el-table-column prop="number" label="岗位编号" align="center" />
        <el-table-column prop="describe" label="描述" align="center" />
        <el-table-column prop="created_at" label="创建时间" align="center" />
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
        <div class="leftCon" v-if="hasPerm('station_operate')">
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
          <Button type="error" icon="md-trash" ghost v-else>删除授权</Button>
        </div>
        <!-- <div class="rightCon">
          <Button type="primary" @click="submit">提交</Button>
        </div> -->
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
        <el-table-column type="selection" align="center" width="55" v-if="hasPerm('station_operate')" />
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
import {
  getStation, // 岗位列表
  getStationPower,
  deleteStation,
  deleteStationPower,
} from "@/api/mangeUser";
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
      tableData1: [],
      currentJob: {},
      tableData2: [],
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      const _this = this;
      let params = {
        name: this.searchVal.replace(/\s*/g, "") || "",
        pageindex: this.page.currentPage,
        pagesize: this.page.size,
      };
      getStation(params).then((res) => {
        if (res.data.code == 0) {
          _this.tableData1 = res.data.data;
          _this.page.totalElement = res.data.totalcount;
          _this.currentJob = {};
        } else {
          _this.$Notice.warning({
            title: "温馨提示",
            desc: data.message,
          });
        }
      });
    },
    addUser() {
      this.centerDialogVisible = true;
    },
    submit() {},
    onJobsClick(currentJob) {
      this.currentJob = currentJob;
      this.getStationPowerList(currentJob);
    },
    handleJobsChange(val) {
      this.postLength = val;
    },
    deleteJobs(selectJobs) {
      const _this = this;
      if (selectJobs.length === 0) {
        _this.$Notice.warning({
          title: "请勾选需要删除的岗位",
        });
        return false;
      }
      const r = selectJobs.map((row) => row.id);
      deleteStation(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.$Notice.success({
              title: data.message,
              desc: data.data.info,
            });
            _this.query();
            _this.tableData2 = [];
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.message,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleAuthorChange(val) {
      this.authorData = val;
    },
    deletePower(selectedPower) {
      const _this = this;
      if (selectedPower.length === 0) {
        _this.$Notice.warning({
          title: "请勾选需要删除的授权",
        });
        return false;
      }
      const r = {
        stationId: this.currentJob.id,
        delpowerIdArr: selectedPower.map((row) => row.id),
      };
      deleteStationPower(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.$Notice.success({
              title: data.message,
              desc: data.msg,
            });
            _this.getStationPowerList(_this.currentJob);
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
    addPost(type) {
      const _this = this;
      if (
        type === "root" &&
        (this.currentJob === null || Object.keys(this.currentJob).length === 0)
      ) {
        _this.$Notice.warning({
          title: "请先选中一个岗位",
        });
        return false;
      }
      this.$router.push({
        name: "addWorks",
        params: {
          type,
          stationId: _this.currentJob.id,
        },
      });
    },
    handleImport(row) {
      this.centerDialogVisible = false;
    },
    handel(type) {
      const _this = this;
      if (type === "1") {
        this.$Modal.confirm({
          title: "确认",
          content:
            "您是否要删除该岗位？ 可能存在配置为岗位的用户，将导致删除失败。",
          onOk: () => {
            _this.deleteJobs(_this.postLength);
          },
          onCancel: () => {
            // _this.$Message.info("取消");
          },
        });
      } else if (type === "2") {
        this.$Modal.confirm({
          title: "确认",
          content: "您是否要删除该岗位的此项授权？",
          onOk: () => {
            _this.deletePower(_this.authorData);
          },
          onCancel: () => {
            // _this.$Message.info("取消");
          },
        });
      }
      return false;
    },
    sureDel() {},
    getStationPowerList(job) {
      const _this = this;
      const r = {
        station_id: job.id,
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getStationPower(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.tableData2 = data.data;
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
    currentChange(current) {
      this.page.currentPage = current;
      this.query();
    },
    sizeChange(size) {
      this.page.size = size;
      this.currentChange(1);
    },
    searchData() {
      this.currentChange(1);
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
/deep/.el-table__body tr.current-row > td,
/deep/.el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
  background-color: #b2e2fa;
}
</style>
