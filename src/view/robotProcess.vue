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
            <el-button size="small" type="primary" v-if="item.status == 1"
              >开始</el-button
            >
            <el-button
              size="small"
              style="margin-left: 20px"
              v-if="item.status == 2"
              >暂停</el-button
            >
            <el-button
              size="small"
              style="margin-left: 20px"
              type="primary"
              v-if="item.status == 3"
              >继续</el-button
            >
            <el-button
              size="small"
              style="margin-left: 20px"
              v-if="item.status == 3"
              >结束</el-button
            >
            <el-button size="small" type="info" v-if="item.status == 4"
              >结束</el-button
            >
            <el-button size="small" type="warning" v-if="item.status == 5"
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
                <el-progress :percentage="item.completedNum"></el-progress>
              </div>
              <div class="itemCon">
                <p>未完成：</p>
                <el-progress :percentage="item.uncompletedNum"></el-progress>
              </div>
              <div class="itemCon">
                <p>失效：</p>
                <el-progress :percentage="item.failNum"></el-progress>
              </div>
            </div>
            <div class="right">
              <p>成功率</p>
              <el-progress
                type="circle"
                :percentage="
                  item.completedNum / (item.completedNum + item.failNum)
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
import process from "@/dataJson/process.json";
import store from "@/store";
export default {
  data() {
    return {
      secneName: "",
      dataList: [],
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      let params = {
        // id: store.state.user.id,
        secneName: this.secneName.replace(/\s*/g, "") || "",
      };
      if (process.code == 0) {
        let data = process.data;
        this.dataList = data;
      }
      // selectCompanyList(params).then((res) => {
      //   let data = res.data;
      //   if (data.code === 200) {
      //     let showData = data.data;
      //     this.tableData = showData.list;
      //     this.page.totalElement = showData.total;
      //     this.page.size = showData.pageSize;
      //   }
      // });
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
          width: 15%;
        }
        .el-progress {
          flex: 1;
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
