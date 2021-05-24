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
            style="height: 200px"
            v-for="(item, index) in dataList"
            :key="index"
          >
            <p slot="title">{{ item.label }}</p>
            <Poptip :content="item.describe" placement="right" slot="extra">
              <a>描述</a>
            </Poptip>
            <div class="imgCon" @click="showRightInfo(item)">
              <img src="@/assets/images/trians.png" class="trians" />
              <span>{{ item.name }}</span>
            </div>
          </Card>
        </div>
        <!-- 右边图表 -->
        <div class="rigthCon">
          <div class="topCon">
            <Card>
              <p slot="title">Hi,{{ rightData.name }}为您服务</p>
              <div slot="title" class="titBtn">
                <Button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 1"
                  @click="handleChange(2, rightData.sceneId)"
                  >启动</Button
                >
                <Button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 2"
                  @click="handleChange(3, rightData.sceneId)"
                  >暂停</Button
                >
                <Button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 3"
                  @click="handleChange(2, rightData.sceneId)"
                  >继续</Button
                >
                <Button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 3"
                  @click="handleChange(4, rightData.sceneId)"
                  >结束</Button
                >
                <Button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 5"
                  >需人工处理</Button
                >
                <Button
                  type="primary"
                  style="margin-right: 10px"
                  v-if="rightData.status == 4"
                  @click="handleChange(1, rightData.sceneId)"
                  >重启</Button
                >
              </div>
              <div class="chartOne">
                <p>单据量统计</p>
                <!-- 审核完成/总数，审核超时/总数，审核未完成/总数，总数=三者的和。 -->
                <div class="lineBox">
                  <li
                    :style="{
                      width: `${rightData.auditCompletedNum}` + '%',
                    }"
                  >
                    {{
                      (
                        rightData.auditCompletedNum /
                        (rightData.auditCompletedNum +
                          rightData.auditFailNum +
                          rightData.auditUncompletedNum)
                      ).toFixed(2) *
                        100 +
                      "%"
                    }}
                  </li>
                  <li
                    :style="{
                      width: `${rightData.auditFailNum}` + '%',
                    }"
                  >
                    {{
                      (
                        rightData.auditFailNum /
                        (rightData.auditCompletedNum +
                          rightData.auditFailNum +
                          rightData.auditUncompletedNum)
                      ).toFixed(2) *
                        100 +
                      "%"
                    }}
                  </li>
                  <li
                    :style="{
                      width: `${rightData.auditUncompletedNum}` + '%',
                    }"
                  >
                    {{
                      (
                        rightData.auditUncompletedNum /
                        (rightData.auditCompletedNum +
                          rightData.auditFailNum +
                          rightData.auditUncompletedNum)
                      ).toFixed(2) *
                        100 +
                      "%"
                    }}
                  </li>
                </div>
                <div class="colorBox">
                  <div class="itemCor">
                    <p class="corBlock"></p>
                    <p>审核完成单据（{{ rightData.auditCompletedNum }}单）</p>
                  </div>
                  <div class="itemCor">
                    <p class="corBlock"></p>
                    <p>审核超时单据（{{ rightData.auditFailNum }}单）</p>
                  </div>
                  <div class="itemCor">
                    <p class="corBlock"></p>
                    <p>
                      审核未完成单据（{{ rightData.auditUncompletedNum }}单）量
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div class="downCon">
            <Card style="width: 49%">
              <div id="myChartTwo" style="height: 500px"></div>
            </Card>
            <Card style="width: 49%">
              <div id="myChartThr" style="height: 500px"></div>
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
import process from "@/dataJson/process.json";
import echarts from "echarts";
import {
  homelist, // 列表
  changeStatus, // 改变状态
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
      rightData: [],
      leftData: [],
      rightItem: [],
      cur: 0,
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
  created() {
    // this.dataList = process.data;
    // this.rightData = process.data[0];
    // this.getData(process.data[0]);
    this.query();
    this.timer = setInterval(() => {
      this.query();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  mounted() {
    this.$nextTick(() => {
      this.getCharts();
    });
  },
  methods: {
    showRightInfo(item) {
      this.rightData = item;
      this.getData(item);
    },
    getChartTwo() {
      let myChartTwo = echarts.init(document.getElementById("myChartTwo"));
      myChartTwo.clear();
      myChartTwo.setOption({
        title: {
          text: "统计结果",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        color: ["#1991DD", "#f7b500"],
        legend: {
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
                position: "inner", //标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16, //文字的字体大小
                },
                formatter: "{d}%",
                color: "#ffffff",
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
        title: {
          text: "人机协同统计",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        color: ["#1991DD", "#F7B500", "#70B822"],
        legend: {
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
      homelist({ secneName: this.secneName, id: this.id }).then((res) => {
        if (res.data.code == 0) {
          this.dataList = res.data.data;
          this.rightData = res.data.data[0];
          this.getData(res.data.data[0]);
        }
      });
    },
    handleChange(status, sceneId) {
      changeStatus({ status, sceneId }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1500,
          });
          this.query();
        }
      });
    },
    getCharts() {
      this.getChartTwo();
      this.getChartThr();
    },
    getData(data) {
      this.leftData = [];
      this.rightItem = [];
      let obj1 = {};
      obj1.value = data.completedNum;
      obj1.name = "已完成单据";
      let obj2 = {};
      obj2.value = data.failNum;
      obj2.name = "超时单据";
      this.leftData.push(obj1, obj2);
      let obj3 = {};
      obj3.value = data.auditCompletedNum;
      obj3.name = "机器人审核";
      let obj4 = {};
      obj4.value = data.manmade;
      obj4.name = "人工";
      let obj5 = {};
      obj5.value = data.auditFailNum;
      obj5.name = "其他";
      this.rightItem.push(obj3, obj4, obj5);
      this.getCharts();
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
    margin-bottom: 10px;
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
