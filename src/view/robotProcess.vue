<template>
  <div class="wraps">
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
                    (
                      (item.completedNum + item.uncompletedNum + item.failNum)==0?0:
                      (item.completedNum /
                        (item.completedNum +
                          item.uncompletedNum +
                          item.failNum)) *
                      100
                    ).toFixed(2)-0
                  "
                ></el-progress>
              </div>
              <div class="itemCon">
                <p>未完成：</p>
                <el-progress
                  :percentage="
                    (
                      (item.completedNum + item.uncompletedNum + item.failNum)==0?0:
                      (item.uncompletedNum /
                        (item.completedNum +
                          item.uncompletedNum +
                          item.failNum)) *
                      100
                    ).toFixed(2)-0
                  "
                ></el-progress>
              </div>
              <div class="itemCon">
                <p>失效：</p>
                <el-progress
                  :percentage="
                    (
                      (item.completedNum + item.uncompletedNum + item.failNum)==0?0:
                      (item.failNum /
                        (item.completedNum +
                          item.uncompletedNum +
                          item.failNum)) *
                      100
                    ).toFixed(2)-0
                  "
                ></el-progress>
              </div>
            </div>
            <div class="right">
              <p>成功率</p>
              <el-progress
                type="circle"
                :percentage="
                  (
                    (item.completedNum + item.failNum)==0?0:
                    (item.completedNum / (item.completedNum + item.failNum)) *
                    100
                  ).toFixed(2)-0
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
import {
  homelist, // 列表
  changeStatus, // 改变状态
} from "@/api/user";
export default {
  data() {
    return {
      secneName: "",
      dataList: [],
      timer: null  // 定时器
    };
  },
  created() {
    this.query();
    this.timer = setInterval(() =>{                    
      this.query();               
    }, 10000);     
    
  },
  beforeDestroy() {
    clearInterval(this.timer);        
    this.timer = null;
  },
  methods: {
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
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.logProcess {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
