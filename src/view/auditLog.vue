<template>
  <div class="wraps">
    <div id="list">
      <Card style="width: 100%">
        <Form
          :inline="true"
          :model="formInline"
          :label-width="80"
          class="demo-form-inline"
          ref="formInline"
        >
          <div class="searchItem">
            <FormItem label="单据编号:" prop="code">
              <Input v-model="formInline.code" placeholder="请输入单据编号" />
            </FormItem>
            <FormItem label="业务名称:" prop="type">
              <Input v-model="formInline.type" placeholder="请输入业务名称" />
            </FormItem>
            <FormItem label="审核日期:" prop="checkBeginDate">
              <div class="numCount">
                <Input
                  v-model="formInline.checkBeginDate"
                  placeholder="请输入"
                />
                <span style="margin: 0 15px">——</span>
                <Input v-model="formInline.checkEndDate" placeholder="请输入" />
              </div>
            </FormItem>
          </div>
          <div class="searchItem">
            <FormItem label="审核结果:" prop="checkResult">
              <Input placeholder="审核结果" />
            </FormItem>
            <FormItem label="预警风险:" prop="earlyWarning">
              <Input placeholder="预警风险" />
            </FormItem>

            <FormItem label="金额区间:" prop="cname">
              <div class="numCount">
                <Input v-model="formInline.cname" placeholder="请输入" />
                <span style="margin: 0 15px">——</span>
                <Input v-model="formInline.cname" placeholder="请输入" />
              </div>
            </FormItem>
          </div>

          <div class="footerBox">
            <Button @click="searchData()">查询</Button>
            <Button @click="handleReset('formInline')" style="margin-left: 15px"
              >重置</Button
            >
            <Button @click="exported" style="margin: 0 15px">导出</Button>
            <Button @click="setting">设置</Button>
          </div>
        </Form>
      </Card>

      <Card style="width: 100%; margin-top: 20px">
        <div class="tableList">
          <el-table
            ref="table"
            :data="tableData"
            border
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              fontWeight: 'normal',
              fontSize: '12px',
            }"
            @selection-change="handleSelectionChange"
            show-summary
            sum-text="x"
            :summary-method="calculateSummary"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60"
            />
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >审核结果页</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="单据编号"
              align="center"
              width="250"
              sortable
            />
            <el-table-column
              prop="type"
              label="业务名单"
              align="center"
              width="280"
              sortable
            />
            <el-table-column
              prop="money"
              label="金额"
              align="center"
              width="130"
              sortable
            />
            <el-table-column
              prop="checkDate"
              label="审核日期"
              align="center"
              width="180"
              sortable
            />
            <el-table-column
              prop="checkBeginDate"
              label="审核开始时间"
              width="180"
              align="center"
            />
            <el-table-column
              prop="checkEndDate"
              label="审核结束时间"
              width="180"
              align="center"
            />
            <el-table-column
              width="230"
              prop="ocrSchedule"
              label="识别进度"
              align="center"
            >
              <template slot-scope="scope">
                <el-progress
                  :percentage="parseFloat(scope.row.ocrSchedule)"
                  :stroke-width="5"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="invoiceSize"
              label="影像张数"
              align="center"
              width="90"
            />
            <el-table-column
              prop="checkResult"
              label="审核结果"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.checkResult == 3">不通过</span>
                <span v-if="scope.row.checkResult == 2">通过</span>
                <span v-if="scope.row.checkResult == 1">审核中</span>
                <span v-if="scope.row.checkResult == 4">超时</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="earlyWarning"
              label="预警风险"
              align="center"
              width="130"
            />
            <el-table-column
              prop="rpaDate"
              label="数据获取时长"
              align="center"
              width="135"
              sortable
            >
              <template slot-scope="scope">
                <span>{{ scope.row.rpaDate }}s</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ocrDate"
              label="OCR识别时长"
              align="center"
              width="135"
              sortable
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.ocrDate ? scope.row.ocrDate + "s" : "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rulesDate"
              label="规则审核时长"
              align="center"
              width="135"
              sortable
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.rulesDate ? scope.row.rulesDate + "s" : "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalDate"
              label="审核总时长"
              width="120"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.totalDate ? scope.row.totalDate + "s" : "--"
                }}</span>
              </template>
            </el-table-column>
            <div slot="append">
              <div class="sum_footer xiaoji" ref="sum_xiaoji">
                <div class="sum_footer_unit center">合计</div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit center">数据获取平均时长</div>
                <div class="sum_footer_unit center">OCR识别平均时长</div>
                <div class="sum_footer_unit center">规则审核平均时长</div>
                <div class="sum_footer_unit center">审单平均时长</div>
              </div>
              <div class="sum_footer" ref="sum_heji">
                <div class="sum_footer_unit center">
                  {{ tableData.length }}条
                </div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit"></div>
                <div class="sum_footer_unit center">
                  {{ tableSum.rpaDateAvg }}s
                </div>
                <div class="sum_footer_unit center">
                  {{ tableSum.ocrDateAvg }}s
                </div>
                <div class="sum_footer_unit center">
                  {{ tableSum.rulesDateAvg }}s
                </div>
                <div class="sum_footer_unit center">
                  {{ tableSum.totalDateAvg }}s
                </div>
              </div>
            </div>
          </el-table>
        </div>
        <el-row class="paginationStyle">
          <Page
            @on-change="currentChange"
            @on-page-size-change="sizeChange"
            :current="page.currentPage"
            :total="page.totalElement"
            prev-text="上一页"
            next-text="下一页"
            show-elevator
            show-sizer
            class-name="page-box"
          />
        </el-row>
      </Card>
    </div>
    <!-- 弹框 -->
    <el-dialog title="设置" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="160px" center>
        <el-form-item label="选择列表展示字段：">
          <el-checkbox-group
            class="grid_3"
            v-model="form.type"
            @change="handleChange"
          >
            <el-checkbox label="单据编号" name="type"></el-checkbox>
            <el-checkbox label="业务名称" name="type"></el-checkbox>
            <el-checkbox label="金额" name="type"></el-checkbox>
            <el-checkbox label="审核日期" name="type"></el-checkbox>
            <el-checkbox label="审核开始时间" name="type"></el-checkbox>
            <el-checkbox label="审核结束时间" name="type"></el-checkbox>
            <el-checkbox label="审核结果" name="type"></el-checkbox>
            <el-checkbox label="预警风险" name="type"></el-checkbox>
            <el-checkbox label="影像张数" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import logJson from "@/dataJson/log.json";
