<template>
  <div class="wraps">
    <!-- tab切换 -->
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
    <!-- 内容区 -->
    <div class="conBox">
      <!-- 控制台 -->
      <div class="conOne" v-if="cur == 0">
        <!-- 左边内容 -->
        <div class="leftCon">
          <Card
            :class="item.status == 2 ? 'curCard' : ''"
            v-for="(item, index) in dataList"
            :key="index"
          >
            <p slot="title">{{ item.label }}</p>
            <Poptip :content="item.describe" placement="right" slot="extra">
              <a>描述</a>
            </Poptip>
            <div class="imgCon" @click="showRightInfo(item, index)">
              <img src="@/assets/images/trians.png" class="trians" />
              <div class="nameText" v-if="item.status == 1">
                {{ item.name }}<span style="color: #1991dd">（未启动）</span>
              </div>
              <div class="nameText" v-if="item.status == 2">
                {{ item.name }}<span style="color: #f7b500">（进行中）</span>
              </div>
              <div class="nameText" v-if="item.status == 3">
                {{ item.name }}<span style="color: #f7b500">（暂停）</span>
              </div>
              <div class="nameText" v-if="item.status == 4">
                {{ item.name }}<span style="color: #1991dd">（结束）</span>
              </div>
              <div class="nameText" v-if="item.status == 5">
                {{ item.name }}<span style="color: #999">（异常停止）</span>
              </div>
            </div>
          </Card>
        </div>
        <!-- 右边图表 -->
        <div class="rigthCon">
          <div class="topCon">
            <Card style="width: 100%">
              <p slot="title">Hi,{{ rightData.name }}为您服务</p>
              <div slot="title" class="titBtn">
                <el-button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 1"
                  @click="handleChange(2, rightData.sceneId)"
                  >启动</el-button
                >
                <el-button
                  type="warning"
                  style="margin-right: 10px"
                  v-if="rightData.status == 2"
                  @click="handleChange(3, rightData.sceneId)"
                  >暂停</el-button
                >
                <el-button
                  type="success"
                  style="margin-right: 10px"
                  v-if="rightData.status == 3"
                  @click="handleChange(2, rightData.sceneId)"
                  >继续</el-button
                >
                <el-button
                  type="info"
                  style="margin-right: 10px"
                  v-if="rightData.status == 3"
                  @click="handleChange(4, rightData.sceneId)"
                  >结束</el-button
                >
                <el-button
                  type="info"
                  style="margin-right: 10px"
                  v-if="rightData.status == 5"
                  >需人工处理</el-button
                >
                <el-button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 4"
                  @click="handleReboot(rightData.sceneId)"
                  >重启</el-button
                >
              </div>
              <div class="chartOne">
                <div id="countChart" style="width: 100%; height: 260px"></div>
              </div>
            </Card>
          </div>
          <div class="downCon">
            <Card style="width: 49%">
              <div id="myChartTwo" style="width: 100%; height: 500px"></div>
            </Card>
            <Card style="width: 49%">
              <div id="myChartThr" style="width: 100%; height: 500px"></div>
            </Card>
          </div>
        </div>
      </div>
      <!-- 信息管理 -->
      <div class="conTwo" v-if="cur == 1">
        <InfoManage></InfoManage>
      </div>
      <!-- 操作日志 -->
      <div class="conThr" v-if="cur == 2">
        <OperationLog></OperationLog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
