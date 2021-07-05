<template>
  <div class="wraps">
    <div id="list">
      <Card style="width: 100%">
        <Form
          :inline="true"
          :label-width="70"
          class="flow-form-inline"
          ref="formInline"
        >
          <div v-if="hasPerm('proce_search')">
            <FormItem label="表单名称" prop="formName">
              <Input v-model="formName" placeholder="请输入表单名称" />
            </FormItem>
            <FormItem label="创建日期:" prop="beginDate">
              <div class="numCount">
                <Date-picker
                  placeholder="选择日期"
                  type="date"
                  size="large"
                  style="width: '150px'"
                  :options="disabledDate1"
                  :value="beginDate"
                  format="yyyy-MM-dd"
                  @on-change="handleDatepicker($event, 'beginDate')"
                >
                </Date-picker>
                <span style="margin: 0 5px">—</span>
                <Date-picker
                  placeholder="选择日期"
                  type="date"
                  size="large"
                  :options="disabledDate2"
                  :value="endDate"
                  format="yyyy-MM-dd"
                  @on-change="handleDatepicker($event, 'endDate')"
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
                @click="handleReset()"
                style="margin-left: 15px"
                icon="el-icon-refresh-left"
                size="small"
                >重置</el-button
              >
            </FormItem>
          </div>
          <FormItem :label-width="0" class="flow-form-action" v-if="hasPerm('proce_operate')">
            <el-button
              @click="deleteSelected"
              type="danger"
              icon="el-icon-delete"
              size="small"
              >删除</el-button
            >
            <el-button
              @click="showAddModal = true"
              type="primary"
              icon="el-icon-plus"
              size="small"
              >添加表单</el-button
            >
          </FormItem>
        </Form>
        <div class="tableList">
          <el-table
            ref="formFlowTable"
            :data="tableData"
            border
            stripe
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{ background: '#eef1f6' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="hasPerm('proce_operate')"
              type="selection"
              width="40"
              fixed="left"
            ></el-table-column>
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            />
            <el-table-column
              prop="form_name"
              label="表单"
              align="center"
              width="150"
            />
            <el-table-column label="节点选择" align="center" width="280">
              <template slot-scope="scope">
                <Select v-if="hasPerm('proce_operate')"
                  transfer
                  multiple
                  v-model="scope.row.node_share"
                  @on-select="(v) => handleSelectNode(scope.row, v)"
                >
                  <Option
                    :value="2"
                    key="2"
                    :disabled="!scope.row.node_share.includes(1)"
                    >业务审批节点</Option
                  >
                  <Option
                    :value="1"
                    key="1"
                    :disabled="scope.row.node_share.includes(2)"
                    >共享中心审批节点</Option
                  >
                </Select>
                <div v-else>
                {{ scope.row.node_share.includes(2) ? "共享中心审批节点" : ''}}
                <Divider v-if="scope.row.node_share.length > 1" type="vertical"/>
                {{ scope.row.node_share.includes(1) ? "业务审批节点" : ''}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="业务审批节点模式"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <template v-if="hasPerm('proce_operate')">
                <Select
                  transfer
                  v-if="scope.row.node_share.includes(NODE_SHARE_BIZ)"
                  v-model="scope.row.biz_mode"
                  @on-change="(v) => handleSelectBizMode(scope.row, v)"
                >
                  <Option :value="MODE_SINGLE">单通过模式</Option>
                  <Option :value="MODE_MULTI">通过、驳回、转人工模式</Option>
                </Select>
              </template>
                <div v-else>
                {{ scope.row.biz_mode===MODE_SINGLE ? "单通过模式" : ''}}
                {{ scope.row.biz_mode===MODE_MULTI ? "通过、驳回、转人工模式" : ''}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="共享中心审批节点模式"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <template v-if="hasPerm('proce_operate')">
                <Select
                  transfer
                  v-if="scope.row.node_share.includes(NODE_SHARE_ONLY)"
                  v-model="scope.row.share_mode"
                  @on-change="(v) => handleSelectShareMode(scope.row, v)"
                >
                  <Option :value="MODE_SINGLE">单通过模式</Option>
                  <Option :value="MODE_MULTI">通过、驳回、转人工模式</Option>
                </Select>
              </template>
                <div v-else>
                {{ scope.row.share_mode===MODE_SINGLE ? "单通过模式" : ''}}
                {{ scope.row.share_mode===MODE_MULTI ? "通过、驳回、转人工模式" : ''}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="create_date_text"
              label="创建时间"
              width="160"
              align="center"
            />
            <el-table-column
              prop="update_date_text"
              label="修改时间"
              width="160"
              align="center"
            />
          </el-table>
        </div>
        <div class="footBox">
          <div class="totalBox">合计：{{ tableData.length }}条</div>
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
    <el-dialog title="添加表单" :visible.sync="showAddModal">
      <el-form
        ref="addformflowf"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        center
      >
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="addForm.formName" placeholder="请输入表单名称" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取 消</el-button>
        <el-button type="primary" @click="addFormFlow()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const _NODE_SHARE_ONLY = 1;
const _NODE_SHARE_BIZ = 2;
const MODE_SINGLE = 1;
const MODE_MULTI = 2;
import {
  getFormProcess,
  deleteFormProcess,
  updateFormProcess,
  addFormProcess,
} from "@/api/processMonitor";
export default {
  data() {
    return {
      NODE_SHARE_ONLY: _NODE_SHARE_ONLY,
      NODE_SHARE_BIZ: _NODE_SHARE_BIZ,
      MODE_SINGLE: MODE_SINGLE,
      MODE_MULTI: MODE_MULTI,
      tableData: [],
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      beginDate: "",
      endDate: "",
      disabledDate1: {},
      disabledDate2: {},
      formName: "",
      selectedRow: [],
      showAddModal: false,
      addForm: { formName: "" },
      addFormRules: {
        formName: [{ required: true, message: "请输入表单名称" }],
      },
    };
  },
  mounted() {
    this.selectedRow = [];
    this.searchData();
  },
  methods: {
    handleReset() {
      this.beginDate = "";
      this.endDate = "";
      this.formName = "";
    },
    handleDatepicker(dateValue, dataKey) {
      this.$set(this, dataKey, dateValue);
      this.status = "";
      const bb = new Date();
      bb.setFullYear(bb.getFullYear() - 1);
      let lastyear = bb;
      let today = new Date();

      let begindate = new Date(this.beginDate);
      let enddate = new Date(this.endDate);
      this.disabledDate1 = {
        disabledDate(date) {
          return (
            (date && date.valueOf() <= lastyear) ||
            (date && date.valueOf() >= enddate)
          );
        },
      };
      this.disabledDate2 = {
        disabledDate(date) {
          return (
            (date && date.valueOf() <= begindate) ||
            (date && date.valueOf() >= today)
          );
        },
      };
    },
    searchData() {
      this.page.currentPage = 1;
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
    query(id) {
      const _this = this;
      const r = {
        id: id,
        formName: this.formName,
        beginDate: this.beginDate,
        endDate: this.endDate,
        pageSize: this.page.size,
        currentPage: this.page.currentPage
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getFormProcess(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            data.data.list = data.data.list.map((row) => {
              row = Object.assign(
                _this.convertStatusToSelection(row.status),
                row
              );
              row.create_date_text = String(row.create_date).substring(0, String(row.create_date).indexOf('.000')).replace('T', ' ');
              row.update_date_text = String(row.update_date).substring(0, String(row.update_date).indexOf('.000')).replace('T', ' ');
              return row;
            });
            _this.tableData = data.data.list;
            _this.totalElement = data.data.sum;
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
    addFormFlow() {
      const _this = this;
      const params = {
        formName: this.addForm.formName.replace(/\s*/g, "") || "",
      };
      this.$refs.addformflowf.validate((valid) => {
        if (valid) {
          addFormProcess(params)
            .then((resp) => {
              let data = resp.data;
              if (data.code === 20000) {
                _this.$message({
                  message: `${data.data.info}`, // ${data.message}
                  type: "success",
                  duration: 1500,
                });
                _this.showAddModal = false;
                _this.currentChange(1);
              } else {
                _this.$notify({
                  title: "温馨提示",
                  type: "warning",
                  message: data.data.info,
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
    deleteSelected() {
      const _this = this;
      if (this.selectedRow.length === 0) {
        _this.$Notice.warning({
          title: "请勾选需要删除的表单流程",
        });
        return false;
      }
      const r = this.selectedRow.map((row) => row.id);
      deleteFormProcess(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.$Notice.success({
              title: data.message,
              desc: data.data.info,
            });
            _this.query();
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
    handleSelectionChange(val) {
      this.selectedRow = val;
    },
    convertStatusToSelection(code) {
      let node_share = [];
      let share_mode = 0;
      let biz_mode = 0;
      switch (Number(code)) {
        case 1:
          node_share = [_NODE_SHARE_ONLY];
          share_mode = MODE_SINGLE;
          break;
        case 2:
          node_share = [_NODE_SHARE_ONLY];
          share_mode = MODE_MULTI;
          break;
        case 3:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          share_mode = MODE_SINGLE;
          biz_mode = MODE_SINGLE;
          break;
        case 4:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          share_mode = MODE_MULTI;
          biz_mode = MODE_MULTI;
          break;
        case 5:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          share_mode = MODE_SINGLE;
          biz_mode = MODE_MULTI;
          break;
        case 6:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          share_mode = MODE_MULTI;
          biz_mode = MODE_SINGLE;
          break;

        default:
          break;
      }
      return { node_share, share_mode, biz_mode };
    },
    convertSelectionToStatus(row) {
      let s = row.status;
      let isNew = true;
      if (row.node_share.length === 0) {
        s = 0;
      } else if (row.node_share.length === 1) {
        isNew = row.share_mode !== 0;
        s = row.share_mode === MODE_SINGLE ? 1 : 2;
      } else if (row.node_share.length === 2) {
        if (row.share_mode === row.biz_mode) {
          s = row.share_mode === MODE_SINGLE ? 3 : 4;
        } else {
          if (row.share_mode === 0 || row.biz_mode === 0) {
            isNew = false;
          }
          s = row.share_mode === MODE_SINGLE ? 5 : 6;
        }
      }
      if (isNew === true) {
        const r = {
          id: row.id,
          status: s,
        };
        this.updateFormFlow(r);
      }
      return { val: s, isNew: isNew };
    },
    handleSelectNode(row, v) {
      row.node_share = v;
      this.convertSelectionToStatus(row);
    },
    handleSelectShareMode(row, v) {
      this.convertSelectionToStatus(row);
    },
    handleSelectBizMode(row, v) {
      this.convertSelectionToStatus(row);
    },
    updateFormFlow(r) {
      const _this = this;
      updateFormProcess(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.$Notice.success({
              title: data.message,
              desc: data.data.info,
            });
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
  },
};
</script>

<style lang="less" scoped>
.text-muted {
  color: #909399;
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
  .paginationStyle {
    display: flex;
    justify-content: flex-end;
    margin-top: 0;
  }
  .paginationStyle > .el-button {
    margin-right: 1rem;
  }
}
/deep/.flow-form-inline {
  // width: 100%;
  display: flex;
  justify-content: space-between;
}
/deep/.flow-form-inline .flow-form-action.ivu-form-item .ivu-form-item-content {
  display: flex;
  justify-content: space-between;
}
/deep/.ivu-select-multiple .ivu-tag span:not(.ivu-select-max-tag) {
  margin-right: 0;
}
/deep/.ivu-select-multiple .ivu-tag i {
  display: none;
}
</style>
