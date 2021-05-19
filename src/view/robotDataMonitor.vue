<template>
  <div class="wraps">
    <div class="dataMonitor">
      <Card style="width: 100%">
        <div style="display: flex;justify-content: space-between;">
            <Form
              :inline="true"
              
              :label-width="80"
              class="demo-form-inline"
              ref="formInline"
            >
              <FormItem label="表单名称：" prop="name">
                <Select ref="checkResult" clearable style="width: 200px;">
                  <Option value="1">劳务结算单</Option>
                  <Option value="2">机械租赁单</Option>
                  <Option value="3">全部</Option>
                </Select>
              </FormItem>
              <FormItem label="审核日期:" prop="checkBeginDate">
                <div class="numCount">
                  <Date-picker placeholder="选择日期" type="date"  format="yyyy-MM-dd"  >
                  </Date-picker>
                  <span style="margin: 0 5px">—</span>
                  <Date-picker placeholder="选择日期" type="date" format="yyyy-MM-dd" >
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
                <el-button type="primary" @click="handleClick('add', '')" size="small"
                  >本年</el-button>
             
                <el-button type="primary" @click="handleClick('add', '')" size="small"
                  >本月</el-button>
              
                <el-button type="primary" @click="handleClick('add', '')" size="small"
                  >本日</el-button>
              </FormItem>
              <FormItem>
                <el-button type="primary" @click="searchData()"  icon="el-icon-search" size="small">查询</el-button>
                <el-button @click="handleReset('formInline')" style="margin-left: 15px" icon="el-icon-refresh-left" size="small"
                  >重置</el-button>
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
              <p>123,456</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon2.png" class="icon" />
            <div class="counts">
              <p>审核通过单量（单）</p>
              <p>123,456</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon3.png" class="icon" />
            <div class="counts">
              <p>审核不通过单量（单）</p>
              <p>123,456</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon4.png" class="icon" />
            <div class="counts">
              <p>超时单量（单）</p>
              <p>123,456</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon5.png" class="icon" />
            <div class="counts">
              <p>审核时效（min）</p>
              <p>12</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 35px;margin-bottom: 25px;">
            维度名称：
            <Select ref="checkResult" clearable style="width: 200px;">
              <Option value="1">劳务结算单</Option>
              <Option value="2">机械租赁单</Option>
              <Option value="3">全部</Option>
            </Select>
           
        </div>

        <div class="title">机器人数据监控统计统计表</div>
       <div class="charsBox">
            <div id="charts"></div>
          </div>
      </Card>
      <!-- 中 -->
     <!--  <div class="cenCon">

        <Card style="width: 40%" class="leftCon">

          <div class="titleTop" slot="title">
            <p>审核统计结果</p>
            <div class="dataOption">
              <DatePicker
                type="daterange"
                placement="bottom-end"
                placeholder="请选择"
                style="width: 200px"
              />
            </div>
          </div>
         
          
        </Card>
        <Card style="width: 58%" class="rightCon">
          <div class="titleTop" slot="title">
            <p>预警情况总览</p>
            <div class="dataOption">
              <DatePicker
                type="daterange"
                placement="bottom-end"
                placeholder="请选择"
                style="width: 200px"
              />
            </div>
          </div>
          
          <div class="charsBox">
            <div id="secgram"></div>
          </div>
        </Card>
      </div> -->
      <!-- 下 -->
      <!-- <div class="bottomBox">
        <Card style="width: 100%" class="rightCon">
          <div class="titleTop" slot="title">
            <p>审单时长趋势</p>
            <div class="btnBox">
              <Button type="primary">上一周</Button>
              <Button type="primary" style="margin-left: 20px">下一周</Button>
            </div>
          </div>
          <div class="charsBox">
            <div id="thirdgram"></div>
          </div>
        </Card>
      </div> -->
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import store from "@/store";
export default {
  data() {
    return {
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
    };
  },
  mounted() {
    this.initChart();
    // this.histogram();
    // this.thirdChart();
  },
  created() {
    // this.query();
  },
  methods: {
    initChart() {
      let myChart = echarts.init(document.getElementById("charts"));
      let option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          legend: {
              data: ['规则数量', '机器人审单量', '预警量']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-04', '2020-01-05', '2020-01-06', '2020-01-07']
              }
          ],
          yAxis: [
              {
                  type: 'value'
              }
          ],
          series: [
              
              {
                  name: '规则数量',
                  type: 'bar',
                  stack: 'zh',
                  emphasis: {
                      focus: 'series'
                  },
                  data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                  name: '机器人审单量',
                  type: 'bar',
                  stack: 'zh',
                  emphasis: {
                      focus: 'series'
                  },
                  data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                  name: '预警量',
                  type: 'bar',
                  stack: 'zh',
                  emphasis: {
                      focus: 'series'
                  },
                  data: [150, 232, 201, 154, 190, 330, 410]
              },
             
          ]
      };

      myChart.setOption(option);
    },
    // histogram() {
    //   let secGram = echarts.init(document.getElementById("secgram"));
    //   let option = {
    //     title: {
    //       text: "预警单量",
    //     },
    //     color: ["#73c0de"],
    //     xAxis: {
    //       type: "category",
    //       data: [
    //         "一级预警",
    //         "二级预警",
    //         "三级预警",
    //         "四级预警",
    //         "五级预警",
    //         "六级预警",
    //       ],
    //     },
    //     yAxis: {
    //       type: "value",
    //     },
    //     series: [
    //       {
    //         data: [120, 200, 150, 80, 70, 110, 130],
    //         type: "bar",
    //         barWidth: 25,
    //       },
    //     ],
    //   };
    //   secGram.setOption(option);
    // },
    // thirdChart() {
    //   let thirdGrams = echarts.init(document.getElementById("thirdgram"));
    //   let option = {
    //     title: {
    //       text: "平均时长",
    //     },
    //     legend: {},
    //     tooltip: {},
    //     dataset: {
    //       dimensions: ["product", "2015", "2016", "2017"],
    //       source: [
    //         { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
    //         { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
    //         { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
    //         { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
    //       ],
    //     },
    //     xAxis: { type: "category" },
    //     yAxis: {},
    //     // Declare several bar series, each will be mapped
    //     // to a column of dataset.source by default.
    //     series: [
    //       { type: "bar", barWidth: 15 },
    //       { type: "bar", barWidth: 15 },
    //       { type: "bar", barWidth: 15 },
    //     ],
    //     color: ["#73c0de", "#91cc75", "#fac858"],
    //     yAxis: {
    //       type: "value",
    //     },
    //   };
    //   thirdGrams.setOption(option);
    // },

  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
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
