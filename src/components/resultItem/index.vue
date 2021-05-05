<template>
  <div>
    <div class="item" v-for="(item, index) in dataList" :key="index">
      <Card style="width: 100%">
        <div class="cardTit" slot="title">
          <p v-if="item.ruleType == 'IMAGES'">影像规则</p>
          <p v-if="item.ruleType == 'OTHERS'">非影像规则</p>
          <p v-if="item.ruleType == 'WARNING'">超预警通知</p>
          <div class="countBox">
            <p v-if="item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'">
              规则：{{ item.ruleCount }}条
            </p>
            <p v-if="item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'">
              报错：{{ item.errorCount }}条
            </p>
            <p v-if="item.ruleType == 'WARNING'">
              预警数：{{ item.ruleCount }}条
            </p>
          </div>
        </div>
        <el-collapse
          @change="handleChange"
          v-if="item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'"
        >
          <el-collapse-item title="未通过规则" name="1">
            <template
              v-if="
                item.result.filter((obj) => {
                  return obj.correct == false;
                }).length
              "
            >
              <Table
                size="small"
                :columns="columns"
                :data="
                  item.result.filter((obj) => {
                    return obj.correct == false;
                  })
                "
              >
                <template slot="ruleName" slot-scope="{ row }">
                  <div flex>
                    {{ row.ruleName }}
                    <Icon
                      type="md-close-circle"
                      size="18"
                      color="#E02020"
                      style="margin-left: 60%"
                    />
                  </div>
                </template>
                <template slot="message" slot-scope="{ row }">
                  {{ row.message ? row.message : "——" }}
                </template>
              </Table>
            </template>
          </el-collapse-item>
          <el-collapse-item title="通过规则" name="2">
            <template
              v-if="
                item.result.filter((obj) => {
                  return obj.correct == true;
                }).length
              "
            >
              <Table
                size="small"
                :columns="columns"
                :data="
                  item.result.filter((obj) => {
                    return obj.correct == true;
                  })
                "
              >
                <template slot="ruleName" slot-scope="{ row }">
                  <div flex>
                    {{ row.ruleName }}
                    <Icon
                      type="md-checkmark-circle"
                      size="18"
                      color="#6DD400"
                      style="margin-left: 60%"
                    />
                  </div>
                </template>
                <template slot="message" slot-scope="{ row }">
                  {{ row.message ? row.message : "——" }}
                </template>
              </Table>
            </template>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-else>
          <Table
            size="small"
            :columns="columns1"
            :data="
              item.result.filter((obj) => {
                return obj.correct == false;
              })
            "
          >
            <template slot="grade" slot-scope="{ row }">
              <div flex>{{ row.warnRank.grade }}</div>
            </template>
            <template slot="ruleName" slot-scope="{ row }">
              <div flex>
                {{ row.ruleName }}
                <Icon
                  type="ios-information-circle"
                  size="18"
                  :color="row.warnRank.color"
                  style="margin-left: 60%"
                />
              </div>
            </template>
            <template slot="message" slot-scope="{ row }">
              {{ row.message ? row.message : "——" }}
            </template>
          </Table>
        </el-collapse>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["data"],
  data() {
    return {
      dataList: [],
      columns: [
        {
          title: "序号",
          type: "index",
          width: 65,
        },
        {
          title: "规则",
          slot: "ruleName",
        },
        {
          title: "审核结果",
          slot: "message",
        },
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 65,
        },
        {
          title: "预警等级",
          slot: "grade",
          width: 90,
        },
        {
          title: "规则",
          slot: "ruleName",
        },
        {
          title: "审核结果",
          slot: "message",
        },
      ],
    };
  },
  computed: {},
  mounted() {
    this.dataList = this.data;
    // for (let i = 0; i < this.items.length; i++) {
    //   // this.openAll(i);
    //   // this.items[i].open = true;
    //   if (i == 0) {
    //     this.openAll(i);
    //     // this.items[i].open = true;
    //   } else {
    //     this.items[i].open = false;
    //   }
    // }
  },
  methods: {
    handleChange() {},
    // open(index) {
    //   this.items[index]["open"] = !this.items[index]["open"];
    //   this.$forceUpdate();
    // },
    // open02(index, ii) {
    //   this.items[index]["result"][ii]["open"] = !this.items[index]["result"][
    //     ii
    //   ]["open"];
    //   this.$forceUpdate();
    // },
    // openAll(index) {
    //   let data = this.items[index];
    //   data.open = true;
    //   if (data.result && data.result.length) {
    //     for (let i = 0; i < data.result.length; i++) {
    //       data.result[i].open = true;
    //     }
    //   }
    //   this.$forceUpdate();
    // },
    // rowClick(item) {
    //   if (item.imageData && item.imageData.length) {
    //     let ids = item.imageData.map((item) => {
    //       return item.imageId;
    //     });
    //     this.$emit("row-click", ids);
    //   }
    // },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.item {
  margin-bottom: 20px;
}
.cardTit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/deep/.ivu-card-head {
  background: #1991dd;
  p {
    color: #fff;
    font-weight: 400;
  }
}
.countBox {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>