import { localSave, localRead } from "@/libs/util";
import {
  homelist, // 列表
  changeStatus, // 改变状态
  reboot,
} from "@/api/user";
import InfoManage from "./components/InfoManage";
import OperationLog from "./components/OperationLog";
export default {
  components: {
    InfoManage,
    OperationLog,
  },
  data() {
    return {
      secneName: "",
      id: "",
      dataList: [],
      sort: [],
      rightData: {},
      leftData: localRead("leftPie") ? JSON.parse(localRead("leftPie")) : [],
      rightItem: localRead("rightPie") ? JSON.parse(localRead("rightPie")) : [],
      chartsDate: localRead("countChart")
        ? JSON.parse(localRead("countChart"))
        : {},
      robotId: null,
      cur: 0,
      cardIdx: 0,
      timer: null, // 定时器
      tabList: [
        {
          type: "控制台",
        },
        {
          type: "信息管理",
        },
        {
          type: "操作日志",
        },
      ],
    };
  },
  created() {},
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  mounted() {
    this.getCharts();
    this.query();
    this.timer = setInterval(() => {
      this.query();
    }, 1800000);
  },
  methods: {
    showRightInfo(item, index) {
      this.cardIdx = index;
      this.rightData = item;
      this.robotId = item.id;
      this.getData(item);
      this.getChartsData(item.id);
    },
    getChartTwo() {
      let myChartTwo = echarts.init(document.getElementById("myChartTwo"));
      myChartTwo.clear();
      myChartTwo.setOption({
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: "auto",
          height: "auto",
        },
        title: {
          text: "统计结果",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        color: ["#70B822", "#1991DD", "#F7B500"],
        legend: {
          icon: "circle",
          orient: "vertical",
          bottom: "bottom",
          right: "right",
        },
        series: [
          {
            name: "统计结果",
            type: "pie",
            radius: "50%",
            data: [...this.leftData],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                show: true,
                // position: "inner", //标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16, //文字的字体大小
                },
                formatter: "{d}%",
                // color: "#ffffff",
              },
            },
          },
        ],
      });
    },
    getChartThr() {
      let myChartThr = echarts.init(document.getElementById("myChartThr"));
      myChartThr.clear();
      myChartThr.setOption({
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: "auto",
          height: "auto",
        },
        title: {
          text: "人机协同统计",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        color: ["#70B822", "#1991DD", "#F7B500"],
        legend: {
          icon: "circle",
          orient: "vertical",
          bottom: "bottom",
          right: "right",
          selectedMode: false,
        },
        series: [
          {
            name: "人机协同统计",
            type: "pie",
            radius: ["35%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "outer",
              formatter: "{d}%\n\n",
              borderWidth: 20,
              borderRadius: 4,
              padding: [50, -50],
            },
            data: [...this.rightItem],
            labelLine: {
              show: true,
              length: 30,
              length2: 50,
            },
          },
        ],
      });
    },
    changeCur(index) {
      this.cur = index;
    },
    query() {
      const _this = this;
      homelist({ secneName: _this.secneName, id: _this.id }).then((res) => {
        if (res.data.code == 0) {
          _this.dataList = res.data.data;
          _this.robotId = res.data.data[0].id;
          _this.rightData = res.data.data[0];
          _this.getChartsData(res.data.data[0].id);
          _this.getData(res.data.data[0]);
        }
      });
    },
    getChartsData(id) {
      let _this = this;
      axios
        .get(`http://10.15.196.127:7070/bill/robot?robotId=${id}`, {})
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            // _this.chartsDate = data.data;
            const sum = Object.values(data.data).reduce(
              (acc, val) => acc + val
            );
            const percent = {};
            Object.keys(data.data).map((key) => {
              percent[`${key}P`] = ((data.data[key] / sum) * 100).toFixed(2);
            });
            percent.completedP = (
              ((data.data.success + data.data.fail) / sum) *
              100
            ).toFixed(2);
            _this.chartsDate = Object.assign(data.data, percent);
            localSave("countChart", JSON.stringify(_this.chartsDate));
            _this.renderCountChart();
            _this.getLeftData(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    renderCountChart() {
      const _this = this;
      let countChart = echarts.init(document.getElementById("countChart"));
      countChart.clear();
      countChart.setOption({
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        title: {
          text: "单据量统计",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        color: ["#70B822", "#1991DD", "#F7B500"],
        legend: {
          icon: "circle",
          orient: "vertical",
          bottom: "bottom",
          right: "right",
          selectedMode: false,
          borderRadius: 50,
        },
        xAxis: {
          show: false,
          type: "value",
          boundaryGap: [0, 0],
        },
        yAxis: [
          {
            type: "category",
            data: [""],
            axisLine: { show: false },
            axisTick: [
              {
                show: false,
              },
            ],
          },
        ],
        series: [
          {
            name: "",
            type: "bar",
            name: `审核完成单据（${
              _this.chartsDate.success + _this.chartsDate.fail
            }单）`,
            stack: "总量",
            // barMaxWidth: 20,
            barWidth: 35,
            label: {
              show: _this.chartsDate.success + _this.chartsDate.fail > 0,
              position:
                Number(_this.chartsDate.completedP) > 5 ? "inside" : "top",
              offset: [20, 0],
              formatter: "{c}%",
            },
            itemStyle: {
              barBorderRadius: [0, 0, 0, 0],
            },
            data: [_this.chartsDate.completedP],
            tooltip: {
              formatter: "{a}<br>{c}%",
            },
          },
          {
            name: "",
            type: "bar",
            name: `审核超时单据（${_this.chartsDate.timeout}单）`,
            stack: "总量",
            // barMaxWidth: 20,
            barWidth: 35,
            label: {
              show: _this.chartsDate.timeout > 0,
              position:
                Number(_this.chartsDate.timeoutP) > 5 ? "inside" : "top",
              offset: [-15, 0],
              formatter: "{c}%",
            },
            itemStyle: {
              barBorderRadius: [0, 0, 0, 0],
            },
            data: [_this.chartsDate.timeoutP],
            tooltip: {
              formatter: "{a}<br>{c}%",
            },
          },
          {
            name: "",
            type: "bar",
            name: `审核未完成单据（${_this.chartsDate.checking}单）`,
            stack: "总量",
            // barMaxWidth: 20,
            barWidth: 35,
            label: {
              show: _this.chartsDate.checking > 0,
              position:
                Number(_this.chartsDate.checkingP) > 5 ? "inside" : "bottom",
              offset: [-15, 0],
              formatter: "{c}%",
            },
            itemStyle: {
              barBorderRadius: [0, 0, 0, 0],
            },
            data: [_this.chartsDate.checkingP],
            tooltip: {
              formatter: "{a}<br>{c}%",
            },
          },
        ],
      });
    },
    getLeftData(data) {
      let _this = this;
      _this.leftData = [];
      let obj1 = {};
      obj1.value = data.success;
      obj1.name = "通过";
      let obj2 = {};
      obj2.value = data.fail;
      obj2.name = "不通过";
      let obj6 = {};
      obj6.value = data.timeout;
      obj6.name = "超时";
      _this.leftData.push(obj1, obj2, obj6);
      localSave("leftPie", JSON.stringify(_this.leftData));
      _this.getChartTwo();
    },
    getData(data) {
      this.rightItem = [];
      let obj3 = {};
      obj3.value = data.completedNum;
      obj3.name = "机器人审核";
      let obj4 = {};
      obj4.value = data.manmade;
      obj4.name = "转人工";
      let obj5 = {};
      obj5.value = data.failNum;
      obj5.name = "超时";
      this.rightItem.push(obj3, obj4, obj5);
      localSave("rightPie", JSON.stringify(this.rightItem));
      this.getChartThr();
    },
    handleChange(status, sceneId) {
      let _this = this;
      changeStatus({ status, sceneId }).then((res) => {
        if (res.data.code == 0) {
          _this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1500,
          });
          _this.query();
        } else {
          _this.$notify({
            type: "warning",
            title: "失败",
            message: res.data.msg,
            duration: 1500,
          });
        }
      });
    },
    handleReboot(sceneId) {
      let _this = this;
      reboot({ sceneId }).then((res) => {
        if (res.data.code == 0) {
          _this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1500,
          });
          _this.query();
        } else {
          _this.$notify({
            type: "warning",
            message: res.data.msg,
            duration: 1500,
          });
        }
      });
    },
    getCharts() {
      this.getChartTwo();
      this.getChartThr();
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
.logProcess {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  display: none;
}
.conBox {
  width: 100%;
  height: 100%;
}
.conOne {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .leftCon {
    width: 18%;
    cursor: pointer;
  }
  .rigthCon {
    width: 81%;
    display: flex;
    flex-direction: column;
    .topCon {
      width: 100%;
    }
  }
}
/deep/.ivu-card-head {
  display: flex;
}
.titBtn {
  display: flex;
}
.downCon {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.chartOne {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #333;
  font-weight: 500;
  > p {
    width: 100%;
    text-align: left;
  }
  .lineBox {
    width: 100%;
    height: 35px;
    margin: 22px 0 63px 0;
    box-sizing: border-box;
    display: flex;
    li {
      list-style: none;
      height: 100%;
      text-align: center;
      line-height: 35px;
      color: #fff;
      font-size: 24px;
    }
    li:nth-child(1) {
      background: #1991dd;
    }
    li:nth-child(2) {
      background: #f7b500;
    }
    li:nth-child(3) {
      background: #70b822;
    }
  }
  .colorBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .itemCor {
      display: flex;
      align-items: center;
      margin: 0 10px;
      .corBlock {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .itemCor:nth-child(1) .corBlock {
      background: #1991dd;
    }
    .itemCor:nth-child(2) .corBlock {
      background: #f7b500;
    }
    .itemCor:nth-child(3) .corBlock {
      background: #70b822;
    }
  }
}

.imgCon {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #333;
  .trians {
    width: 63px;
    height: 76px;
    margin-bottom: 20px;
  }
}
.ivu-card {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.top {
  width: 100%;
  display: flex;
  .trian {
    width: 20px;
    height: 24px;
  }
  span {
    color: #333;
    font-weight: 600;
    margin-left: 10px;
  }
}
.statusBox {
  display: flex;
  align-items: center;
  margin: 15px 0;
  .status,
  .service {
    color: #333;
    font-weight: 600;
    .result {
      color: #999;
    }
  }
  .service {
    margin-left: 8%;
  }
}
.situation {
  > p {
    width: 100%;
    color: #333;
    font-weight: 600;
  }
  .list {
    display: flex;
    align-items: center;
    .left {
      width: 65%;
      .itemCon {
        display: flex;
        align-items: center;
        line-height: 2.3;
        > p {
          width: 20%;
        }
        .el-progress {
          flex: 1;
        }
        /deep/ .el-progress-bar {
          width: 95%;
        }
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > p {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