import axios from "axios";
export default {
  data() {
    return {
      dialogFormVisible: false,
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      formInline: {
        code: "",
        type: "",
        checkResult: "",
        earlyWarning: "",
        checkBeginDate: "",
        checkEndDate: "",
        beginMoney: "",
        endMoney: "",
      },
      form: {
        type: [
          "单据编号",
          "业务名称",
          "金额",
          "审核日期",
          "审核开始时间",
          "审核结束时间",
          "审核结果",
          "预警风险",
          "影像张数",
        ],
      },
      tableData: [],
      model1: "",
      idArr: [],
      tableSum: {
        rpaDateAvg: 0,
        ocrDateAvg: 0,
        rulesDateAvg: 0,
        totalDateAvg: 0,
      },
    };
  },
  created() {
    if (logJson.code == 20000) {
      let { data } = logJson.data;
      this.tableData = data;
    }
    this.query();
  },
  mounted() {
    this.adjustWidth();
    window.addEventListener("resize", this.adjustWidth.bind(this));
    this.query();
  },
  methods: {
    format(percentage) {
      if (percentage == 100) {
        return `${percentage}%`;
      }
    },
    handleChange(value) {
      this.form.type = value;
    },
    handleSelectionChange(val) {
      let idArr = [];
      val.map((item, index) => {
        return idArr.push(item.id);
      });
      this.idArr = idArr;
    },
    query() {
      const _this = this;
      axios
        .post(
          `http://10.15.196.127:7070/bill/page/${_this.page.currentPage}/${_this.page.size}`,
          {
            code: _this.formInline.code || "",
            type: _this.formInline.type || "",
            checkResult: _this.formInline.checkResult || "",
            earlyWarning: _this.formInline.earlyWarning || "",
            beginMoney: _this.formInline.beginMoney || "",
            endMoney: _this.formInline.endMoney || "",
          }
        )
        .then(function (response) {
          let data = response.data;
          if (data.code == 20000) {
            _this.tableData = data.data.data;
            this.tableData = data.data.data;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 导出
    exported() {
      axios
        .post(`http://10.15.196.127:7070/bill/export`, this.idArr)
        .then(function (response) {
          let data = response.data;
          if (data.code == 20000) {
            this.$message({
              message: data.message,
              type: "success",
              duration: 1200,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 设置
    setting() {
      this.dialogFormVisible = true;
    },
    submit() {},
    handleClick(row) {
      this.$router.push({
        path: `/logResult/logResult?billNumber=${row.code}`,
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
    calculateAvg(sum, length, key) {
      const _this = this;
      _this.tableSum[key] = parseFloat(sum) / parseFloat(length).toFixed(2);
    },
    calculateSummary(param) {
      const _this = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const allRpaDateValues = data.map((item) =>
          Number(item[column.property])
        );
        let sumColumn = 0;
        if (!allRpaDateValues.every((value) => isNaN(value))) {
          sumColumn = allRpaDateValues.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
        if (index === 13) {
          sums[index] = "数据获取平均时长";
          _this.calculateAvg(sumColumn, allRpaDateValues.length, "rpaDateAvg");
          return;
        }
        if (index === 14) {
          sums[index] = "OCR识别平均时长";
          _this.calculateAvg(sumColumn, allRpaDateValues.length, "ocrDateAvg");
          return;
        }
        if (index === 15) {
          sums[index] = "规则审核平均时长";
          _this.calculateAvg(
            sumColumn,
            allRpaDateValues.length,
            "rulesDateAvg"
          );
          return;
        }
        if (index === 16) {
          sums[index] = "审单平均时长";
          _this.calculateAvg(
            sumColumn,
            allRpaDateValues.length,
            "totalDateAvg"
          );
          return;
        }
        sums[index] = "";
        return;
      });

      return sums;
    },
    adjustWidth() {
      this.$nextTick(() => {
        if (
          this.$refs &&
          this.$refs.sum_xiaoji &&
          this.$refs.sum_heji &&
          this.$refs.table &&
          this.$refs.table.$refs.headerWrapper
        ) {
          var width = getComputedStyle(
            this.$refs.table.$refs.headerWrapper.querySelector("table")
          ).width;
          this.$refs.sum_xiaoji.style = "width:" + width;
          this.$refs.sum_heji.style = "width:" + width;
          Array.from(
            this.$refs.table.$refs.headerWrapper.querySelectorAll("col")
          ).forEach((n, i) => {
            this.$refs.sum_xiaoji.children[i].style =
              "width:" + n.getAttribute("width") + "px";
            this.$refs.sum_heji.children[i].style =
              "width:" + n.getAttribute("width") + "px";
          });
        }
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.numCount {
  display: flex;
}
/deep/.el-dialog {
  width: 35%;
}
.searchItem {
  width: 100%;
  display: flex;
  justify-content: space-around;
  .ivu-form-item {
    width: 28%;
  }
}
/deep/.ivu-date-picker,
.ivu-select {
  flex: 1;
}
.grid_3 {
  display: grid;
  grid-template-columns: 30% 30% 30%;
}
/deep/.el-table__append-wrapper {
  overflow: visible;
}
/deep/.el-table__footer {
  font-size: 12px !important;
  display: none;
}
.page-box {
}

.sum_footer {
  display: flex;
  display: -webkit-flex;
  line-height: 50px;
  color: #606266;
}
.sum_footer_unit {
  flex-grow: 1;
  -webkit-flex-grow: 1;
  // text-indent: 10px;
  font-size: 12px !important;
  // font-size: 14px;
  // border: 1px solid #ebeef5;
}
.sum_footer_unit.center {
  text-align: center;
  // border-left: 1px solid #ebeef5;
}
.sum_footer.xiaoji {
  border-bottom: 1px solid #ebeef5;
}
.footerBox {
  width: 100%;
  padding-right: 3%;
  text-align: right;
}
</style>
