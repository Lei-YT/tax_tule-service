<template>
  <div class="wraps">
    <div class="dataMonitor">
      <Card style="width: 100%">
        <div style="display: flex; justify-content: space-between">
          <Form
            :inline="true"
            :label-width="80"
            class="demo-form-inline"
            ref="formInline"
          >
            <FormItem label="表单名称：" prop="name">
              <Select
                style="width: 200px"
                v-model="selected"
                @on-change="getTypeSelected"
              >
                <Option value="全部">全部</Option>
                <Option
                  :value="item.name"
                  v-for="item in options"
                  v-bind:key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="审核日期:" prop="checkBeginDate">
              <div class="numCount">
                <Date-picker
                  placeholder="选择日期"
                  type="date"
                  :options="disabledDate1"
                  :value="checkBeginDate"
                  format="yyyy-MM-dd"
                  @on-change="handleDatepicker($event, 'checkBeginDate')"
                >
                </Date-picker>
                <span style="margin: 0 5px">—</span>
                <Date-picker
                  placeholder="选择日期"
                  type="date"
                  :options="disabledDate2"
                  :value="checkEndDate"
                  format="yyyy-MM-dd"
                  @on-change="handleDatepicker($event, 'checkEndDate')"
                >
                </Date-picker>
                <!-- <Input
                    v-model="formInline.checkBeginDate"
                    placeholder="请输入"
                  /> -->
                <!-- <span style="margin: 0 15px">——</span> -->
                <!-- <Input v-model="formInline.checkEndDate" placeholder="请输入" /> -->
              </div>
            </FormItem>

            <FormItem>
              <el-button
                type="primary"
                @click="checkyear()"
                size="small"
                :class="status == 1 ? 'btn-show' : 'btn-none'"
                >本年</el-button
              >

              <el-button
                type="primary"
                @click="checkmonth()"
                size="small"
                :class="status == 2 ? 'btn-show' : 'btn-none'"
                >本月</el-button
              >

              <el-button
                type="primary"
                @click="checktoday()"
                size="small"
                :class="status == 3 ? 'btn-show' : 'btn-none'"
                >本日</el-button
              >
            </FormItem>
            <FormItem>
              <el-button
                type="primary"
                @click="getCheckdate()"
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
          </Form>
        </div>
      </Card>
      <!-- 上 -->
      <Card style="width: 100%" class="topCount">
        <div class="title">机器人数据监控统计</div>
        <div class="listBox">
          <div class="listItem">
            <img src="@/assets/images/icon1.png" class="icon" />
            <div class="counts">
              <p>单据总数（单）</p>
              <p>{{ successnum + failnum + timeoutnum }}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon2.png" class="icon" />
            <div class="counts">
              <p>审核通过单量（单）</p>
              <p>{{ successnum }}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon3.png" class="icon" />
            <div class="counts">
              <p>审核不通过单量（单）</p>
              <p>{{ failnum }}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon4.png" class="icon" />
            <div class="counts">
              <p>超时单量（单）</p>
              <p>{{ timeoutnum }}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon5.png" class="icon" />
            <div class="counts">
              <p>平均每单审核时长 (分钟)</p>
              <p>{{ avgBillDatenum }}</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 35px; margin-bottom: 25px">
          维度名称：
          <Select
            ref="checkResult"
            clearable
            style="width: 200px"
            @on-change="getShowSelected"
          >
            <Option value="1">规则数量</Option>
            <Option value="2">机器人审单量</Option>
            <Option value="3">预警量</Option>
            <Option value="4">通过率</Option>
            <Option value="0">全部</Option>
          </Select>
        </div>

        <div class="title">机器人数据监控统计表</div>
        <div class="charsBox">
          <div id="charts"></div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import store from "@/store";
