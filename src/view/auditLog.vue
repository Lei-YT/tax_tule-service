<template>
  <div class="wraps">
    <div class="tabBox">
      <Card>
        <div class="tabList">
          <p
            :class="cur == index ? 'cur' : ''"
            v-for="(item, index) in tabList"
            :key="index"
            @click="changeCur(index)"
          >
            {{ item.type }}
          </p>
        </div>
      </Card>
    </div>
    <!-- 表单流程管理 -->
    <div class="conThr" v-show="cur == 1">
      <FormProcess></FormProcess>
    </div>
    <div id="list" v-show="cur == 0">
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
              <Select
                v-if="options.length > 0"
                clearable
                filterable
                placeholder="请选择业务名称"
                v-model="formInline.type"
              >
                <Option
                  :value="item.name"
                  v-for="item in options"
                  v-bind:key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
              <Input
                v-else
                v-model="formInline.type"
                placeholder="请输入业务名称"
              />
            </FormItem>
            <FormItem label="审核日期:" prop="checkBeginDate">
              <div class="numCount">
                <Date-picker
                  placeholder="选择日期"
                  type="date"
                  :value="formInline.checkBeginDate"
                  :options="disabledDate1"
                  format="yyyy-MM-dd"
                  @on-change="handleDatepicker($event, 'checkBeginDate')"
                >
                  <!-- @on-change="formInline.checkBeginDate = $event" -->
                </Date-picker>
                <span style="margin: 0 5px">—</span>
                <Date-picker
                  placeholder="选择日期"
                  type="date"
                  :value="formInline.checkEndDate"
                  :options="disabledDate2"
                  format="yyyy-MM-dd"
                  @on-change="handleDatepicker($event, 'checkEndDate')"
                >
                  <!-- @on-change="formInline.checkEndDate = $event" -->
                </Date-picker>
              </div>
            </FormItem>
          </div>
          <div class="searchItem">
            <FormItem label="审核结果:" prop="checkResult">
              <Select
                v-model="formInline.checkResult"
                ref="checkResult"
                clearable
              >
                <Option value="1">审核中</Option>
                <Option value="2">通过</Option>
                <Option value="3">不通过</Option>
                <Option value="4">超时</Option>
              </Select>
            </FormItem>
            <FormItem label="预警风险:" prop="earlyWarning">
              <Select
                v-if="warnOptions.length > 0"
                clearable
                v-model="formInline.earlyWarning"
              >
                <Option
                  :value="item.grade"
                  v-for="item in warnOptions"
                  v-bind:key="item.id"
                  >{{ item.grade }}</Option
                >
              </Select>
              <Input
                v-else
                v-model="formInline.earlyWarning"
                placeholder="预警风险"
              />
            </FormItem>

            <FormItem label="金额区间:" prop="cname">
              <div class="numCount">
                <Input v-model="formInline.beginMoney" placeholder="请输入" />
                <span style="margin: 0 5px">—</span>
                <Input v-model="formInline.endMoney" placeholder="请输入" />
              </div>
            </FormItem>
          </div>

          <div class="footerBox">
            <el-button
              type="primary"
              plain
              @click="searchData"
              icon="el-icon-search"
              size="small"
              >查询</el-button
            >
            <el-button
              type="primary"
              plain
              @click="handleReset('formInline')"
              icon="el-icon-refresh-left"
              size="small"
              >重置</el-button
            >
            <el-button
              type="primary"
              plain
              @click="exported"
              icon="el-icon-upload2"
              size="small"
              >导出</el-button
            >
            <el-button
              type="primary"
              plain
              @click="setting"
              icon="el-icon-setting"
              size="small"
              >设置</el-button
            >
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
            show-summary
            sum-text="x"
            :summary-method="calculateSummary"
            @sort-change="sortChange"
          >
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
                  v-if="
                    scope.row.checkResult == 2 || scope.row.checkResult == 3
                  "
                  type="text"
                  size="small"
                  >审核结果页</el-button
                >
                <el-button v-else type="text" size="small" disabled
                  >审核结果页</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="单据编号"
              v-if="form.type.includes('单据编号')"
              align="center"
              width="250"
              sortable="custom"
            />
            <el-table-column
              prop="type"
              label="业务名称"
              v-if="form.type.includes('业务名称')"
              align="center"
              width="280"
              sortable="custom"
            />
            <el-table-column
              prop="checkResult"
              label="审核结果"
              v-if="form.type.includes('审核结果')"
              align="center"
              width="130"
            >
              <template slot-scope="scope">
                <div
                  v-if="scope.row.checkResult == 3"
                  style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <Icon type="md-close-circle" size="18" color="#ed4014" />
                  <span>不通过</span>
                </div>
                <div
                  v-if="scope.row.checkResult == 2"
                  style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <Icon
                    type="md-checkmark-circle"
                    size="18"
                    color="#19be6b"
                    style="margin-right: 10%"
                  />
                  <span>通过</span>
                </div>
                <div
                  v-if="scope.row.checkResult == 1"
                  style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <Icon type="md-ionitron" size="18" color="#2d8cf0" />
                  <span>审核中</span>
                </div>
                <div
                  v-if="scope.row.checkResult == 4"
                  style="
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <Icon
                    type="md-close-circle"
                    size="18"
                    color="#ff9900"
                    style="margin-right: 10%"
                  />
                  <span>超时</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="金额"
              v-if="form.type.includes('金额')"
              align="center"
              width="130"
              sortable="custom"
            />
            <el-table-column
              prop="checkDate"
              label="审核日期"
              align="center"
              v-if="form.type.includes('审核日期')"
              width="180"
              sortable="custom"
            />
            <el-table-column
              prop="checkBeginDate"
              label="审核开始时间"
              v-if="form.type.includes('审核开始时间')"
              width="180"
              align="center"
            />
            <el-table-column
              prop="checkEndDate"
              label="审核结束时间"
              v-if="form.type.includes('审核结束时间')"
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
                  :percentage="
                    scope.row.ocrSchedule
                      ? parseFloat(scope.row.ocrSchedule)
                      : 0
                  "
                  :stroke-width="5"
                  color="#909399"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="invoiceSize"
              label="影像张数"
              v-if="form.type.includes('影像张数')"
              align="center"
              width="90"
            />
            <el-table-column
              prop="earlyWarning"
              label="预警风险"
              v-if="form.type.includes('预警风险')"
              align="center"
              width="130"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.warningColor">
                  <Icon
                    type="md-information-circle"
                    size="18"
                    :color="scope.row.warningColor"
                    style="margin-left: 3%"
                  />
                  {{ scope.row.earlyWarning }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rpaDate"
              label="数据获取时长"
              align="center"
              width="135"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.rpaDate !== null ? scope.row.rpaDate + "s" : "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ocrDate"
              label="OCR识别时长"
              align="center"
              width="135"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.ocrDate !== null ? scope.row.ocrDate + "s" : "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rulesDate"
              label="规则审核时长"
              align="center"
              width="135"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.rulesDate !== null
                    ? scope.row.rulesDate + "s"
                    : "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalDate"
              label="审核总时长"
              width="120"
              align="center"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.totalDate !== null
                    ? scope.row.totalDate + "s"
                    : "--"
                }}</span>
              </template>
            </el-table-column>
            <div
              slot="append"
              v-if="!dialogFormVisible && page.totalElement > 0"
            >
              <div class="sum_footer xiaoji" ref="sum_xiaoji">
                <div class="sum_footer_unit center">合计</div>
                <div class="sum_footer_unit"></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('单据编号')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('业务名称')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('金额')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核日期')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核开始时间')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核结束时间')"
                ></div>
                <div class="sum_footer_unit"></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('影像张数')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核结果')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('预警风险')"
                ></div>
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
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('单据编号')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('业务名称')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('金额')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核日期')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核开始时间')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核结束时间')"
                ></div>
                <div class="sum_footer_unit"></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('影像张数')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('审核结果')"
                ></div>
                <div
                  class="sum_footer_unit"
                  v-if="form.type.includes('预警风险')"
                ></div>
                <div class="sum_footer_unit center">
                  {{ tableSum.rpaDateAvg.toFixed(2) }}s
                </div>
                <div class="sum_footer_unit center">
                  {{ tableSum.ocrDateAvg.toFixed(2) }}s
                </div>
                <div class="sum_footer_unit center">
                  {{ tableSum.rulesDateAvg.toFixed(2) }}s
                </div>
                <div class="sum_footer_unit center">
                  {{ tableSum.totalDateAvg.toFixed(2) }}s
                </div>
              </div>
            </div>
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
              :page-size-opts="[10, 20, 30, 40, 100, 200]"
              prev-text="< 上一页"
              next-text="下一页 >"
              show-elevator
              show-sizer
              class-name="page-box"
            />
          </el-row>
        </div>
      </Card>
    </div>
    <!-- 弹框 -->
    <el-dialog title="设置" :visible.sync="dialogFormVisible" width="600px">
      <template slot="title">
        <div class="dialog-title">
          <svg
            style="display: block"
            t="1620485144823"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1160"
            width="24"
            height="24"
          >
            <path
              d="M594.466 454.588c0-37.137 23.484-68.813 56.252-81.374-7.646-30.584-19.66-59.529-35.499-86.29-32.222 14.2-70.997 8.193-97.212-18.022-26.214-26.214-32.221-64.99-18.022-97.211a363.318 363.318 0 0 0-86.289-35.499c-12.561 32.768-44.237 56.252-81.374 56.252-37.137 0-68.813-23.484-81.374-56.252-30.583 7.646-59.528 19.66-86.289 35.499 14.2 32.222 8.192 70.997-18.022 97.211s-64.99 32.222-97.212 18.023c-15.838 26.76-27.853 55.705-35.499 86.289 32.768 12.56 56.252 44.237 56.252 81.374 0 37.137-23.484 68.813-56.252 81.374 7.646 30.583 19.661 59.528 35.5 86.289 32.22-14.2 70.996-8.192 97.21 18.022 26.215 26.214 32.223 64.99 18.023 97.212 26.76 15.838 55.706 27.853 86.29 35.498 12.56-32.768 44.236-56.251 81.373-56.251 37.137 0 68.813 23.483 81.374 56.251 30.583-7.645 59.529-19.66 86.29-35.498-14.2-32.222-8.193-70.998 18.021-97.212 26.215-26.214 64.99-32.222 97.212-18.022 15.838-26.76 27.853-55.706 35.499-86.29-32.768-12.56-56.252-43.69-56.252-81.373z m-262.144 87.381c-48.06 0-87.381-39.322-87.381-87.381s39.321-87.382 87.381-87.382 87.381 39.322 87.381 87.382-39.321 87.381-87.38 87.381z m359.356-369.732h318.396v80.281H691.678z m0 323.31h318.396v80.282H691.678zM175.582 818.86h834.492v80.281H175.582z"
              p-id="1161"
              fill="#1991DD"
            ></path>
          </svg>
          <span class="el-dialog__title">设置</span>
        </div>
      </template>
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
      <span slot="footer" class="dialog-footer">
        <Button type="primary" @click="submit" ghost
          >取 消</Button
        >
        <Button type="primary" @click="submit" style="margin-left: 20px"
          >确 定</Button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import FormProcess from "./components/FormProcess";
