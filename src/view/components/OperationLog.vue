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
            <FormItem label="机器人名称：" prop="sceneName">
              <Input v-model="formInline.sceneName" placeholder="请输入" />
            </FormItem>
            <FormItem label="操作人：" prop="operate">
              <Input v-model="formInline.operate" placeholder="请输入" />
            </FormItem>
            <FormItem label="起始时间：" prop="beginTime">
              <div class="numCount">
                <Date-picker
                  placeholder="选择日期"
                  style="width: 160px"
                  type="date"
                  :value="formInline.beginTime"
                  format="yyyy-MM-dd"
                  @on-change="formInline.beginTime = $event"
                >
                </Date-picker>
                <span style="margin: 0 10px">——</span>
                <Date-picker
                  placeholder="选择日期"
                  style="width: 160px"
                  type="date"
                  :value="formInline.endTime"
                  format="yyyy-MM-dd"
                  @on-change="formInline.endTime = $event"
                >
                </Date-picker>
              </div>
            </FormItem>

            <FormItem :label-width="0">
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
              prop="scene.name"
              label="机器人名称"
              align="center"
            />
            <el-table-column prop="record" label="操作事件" align="center" />
            <el-table-column
              prop="created_at"
              label="操作时间"
              align="center"
              sortable
            />
            <el-table-column prop="username" label="操作人" align="center" />
            <el-table-column prop="stationName" label="身份" align="center" />
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
  </div>
</template>
<script>
import logslist from "@/dataJson/logslist.json";
import { getLogslist } from "@/api/processMonitor";
export default {
  data() {
    return {
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      formInline: {
        sceneName: "",
        operate: "",
        beginTime: "",
        endTime: "",
        sort: null,
      },
      tableData: [],
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      let params = {
        sceneId: "",
        sceneName: this.formInline.sceneName || "",
        operate: this.formInline.operate || "",
        beginTime: this.formInline.beginTime || "",
        endTime: this.formInline.endTime || "",
        sort: this.formInline.sort || "",
        pageindex: this.page.currentPage,
        pagesize: this.page.size,
      };
      getLogslist(params).then((res) => {
        if (res.data.code == 0) {
          this.tableData = res.data.data;
          this.page.totalElement = res.data.totalcount;
        }
      });
    },
    sortChange(val) {
      var order = "";
      if (val.order == "ascending") {
        order = 1;
      } else if (val.order == "descending") {
        order = 2;
      }
      // this.formInline.sort = "";
      if (val.prop == "created_at") {
        this.formInline.sort = order;
      }
      this.query();
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
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.tableList {
  margin-top: 20px;
}
.footBox {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .totalBox {
    font-weight: 550;
  }
}
.numCount {
  display: flex;
}
.paginationStyle {
  display: flex;
  margin-top: 0;
  justify-content: flex-end;
}
.paginationStyle > .el-button {
  margin-right: 1rem;
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
