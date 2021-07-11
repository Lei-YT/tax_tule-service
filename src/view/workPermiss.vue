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
      </div>
    </Card>
    <!-- 下 -->
    <Card :bordered="false" style="" class="ghostHeader">
      <p slot="title" style="font-size: 16px" >权限配置</p>
      <Button slot="extra" type="primary" @click="onSubPower" v-if="hasPerm('station_operate')">提交</Button>
      <Collapse v-model="openPanel" simple>
        <Panel name="菜单权限">
          菜单权限
          <Tree
            slot="content"
            :data="allPower"
            show-checkbox
            check-directly
            multiple
            @on-check-change="onCheckPower"
          ></Tree>
        </Panel>
      </Collapse>
    </Card>
  </div>
</template>

<script>
import {
  getStation, // 岗位列表
  getStationPower,
  editStation,
  deleteStation,
  deleteStationPower,
} from "@/api/mangeUser";
export default {
  components: {},
  data() {
    return {
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
      allPower: [],
      selectedPower: [],
      openPanel: ["菜单权限"],
    };
  },
  created() {
    this.query();
  },
  methods: {
    parseTree(obj) {
      const _this = this;
      const o = { ...obj };
      o.title = o.name;
      o.checked = Number(o.stationpowers_count) === 1;
      o.disabled = !_this.hasPerm('station_operate');
      o.expand = true;
      if (o.powerchilds)
        o.children = o.powerchilds.map((ch) => _this.parseTree(ch));
      return o;
    },
    onCheckPower(selected, current) {
      this.selectedPower = selected;
    },
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
          _this.allPower = [];
          _this.selectedPower = [];
        } else {
          _this.$Notice.warning({
            title: "温馨提示",
            desc: data.msg,
          });
        }
      });
    },
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
            _this.$message({
              message: `${data.msg}`,
              type: "success",
              duration: 1500,
            });
            _this.query();
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
          // stationId: _this.currentJob.id,
        },
      });
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
      }
      return false;
    },
    getStationPowerList(job) {
      if (
        job === null ||
        Object.keys(job).length === 0
      ) {
        return false;
      }
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
            const reducePower = data.data.reduce((acc, cv, ci) => {
              cv.powerchilds.map((c) => {
                c.pName = cv.name;
                return c;
              });
              return acc.concat(cv.powerchilds);
            }, []);
            const selectedRoot = data.data.filter(r => Number(r.stationpowers_count)===1);
            const selectedChild = reducePower.filter(r => Number(r.stationpowers_count)===1);
            _this.selectedPower = selectedRoot.concat(selectedChild);
            const allPower = data.data.map((p) => _this.parseTree(p));
            _this.allPower = [
              { title: "全选", children: allPower, expand: true,
                disabled: !_this.hasPerm('station_operate'),
              },
            ];
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
    onSubPower() {
      const _this = this;
      const r = {
        stationId: this.currentJob.id,
        powerIdArr: this.selectedPower.map((e) => e.id),
      };
      if (
        this.currentJob === null ||
        Object.keys(this.currentJob).length === 0
      ) {
        _this.$Notice.warning({
          title: "请先选中一个岗位",
        });
        return false;
      }
      if (this.selectedPower.length === 0) {
        this.$Modal.confirm({
          title: "注意",
          content: "<p>未勾选任何权限</p><p>点击确认将删除该岗位的所有权限</p>",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            r.powerIdArr = [];
            _this.subModifyPower(r);
          },
          onCancel: () => {
            _this.$Message.info("操作已取消");
          },
        });
        return false;
      } else {
        _this.subModifyPower(r);
      }
    },
    subModifyPower(r) {
      const _this = this;
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      editStation(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.$message({
              message: `${data.msg}`, // ${data.message}
              type: "success",
              duration: 1500,
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
/deep/.ghostHeader {
  margin-top: 15px;
  .ivu-card-head {
    background: #fff;
    p {
      color: #515a6e;
    }
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
/deep/.el-table--striped
  .el-table__body
  tr.el-table__row--striped.current-row
  td {
  background-color: #b2e2fa;
}
</style>