export default {
  components: {
    FormProcess,
  },
  data() {
    return {
      cur: 0,
      tabList: [
        {
          type: "机器人审单日志",
        },
        {
          type: "表单流程管理",
        },
      ],
      dialogFormVisible: false,
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
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
      formInline: {
        code: "",
        type: "",
        checkResult: "",
        earlyWarning: "",
        checkBeginDate: "",
        checkEndDate: "",
        beginMoney: "",
        endMoney: "",
        // orderField: "",
        // orderType: "",
        orderCode: "", // 单据编号排序  是否排序  默认""  asc升序  desc降序
        orderType: "", // 业务名称排序  默认""
        orderMoney: "", // 金额排序    默认""
        orderCheckDate: "", // 审核日期    默认""
        orderRpaDate: "", // 数据获取时长  默认""
        orderOcrDate: "", // OCR识别时长 默认""
        orderRulesDate: "", // 规则审核时长  默认""
        orderTotalDate: "", // 审单总时长 默认""
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
      warnOptions: [],
      formNameOptions: [],
      selectedFormName: "",
    };
  },
  computed: {
    options(){
      return this.$store.state.invoice.formList;
    },
  },
  created() {
    // if (logJson.code == 20000) {
    //   let { data } = logJson.data;
    //   this.tableData = data;
    // }
    // this.query();
  },
  mounted() {
    this.adjustWidth();
    window.addEventListener("resize", this.adjustWidth.bind(this));
    this.getWarning();
    // this.getFormNameList();
    this.query();
  },
  // activated() {
  //   // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
  //   if(this.$route.meta.isBack){
  //   } else {
  //     this.page = {
  //       totalElement: 0, // 总页数
  //       currentPage: 1, // 当前页数
  //       size: 10 // 每页显示多少条
  //     }
  //     this.query()
  //   }
  //   // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
  //   this.$route.meta.isBack=false
  // },
  methods: {
    handleDatepicker(dateValue, dataKey) {
      this.$set(this.formInline, dataKey, dateValue);
      const bb = new Date();
      bb.setFullYear(bb.getFullYear() - 1);
      let lastyear = bb;
      let today = new Date();

      let begindate = new Date(this.formInline.checkBeginDate);
      begindate.setDate(begindate.getDate() - 1);
      let enddate = new Date(this.formInline.checkEndDate);
      this.disabledDate1 = {
        disabledDate(date) {
          return (
            (date && date.valueOf() < lastyear) ||
            (date && date.valueOf() > enddate)
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
    getFormNameList() {
      const _this = this;
      axios
        .request({
          method: "post",
          url: `/api/bill/findall`,
        })
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.formNameOptions = data.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getWarning() {
      const _this = this;
      axios
        .request({
          method: "post",
          url: `/api/bill/warnlist`,
        })
        .then((resp) => {
          let data = resp.data;
          if (data.status === 200) {
            _this.warnOptions = data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onFormNameChange(val) {
      const _this = this;
      _this.selectedFormName = val;
    },
    changeCur(index) {
      this.cur = index;
    },
    format(percentage) {
      if (percentage == 100) {
        return `${percentage}%`;
      }
    },
    handleChange(value) {
      this.form.type = value;
      // this.adjustWidth();
    },
    sortChange(val) {
      this.formInline.orderField = val.prop;
      var order = "";
      if (val.order == "ascending") {
        order = "asc";
      } else if (val.order == "descending") {
        order = "desc";
      }

      this.formInline.orderCode = "";
      this.formInline.orderType = "";
      this.formInline.orderMoney = "";
      this.formInline.orderCheckDate = "";
      this.formInline.orderRpaDate = "";
      this.formInline.orderOcrDate = "";
      this.formInline.orderRulesDate = "";
      this.formInline.orderTotalDate = "";

      if (val.prop == "code") {
        this.formInline.orderCode = order;
      } else if (val.prop == "type") {
        this.formInline.orderType = order;
      } else if (val.prop == "money") {
        this.formInline.orderMoney = order;
      } else if (val.prop == "checkDate") {
        this.formInline.orderCheckDate = order;
      } else if (val.prop == "rpaDate") {
        this.formInline.orderRpaDate = order;
      } else if (val.prop == "ocrDate") {
        this.formInline.orderOcrDate = order;
      } else if (val.prop == "rulesDate") {
        this.formInline.orderRulesDate = order;
      } else if (val.prop == "totalDate") {
        this.formInline.orderTotalDate = order;
      }

      this.query();
    },
    query() {
      const _this = this;
      axios
        .request({
          method: "POST",
          url: `/api/bill/page`,
          data: {
            current: _this.page.currentPage,
            size: _this.page.size,
            code: _this.formInline.code || "",
            type: _this.formInline.type || "",
            checkResult: _this.formInline.checkResult || "",
            earlyWarning: _this.formInline.earlyWarning || "",
            checkBeginDate: _this.formInline.checkBeginDate || "",
            checkEndDate: _this.formInline.checkEndDate || "",
            beginMoney: _this.formInline.beginMoney || "",
            endMoney: _this.formInline.endMoney || "",
            // orderField: _this.formInline.orderField || "",
            // orderType: _this.formInline.orderType || "",

            orderCode: _this.formInline.orderCode || "",
            orderType: _this.formInline.orderType || "",
            orderMoney: _this.formInline.orderMoney || "",
            orderCheckDate: _this.formInline.orderCheckDate || "",
            orderRpaDate: _this.formInline.orderRpaDate || "",
            orderOcrDate: _this.formInline.orderOcrDate || "",
            orderRulesDate: _this.formInline.orderRulesDate || "",
            orderTotalDate: _this.formInline.orderTotalDate || "",
          },
        })
        .then(function (response) {
          let data = response.data;
          if (data.code == 20000) {
            _this.tableData = data.data.data.map((row) => {
              const findC = _this.warnOptions.find(
                (w) => w.grade === row.earlyWarning
              );
              row.warningColor = findC ? findC.color : "";
              return row;
            });
            _this.page.totalElement = data.data.total;
          }
          _this.adjustWidth();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 导出
    exported() {
      const _this = this;
      axios
        .request({
          url: `/api/bill/export`,
          method: "POST",
          data: {
            code: _this.formInline.code || "",
            type: _this.formInline.type || "",
            checkResult: _this.formInline.checkResult || "",
            earlyWarning: _this.formInline.earlyWarning || "",
            checkBeginDate: _this.formInline.checkBeginDate || "",
            checkEndDate: _this.formInline.checkEndDate || "",
            beginMoney: _this.formInline.beginMoney || "",
            endMoney: _this.formInline.endMoney || "",
            // orderField: _this.formInline.orderField || "",
            // orderType: _this.formInline.orderType || "",
            orderCode: _this.formInline.orderCode || "",
            orderType: _this.formInline.orderType || "",
            orderMoney: _this.formInline.orderMoney || "",
            orderCheckDate: _this.formInline.orderCheckDate || "",
            orderRpaDate: _this.formInline.orderRpaDate || "",
            orderOcrDate: _this.formInline.orderOcrDate || "",
            orderRulesDate: _this.formInline.orderRulesDate || "",
            orderTotalDate: _this.formInline.orderTotalDate || "",
          },
          responseType: "blob",
        })
        .then(function (response) {
          if (!response) {
            _this.$Notice.warning({
              title: '温馨提示',
              desc: '未解析到数据'
            });
            return;
          }
          // let blobType = "application/vnd.ms-excel";
          const contentType = response.headers['content-type'].split(';');
          const blobType = contentType[0];
          let url = window.URL.createObjectURL(
            new Blob([response.data], { type: blobType })
            // response.data
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "导出结果");
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 设置
    setting() {
      this.dialogFormVisible = true;
    },
    submit() {
      this.dialogFormVisible = false;
      this.adjustWidth();
    },
    handleClick(row) {
      this.$router.push({
        // path: `/logResult/logResult?billNumber=${row.taskId}`
        name: "logResultIndex",
        params: {
          billNumber: row.taskId,
          checkDate: row.checkDate,
          money: row.money,
        },
      });
    },
    searchData() {
      this.page.currentPage = 1;
      this.query();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.formInline = {
        code: "",
        type: "",
        checkResult: "",
        earlyWarning: "",
        checkBeginDate: "",
        checkEndDate: "",
        beginMoney: "",
        endMoney: "",
        orderField: "",
        orderType: "",
      };
      this.form = {
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
      };
      this.$refs.checkResult.clearSingleSelect();
      this.query();
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
            if (this.$refs.sum_xiaoji.children[i]) {
              this.$refs.sum_xiaoji.children[i].style =
                "width:" + n.getAttribute("width") + "px";
              this.$refs.sum_heji.children[i].style =
                "width:" + n.getAttribute("width") + "px";
            }
          });
        }
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.tabBox {
  width: 100%;
  height: 66px;
  margin-bottom: 20px;
}
.tabList {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #999;
  p {
    height: 30px;
    margin-right: 20px;
    cursor: pointer;
  }
}
.cur {
  color: #1991dd;
  border-bottom: 2px solid #1991dd;
}
.curCard {
  box-shadow: 0 0 0 2px rgba(6, 116, 243, 0.856);
}
.numCount {
  display: flex;
}
/deep/.el-dialog {
  width: 65%;
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

.sum_footer {
  display: flex;
  display: -webkit-flex;
  line-height: 50px;
  color: #606266;
  justify-content: center;
}
.sum_footer_unit {
  // flex-grow: 1;
  // -webkit-flex-grow: 1;
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
/deep/.el-button--primary.is-plain {
  color: #1991dd;
  background: #ffffff;
  border-color: #1991dd;
}
/deep/.el-button--primary.is-plain:focus,
/deep/.el-button--primary.is-plain:hover {
  color: #ffffff;
  background: #1991dd;
  border-color: #1991dd;
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #999999;
}
/deep/.dialog-title {
  display: flex;
  align-items: center;
  align-content: center;
}
/deep/.el-dialog__title {
  margin-left: 0.5rem;
  color: #1991dd;
}
</style>
