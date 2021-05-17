<template>
  <div class="wraps">
    <div class="dataMonitor">
      <!-- 上 -->
      <Card style="width: 100%" class="topCount">
        <div class="title">本月统计</div>
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
      </Card>
      <!-- 中 -->
      <div class="cenCon">
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
          <!-- 圆环 -->
          <div class="charsBox">
            <div id="charts"></div>
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
          <!-- 柱状 -->
          <div class="charsBox">
            <div id="secgram"></div>
          </div>
        </Card>
      </div>
      <!-- 下 -->
      <div class="bottomBox">
        <Card style="width: 100%" class="rightCon">
          <div class="titleTop" slot="title">
            <p>审单时长趋势</p>
            <div class="btnBox">
              <Button type="primary">上一周</Button>
              <Button type="primary" style="margin-left: 20px">下一周</Button>
            </div>
          </div>
          <!-- 柱状 -->
          <div class="charsBox">
            <div id="thirdgram"></div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import store from '@/store'
export default {
  data () {
    return {
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10 // 每页显示多少条
      }
    }
  },
  mounted () {
    this.initChart()
    this.histogram()
    this.thirdChart()
  },
  created () {
    // this.query();
  },
  methods: {
    initChart () {
      let myChart = echarts.init(document.getElementById('charts'))
      let option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        color: ['#73c0de', '#91cc75', '#fac858'],
        series: [
          {
            type: 'pie',
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '通过' },
              { value: 735, name: '不通过' },
              { value: 580, name: '超时' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    histogram () {
      let secGram = echarts.init(document.getElementById('secgram'))
      let option = {
        title: {
          text: '预警单量'
        },
        color: ['#73c0de'],
        xAxis: {
          type: 'category',
          data: [
            '一级预警',
            '二级预警',
            '三级预警',
            '四级预警',
            '五级预警',
            '六级预警'
          ]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: 25
          }
        ]
      }
      secGram.setOption(option)
    },
    thirdChart () {
      let thirdGrams = echarts.init(document.getElementById('thirdgram'))
      let option = {
        title: {
          text: '平均时长'
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '2015', '2016', '2017'],
          source: [
            { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
            { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
            { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
            { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar', barWidth: 15 },
          { type: 'bar', barWidth: 15 },
          { type: 'bar', barWidth: 15 }
        ],
        color: ['#73c0de', '#91cc75', '#fac858'],
        yAxis: {
          type: 'value'
        }
      }
      thirdGrams.setOption(option)
    }
  }
}
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