import { Notification, Loading } from "element-ui";
import axios from "@/libs/api.request";
export default {
  data() {
    return {
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      options: [],
      selected: "全部",
      failnum: 0, //审核不通过单量
      avgBillDatenum: 0, //平均每单审核时长  单位秒(s)
      successnum: 0, // 审核通过单量
      timeoutnum: 0, // 超时单量
      checkBeginDate: "",
      checkEndDate: "",
      disabledDate1: {},
      disabledDate2: {},
      status: "",
      showcheck: {},
      dates: [],
      rules: [],
      totals: [],
      warnings: [],
      successarr: [],
      formatter:
        "{b}<br/>{a0}:{c0}百<br/>{a1}:{c1}<br/>{a2}:{c2}<br/>{a3}:{c3}%<br/>",
    };
  },
  mounted() {
    // this.initChart();
    this.getSelectlist();
    this.getCheckdate();
    this.handleDatepicker();
  },
  created() {
    // this.query();
  },
  methods: {
    getShowSelected(val) {
      console.log("1212", val);
      const _this = this;

      if (val == 0) {
        _this.showcheck = {
          规则数量: true,
          机器人审单量: true,
          预警量: true,
          通过率: true,
        };
        _this.formatter =
          "{b}<br/>{a0}:{c0}百<br/>{a1}:{c1}<br/>{a2}:{c2}<br/>{a3}:{c3}%<br/>";
      }
      if (val == 1) {
        _this.showcheck = {
          规则数量: true,
          机器人审单量: false,
          预警量: false,
          通过率: false,
        };
        _this.formatter = "{b}<br/>{a0}:{c0}百<br/>";
      }
      if (val == 2) {
        _this.showcheck = {
          规则数量: false,
          机器人审单量: true,
          预警量: false,
          通过率: false,
        };
        _this.formatter = "{b}<br/>{a0}:{c0}<br/>";
      }
      if (val == 3) {
        _this.showcheck = {
          规则数量: false,
          机器人审单量: false,
          预警量: true,
          通过率: false,
        };
        _this.formatter = "{b}<br/>{a0}:{c0}<br/>";
      }
      if (val == 4) {
        _this.showcheck = {
          规则数量: false,
          机器人审单量: false,
          预警量: false,
          通过率: true,
        };
        _this.formatter = "{b}<br/>{a0}:{c0}%<br/>";
      }
      this.initChart();
    },
    handleReset() {
      this.selected = "";

      this.checkBeginDate = "";

      this.checkEndDate = "";
      this.status = "";
    },
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    checkyear() {
      // var now_year = new Date().getFullYear();
      // let begindate = new Date(now_year, 0, 1);

      // this.checkBeginDate=this.formatDate(begindate);

      // // var YearEnd = new Date((new Date(now_year + 1, 0, 1)).getTime() - 1000 * 60 * 60* 24);
      // this.checkEndDate=this.formatDate(new Date());
      this.status = 1;
    },
    checkmonth() {
      // var date=new Date();
      // date.setDate(1);

      // this.checkBeginDate=this.formatDate(date);

      // // date=new Date();
      // // var currentMonth=date.getMonth();
      // // var nextMonth=++currentMonth;
      // // var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
      // // var oneDay=1000*60*60*24;
      // // let enddatestr =new Date(nextMonthFirstDay-oneDay);

      // this.checkEndDate=this.formatDate(new Date());
      this.status = 2;
    },
    checktoday() {
      // var now = new Date()

      // this.checkBeginDate=this.formatDate(now);
      // this.checkEndDate=this.formatDate(now);
      this.status = 3;
      // return Promise.resolve();
    },
    getTypeSelected(val) {
      // console.log(val)
      const _this = this;
      _this.selected = val;
    },
    initChart() {
      let myChart = echarts.init(document.getElementById("charts"));
      let showcheck = this.showcheck;
      let dates = this.dates;
      let rules = this.rules;
      let totals = this.totals;
      let warnings = this.warnings;
      let successarr = this.successarr;

      let formatter = this.formatter;
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: formatter,
        },
        legend: {
          data: ["规则数量", "机器人审单量", "预警量", "通过率"],
          selected: showcheck,
          selectedMode: false,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: dates, //['2021-05-10', '2021-05-11', '2021-05-12', '2021-05-13', '2021-05-14', '2021-05-17', '2021-05-18', '2021-05-19', '2021-05-20']
            axisLabel: {
              interval: 0,
              rotate: 40,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
          {
            type: "value",
            min: 0,
            max: 100,
            position: "right",
            axisLabel: {
              formatter: "{value}%",
            },
          },
        ],
        series: [
          {
            name: "规则数量",
            type: "bar",
            stack: "zh",
            emphasis: {
              focus: "series",
            },
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#1991DD",
              },
            },
            data: rules, //[12, 13, 10, 13, 9, 230, 200, 100, 87]
          },
          {
            name: "机器人审单量",
            type: "bar",
            stack: "zh",
            emphasis: {
              focus: "series",
            },
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#70B822",
              },
            },
            data: totals, //[4, 15, 47, 94, 88, 234, 209, 284, 97]
          },
          {
            name: "预警量",
            type: "bar",
            stack: "zh",
            emphasis: {
              focus: "series",
            },
            barWidth: 20,
            itemStyle: {
              normal: {
                color: "#F7B500",
              },
            },
            data: warnings, //[0, 0, 0, 0, 0, 0, 0, 10, 0]
          },
          {
            name: "通过率",
            type: "line",
            yAxisIndex: 1,
            showSymbol: false,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#1991DD" },
                  { offset: 1, color: "#FFFFFF" },
                ]),
              },
            }, //填充区域样式
            lineStyle: {
              color: "#1991DD",
              width: 1,
            }, //线条的样式
            itemStyle: {
              color: "#1991DD",
              opacity: 0, //为0不会绘制图形拐点消失
            }, //拐点的样式
            data: successarr, //[(0/4)*100, (10/15)*100, (0/47)*100, (80/94)*100, (30/88)*100, (64/234)*100, (40/209)*100, (19/284)*100, (0/97)*100]
          },
        ],
      };

      myChart.setOption(option);
    },
    getSelectlist() {
      const _this = this;
      axios
        .request({
          method: "post",
          url: `http://10.15.196.130:6652/api/bill/findall`,
        })
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.options = data.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCheckdate() {
      const _this = this;
      if (!_this.checkBeginDate && !_this.checkEndDate) {
        // _this.checktoday().then((resp) => {
        //   _this.checkDateData()
        // })
        var now = new Date();

        _this.checkBeginDate = _this.formatDate(now);
        _this.checkEndDate = _this.formatDate(now);
        _this.checkDateData();
        return false;
      }
      _this.checkDateData();
    },
    checkDateData() {
      const _this = this;
      let selected = "";
      if (_this.selected == "全部") {
        selected = "";
      } else {
        selected = _this.selected;
      }
      axios
        .request({
          method: "post",
          url: `http://10.15.196.130:6652/api/bill/checkdatechart`,
          data: {
            type: selected,
            checkBeginDate: _this.checkBeginDate,
            checkEndDate: _this.checkEndDate,
            status: _this.status,
          },
        })
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.failnum = data.data.fail;
            _this.avgBillDatenum = (data.data.avgBillDate / 60).toFixed(2);
            _this.successnum = data.data.success;
            _this.timeoutnum = data.data.timeout;

            let dates = [];
            let rules = [];
            let totals = [];
            let warnings = [];
            let successarr = [];

            data.data.data.forEach(function (value, key, iterable) {
              dates.push(value.date);
              let rulesCount = value.rulesCount / 100;
              rules.push(rulesCount);
              totals.push(value.totalCount);
              warnings.push(value.earlyWarning);

              let successdata = (
                (value.successCount / value.totalCount) *
                100
              ).toFixed(2);
              successarr.push(successdata);
            });

            this.dates = dates;
            this.rules = rules;
            this.totals = totals;
            this.warnings = warnings;
            this.successarr = successarr;
            this.initChart();
          } else {
            Notification.closeAll();
            Notification({
              message: data.msg || data.message,
              type: "warning",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleDatepicker(dateValue, dataKey) {
      // console.log(dateValue, dataKey)
      this.$set(this, dataKey, dateValue);
      this.status = "";
      // if (dataKey==='checkBeginDate') {

      const bb = new Date();
      bb.setFullYear(bb.getFullYear() - 1);
      let lastyear = bb;
      let today = new Date();

      let begindate = new Date(this.checkBeginDate);
      let enddate = new Date(this.checkEndDate);
      // console.log(lastyear,begindate)
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
      // }
      // if (dataKey==='checkEndDate') {
      //   let now_year = (new Date(this.checkEndDate)).getFullYear();
      //   let now_month = (new Date(this.checkEndDate)).getMonth();
      //   let now_day = (new Date(this.checkEndDate)).getDate() ;
      //   let now_time = (new Date(this.checkEndDate)).getTime() ;
      //   let disabledDate1 =new Date((new Date(now_year - 1, now_month, now_day)).getTime() );
      //   this.disabledDate1 = {
      //     disabledDate: function (date) {
      //       return (date && date.valueOf() < disabledDate1.getTime())
      //         || (date && date.valueOf()>now_time);
      //     }
      //   }
      //   this.disabledDate2 = {
      //     disabledDate: function (date) {
      //       return false;
      //     }
      //   }
      // }
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.btn-show {
  background-color: #1991dd;
  opacity: 1;
}
.btn-none {
  opacity: 0.6;
}
.ivu-card {
  margin-bottom: 20px;
}
.topCount {
  display: flex;
  flex-direction: column;
  color: #333;
  font-weight: 600;
  .listBox {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 20px;
    .listItem {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        width: 48px;
        height: 48px;
        margin-right: 10px;
      }
      .counts {
        line-height: 1.5;
        p:last-child {
          font-size: 18px;
        }
      }
    }
  }
}
.cenCon {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.titleTop {
  display: flex;
  justify-content: space-around;
}
.btnBox {
  display: flex;
}
.charsBox {
  flex: 1;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#charts,
#secgram,
#thirdgram {
  width: 100%;
  height: 100%;
}
</style>
