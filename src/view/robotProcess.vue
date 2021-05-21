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
          <Card style="height: 200px">
            <p slot="title">取单回传机器人</p>
            <Poptip content="提示内容" placement="right" slot="extra">
              <a>描述</a>
            </Poptip>
            <div class="imgCon">
              <img src="@/assets/images/trians.png" class="trians" />
              <span>小铁1号</span>
            </div>
          </Card>
          <Card>
            <p slot="title">取单回传机器人</p>
            <Poptip content="提示内容" placement="right" slot="extra">
              <a>描述</a>
            </Poptip>
            <div class="imgCon">
              <img src="@/assets/images/trians.png" class="trians" />
              <span>小铁1号</span>
            </div>
          </Card>
        </div>
        <!-- 右边图表 -->
        <div class="rigthCon">
          <div class="topCon">
            <Card>
              <p slot="title">Hi,小铁1号为您服务</p>
              <div slot="title" class="titBtn">
                <Button type="primary" style="margin-right: 10px">暂停</Button>
                <Button type="primary">启动</Button>
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

    <div class="logProcess">
      <Card style="width: 49%" v-for="(item, index) in dataList" :key="index">
        <div class="top">
          <img src="@/assets/images/trian.png" class="trian" />
          <span>{{ item.name }}</span>
        </div>
        <div class="statusBox">
          <div class="status">
            当前状态：<span class="result">{{
              item.status == 1
                ? "未开始"
                : item.status == 2
                ? "正常运行"
                : item.status == 3
                ? "已暂停"
                : item.status == 4
                ? "已完成"
                : "异常停止"
            }}</span>
          </div>
          <div class="service">
            启停服务：
            <el-button
              size="small"
              type="primary"
              v-if="item.status == 1"
              @click="handleChange(2, item.sceneId)"
              >开始</el-button
            >
            <el-button
              size="small"
              style="margin-left: 20px"
              v-if="item.status == 2"
              @click="handleChange(3, item.sceneId)"
              >暂停</el-button
            >
            <el-button
              size="small"
              style="margin-left: 20px"
              type="primary"
              v-if="item.status == 3"
              @click="handleChange(2, item.sceneId)"
              >继续</el-button
            >
            <el-button
              size="small"
              style="margin-left: 20px"
              v-if="item.status == 3"
              @click="handleChange(4, item.sceneId)"
              >结束</el-button
            >
            <el-button size="small" type="info" v-if="item.status == 4"
              >结束</el-button
            >
            <el-button
              size="small"
              type="warning"
              v-if="item.status == 5"
              @click="handleChange(item.status, item.sceneId)"
              >需人工处理</el-button
            >
          </div>
        </div>
        <div class="situation">
          <p>统计完成情况：</p>
          <div class="list">
            <div class="left">
              <div class="itemCon">
                <p>已完成：</p>
                <el-progress
                  :percentage="
                    (item.completedNum + item.uncompletedNum + item.failNum == 0
                      ? 0
                      : (item.completedNum /
                          (item.completedNum +
                            item.uncompletedNum +
                            item.failNum)) *
                        100
                    ).toFixed(2) - 0
                  "
                ></el-progress>
              </div>
              <div class="itemCon">
                <p>未完成：</p>
                <el-progress
                  :percentage="
                    (item.completedNum + item.uncompletedNum + item.failNum == 0
                      ? 0
                      : (item.uncompletedNum /
                          (item.completedNum +
                            item.uncompletedNum +
                            item.failNum)) *
                        100
                    ).toFixed(2) - 0
                  "
                ></el-progress>
              </div>
              <div class="itemCon">
                <p>失效：</p>
                <el-progress
                  :percentage="
                    (item.completedNum + item.uncompletedNum + item.failNum == 0
                      ? 0
                      : (item.failNum /
                          (item.completedNum +
                            item.uncompletedNum +
                            item.failNum)) *
                        100
                    ).toFixed(2) - 0
                  "
                ></el-progress>
              </div>
            </div>
            <div class="right">
              <p>成功率</p>
              <el-progress
                type="circle"
                :percentage="
                  (item.completedNum + item.failNum == 0
                    ? 0
                    : (item.completedNum / (item.completedNum + item.failNum)) *
                      100
                  ).toFixed(2) - 0
                "
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  homelist, // 列表
  changeStatus, // 改变状态
} from "@/api/user";
import InfoManage from './components/InfoManage'
import OperationLog from './components/OperationLog'
export default {
  components: {
    InfoManage,
    OperationLog
  },
  data() {
    return {
      secneName: "",
      dataList: [],
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
        color: ["#73c0de", "#fac858"],
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
            data: [
              { value: 1048, name: "已完成单据" },
              { value: 735, name: "超时单据" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
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
        color: ["#73c0de", "#fac858", "#91cc75"],
        legend: {
          orient: "vertical",
          bottom: "bottom",
          right: "right",
        },
        series: [
          {
            name: "人机协同统计",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            data: [
              { value: 1048, name: "机器人审核" },
              { value: 735, name: "人工" },
              { value: 355, name: "其他" },
            ],
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
          },
        ],
      });
    },
    changeCur(index) {
      this.cur = index;
    },
    query() {
      homelist({ secneName: this.secneName }).then((res) => {
        if (res.data.code == 0) {
          this.dataList = res.data.data;
        }
      });

      // this.dataList = [
      //   {
      //       "id": 334,
      //       "sceneId": "334",
      //       "completedNum": 6,
      //       "uncompletedNum": 2,
      //       "failNum": 9,
      //       "status": 1,
      //       "created_at": "2020-11-07 17:18:01",
      //       "updated_at": "2020-11-07 17:18:01",
      //       "deleted_at": null,
      //       "machineId": 1,
      //       "sceneNo": 2,
      //       "name": "小铁-1",
      //       "ip": "10.15.196.130",
      //       "isEnable": 0
      //   },
      //   {
      //       "id": 330,
      //       "sceneId": "330",
      //       "completedNum": 1,
      //       "uncompletedNum": 0,
      //       "failNum": 1,
      //       "status": 4,
      //       "created_at": "2020-10-30 08:37:18",
      //       "updated_at": "2020-11-07 17:18:01",
      //       "deleted_at": null,
      //       "machineId": 1,
      //       "sceneNo": 1,
      //       "name": "小铁-2",
      //       "ip": "10.15.196.130",
      //       "isEnable": 0
      //   }
      // ]
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
  // color: #91cc75;
}
.conOne {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .leftCon {
    width: 18%;
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
