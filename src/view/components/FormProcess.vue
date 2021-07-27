<template>
  <div class="wraps">
    <div id="list">
      <Card style="width: 100%">
        <Form
          :inline="true"
          :label-width="80"
          class="flow-form-inline"
          ref="formInline"
        >
          <div>
            <FormItem label="表单名称" prop="formName">
              <Select
                v-if="options.length > 0"
                clearable
                filterable
                placeholder="请输入表单名称"
                v-model="formName"
              >
                <Option
                  :value="item.name"
                  v-for="item in options"
                  v-bind:key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
              <Input v-else v-model="formName" placeholder="请输入表单名称" />
            </FormItem>
            <FormItem label="创建日期:" prop="beginDate">
              <div class="numCount">
                <Date-picker
                  placeholder="选择日期"
                  type="date"
                  style="width: 130px"
                  :options="disabledDate1"
                  :value="beginDate"
                  format="yyyy-MM-dd"
                  @on-change="handleDatepicker($event, 'beginDate')"
                >
                </Date-picker>
                <span style="margin: 0 5px">—</span>
                <Date-picker
                  placeholder="选择日期"
                  style="width: 130px"
                  type="date"
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
          <FormItem :label-width="0" class="flow-form-action">
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
            <el-button
              v-if="!editMode"
              @click="editMode = true"
              type="primary"
              icon="el-icon-edit-outline"
              size="small"
              >编辑</el-button
            >
            <el-button
              v-if="editMode"
              type="primary"
              icon="el-icon-receiving"
              size="small"
              @click="saveBatch"
              >保存</el-button
            >
          </FormItem>
        </Form>
        <div class="tableList">
          <Table
            border
            stripe
            ref="formFlowTable"
            :columns="columns4"
            :data="tableData"
            style="width: 100%"
            no-data-text="暂无数据"
            @on-selection-change="handleSelectionChange"
          >
            <template slot-scope="{ row }" slot="node_share">
              <template v-if="editMode">
                <Select
                  transfer
                  multiple
                  v-model="row.node_share"
                  @on-change="(v) => handleSelectNode(row, v)"
                  @on-open-change="allowedChange"
                >
                  <Option :value="2" key="2" :disabled="row.disableBizNode"
                    >业务审批节点</Option
                  >
                  <Option :value="1" key="1" :disabled="row.disableShareNode"
                    >共享中心审批节点</Option
                  >
                </Select>
              </template>
              <div v-else>
                {{ row.node_share.includes(2) ? "共享中心审批节点" : "" }}
                <Divider v-if="row.node_share.length > 1" type="vertical" />
                {{ row.node_share.includes(1) ? "业务审批节点" : "" }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="biz_mode">
              <template v-if="editMode">
                <Select
                  transfer
                  v-if="row.showBizMode"
                  v-model="row.biz_mode"
                  @on-change="(v) => handleSelectBizMode(row, v)"
                >
                  <Option :value="MODE_SINGLE">单通过模式</Option>
                  <Option :value="MODE_MULTI">通过、驳回、转人工模式</Option>
                </Select>
              </template>
              <div v-else>
                {{ row.biz_mode === MODE_SINGLE ? "单通过模式" : "" }}
                {{
                  row.biz_mode === MODE_MULTI ? "通过、驳回、转人工模式" : ""
                }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="share_mode">
              <template v-if="editMode">
                <Select
                  transfer
                  v-if="row.showShareMode"
                  v-model="row.share_mode"
                  @on-change="(v) => handleSelectShareMode(row, v)"
                >
                  <Option :value="MODE_SINGLE">单通过模式</Option>
                  <Option :value="MODE_MULTI">通过、驳回、转人工模式</Option>
                </Select>
              </template>
              <div v-else>
                {{ row.share_mode === MODE_SINGLE ? "单通过模式" : "" }}
                {{
                  row.share_mode === MODE_MULTI ? "通过、驳回、转人工模式" : ""
                }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="is_online">
              <el-switch
                :disabled="!editMode"
                v-model="row.is_online"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="(v) => handleModifyRow(row, v)"
              >
              </el-switch>
            </template>
          </Table>
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
    <el-dialog title="添加表单" :visible.sync="showAddModal" width="400px">
      <template slot="title">
        <div class="dialog-title"><svg t="1626972171645" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14962" width="24" height="24"><path d="M616 224H560V128a64 64 0 0 0-64-64h-96a64 64 0 0 0-64 64v96h-56a40 40 0 0 0 0 80h336a40 40 0 0 0 0-80z m5.76 45.76a8.64 8.64 0 0 1-5.76 2.24h-336a8 8 0 1 1 0-16H368V128a32 32 0 0 1 32-32h96a32 32 0 0 1 32 32v128h88a8 8 0 0 1 8 8 8.64 8.64 0 0 1-2.24 5.76z" fill="#1991DD" p-id="14963"></path><path d="M448 160a8 8 0 1 1-8 8 8 8 0 0 1 8-8z m0-32a39.84 39.84 0 1 0 28.32 11.68A40 40 0 0 0 448 128z m248 288h-496a24 24 0 0 0 0 48h496a24 24 0 0 0 0-48z m-256 288h-240a24 24 0 0 0 0 48h240a24 24 0 0 0 0-48z m0-144h-240a24 24 0 0 0 0 48h240a24 24 0 0 0 0-48z" fill="#1991DD" p-id="14964"></path><path d="M480 936a24 24 0 0 1-24 24H128a64 64 0 0 1-64-64V208a64 64 0 0 1 64-64h72a24 24 0 0 1 0 48H128a16 16 0 0 0-16 16v688a16 16 0 0 0 16 16h328a24 24 0 0 1 24 24zM832 208v248a24 24 0 0 1-48 0V208a16 16 0 0 0-16-16h-72a24 24 0 0 1 0-48H768a64 64 0 0 1 64 64z" fill="#1991DD" p-id="14965"></path><path d="M737.6 515.2a64 64 0 0 1 45.28 18.72l158.4 158.4a64 64 0 0 1 0 90.56l-158.4 158.4a64 64 0 0 1-90.56 0l-158.4-158.4a64 64 0 0 1 0-90.56l158.4-158.4a64 64 0 0 1 45.28-18.72z m0 32a32 32 0 0 0-22.56 9.44l-158.4 158.4a32 32 0 0 0 0 45.12l158.4 158.4a32 32 0 0 0 45.12 0l158.4-158.4a32 32 0 0 0 0-45.12l-158.4-158.4a32 32 0 0 0-22.56-9.44z" fill="#1991DD" p-id="14966"></path><path d="M832 704H640a16 16 0 0 0 0 32h192a16 16 0 0 0 0-32z" fill="#1991DD" p-id="14967"></path><path d="M736 608a16 16 0 0 0-16 16v192a16 16 0 0 0 32 0V624a16 16 0 0 0-16-16z" fill="#1991DD" p-id="14968"></path></svg>
          <span class="el-dialog__title">添加表单</span>
        </div>
      </template>
      <el-form
        ref="addformflowf"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        center
      >
        <el-form-item label="表单名称" prop="formName">
          <el-input size="small" v-model="addForm.formName" placeholder="请输入表单名称" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showAddModal = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addFormFlow()">确 定</el-button>
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
  updateFormFlowBatch,
  addFormProcess,
} from "@/api/processMonitor";
export default {
  data() {
    return {
      editMode: false,
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
      disabledDate1: {
        disabledDate(date) {
          return date && date.valueOf() > new Date();
        },
      },
      disabledDate2: {
        disabledDate(date) {
          return date && date.valueOf() > new Date();
        },
      },
      formName: "",
      selectedRow: [],
      showAddModal: false,
      addForm: { formName: "" },
      addFormRules: {
        formName: [{ required: true, message: "请输入表单名称" }],
      },
      columns4: [
        { type: "selection", width: 55, align: "left" },
        { title: "序号", type: "index", width: 70, align: "center" },
        { title: "表单", key: "form_name", minWidth: 280, align: "center" },
        {
          title: "节点选择",
          slot: "node_share",
          minWidth: 280,
          align: "center",
        },
        {
          title: "业务审批节点模式",
          slot: "biz_mode",
          width: 220,
          align: "center",
        },
        {
          title: "共享中心审批节点模式",
          slot: "share_mode",
          width: 220,
          align: "center",
        },
        {
          title: "是否允许访问外网",
          slot: "is_online",
          width: 180,
          align: "center",
        },
        {
          title: "创建时间",
          key: "create_date_text",
          width: 180,
          align: "center",
        },
        {
          title: "修改时间",
          key: "update_date_text",
          width: 180,
          align: "center",
        },
      ],
      isUpdate: false,
      modifyData: {},
    };
  },
  computed: {
    options(){
      return this.$store.state.invoice.formList;
    },
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
      begindate.setDate(begindate.getDate() - 1);
      let enddate = new Date(this.endDate);
      this.disabledDate1 = {
        disabledDate(date) {
          return (
            (date && date.valueOf() < lastyear) ||
            (date && date.valueOf() > enddate) ||
            (date && date.valueOf() > today)
          );
        },
      };
      this.disabledDate2 = {
        disabledDate(date) {
          return (
            (date && date.valueOf() < begindate) ||
            (date && date.valueOf() > today)
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
        currentPage: this.page.currentPage,
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getFormProcess(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.tableData = data.data.list.map((row) => {
              const tmp = _this.convertStatusToSelection(row.status);
              row = { ...tmp, ...row };
              row.create_date_text = String(row.create_date)
                .substring(0, String(row.create_date).indexOf(".000"))
                .replace("T", " ");
              row.update_date_text = String(row.update_date)
                .substring(0, String(row.update_date).indexOf(".000"))
                .replace("T", " ");
              return row;
            });
            _this.page.totalElement = data.data.sum;
            _this.editMode = false;
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
    handleModifyRow(row, v) {
      this.modifyData[row.id] = _.cloneDeep(row);
    },
    saveBatch() {
      const _this = this;
      const postBody = Object.values(this.modifyData).map((r) => ({
        id: r.id,
        isOnline: r.is_online || 0,
        status: r.status,
      }));
      if (postBody.length === 0) {
        _this.$Notice.warning({
          title: "温馨提示",
          desc: "无更新数据",
        });
        _this.editMode = false;
        return false;
      }
      updateFormFlowBatch(postBody)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.modifyData = {};
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
      let disableBizNode = false;
      let disableShareNode = true;
      let showBizMode = false;
      let showShareMode = true;
      switch (Number(code)) {
        case 0:
          disableBizNode = true;
          disableShareNode = false;
          showShareMode = false;
          break;
        case 1:
          node_share = [_NODE_SHARE_ONLY];
          disableShareNode = false;
          showBizMode = false;
          share_mode = MODE_SINGLE;
          break;
        case 2:
          node_share = [_NODE_SHARE_ONLY];
          disableShareNode = false;
          showBizMode = false;
          share_mode = MODE_MULTI;
          break;
        case 3:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          disableShareNode = true;
          showBizMode = true;
          share_mode = MODE_SINGLE;
          biz_mode = MODE_SINGLE;
          break;
        case 4:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          disableShareNode = true;
          showBizMode = true;
          share_mode = MODE_MULTI;
          biz_mode = MODE_MULTI;
          break;
        case 5:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          disableShareNode = true;
          showBizMode = true;
          share_mode = MODE_SINGLE;
          biz_mode = MODE_MULTI;
          break;
        case 6:
          node_share = [_NODE_SHARE_ONLY, _NODE_SHARE_BIZ];
          disableShareNode = true;
          showBizMode = true;
          share_mode = MODE_MULTI;
          biz_mode = MODE_SINGLE;
          break;

        default:
          break;
      }
      return {
        node_share,
        disableBizNode,
        disableShareNode,
        share_mode,
        biz_mode,
        showBizMode,
        showShareMode,
      };
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
        if (row.share_mode === row.biz_mode && row.share_mode !== 0) {
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
        row.status = s;
        this.handleModifyRow(row);
      }
      return { val: s, isNew: isNew };
    },
    allowedChange(v) {
      this.isUpdate = v;
    },
    handleSelectNode(row, v) {
      const _this = this;
      if (this.isUpdate === true) {
        row.node_share = v;
        row.disableBizNode = !v.includes(_NODE_SHARE_ONLY);
        row.disableShareNode = v.includes(_NODE_SHARE_BIZ);
        row.showBizMode = row.disableShareNode;
        row.showShareMode = !row.disableBizNode;
        _this.convertSelectionToStatus(row);
      }
    },
    handleSelectShareMode(row, v) {
      this.convertSelectionToStatus(row);
    },
    handleSelectBizMode(row, v) {
      this.convertSelectionToStatus(row);
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
/deep/.ivu-table {
  font-size: 14px;
  th,
  td {
    padding: 12px 0;
  }
  th {
    background: #eef1f6;
    color: #909399;
    font-weight: bold;
  }
}
</style>
