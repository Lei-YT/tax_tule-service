<template>
  <div class="wraps">
    <Card :bordered="false">
      <div class="tabBox">
        <div class="tabList">
          <p
            v-for="item in tabList"
            :class="cur == item.type ? 'cur' : ''"
            :key="item.type"
            @click="changeCur(item.type)"
          >
            {{ item.type }}
          </p>
        </div>
      </div>
      <div v-show="cur === '纠偏影像库'">
        <samples-lib />
      </div>
      <div v-show="cur === '新增影像'">
        <samples-new />
      </div>
      <div v-show="cur === '影像训练记录'">
        <samples-training-log />
      </div>
    </Card>
  </div>
</template>

<script>
import SamplesLib from "./components/samplesLib.vue";
import SamplesNew from "./components/samplesNew.vue";
import SamplesTrainingLog from "./components/samplesTrainingLog.vue";
export default {
  components: {
    SamplesLib,
    SamplesNew,
    SamplesTrainingLog,
  },
  data() {
    return {
      cur: "",
      tabList: [
        { type: "纠偏影像库" },
        { type: "新增影像" },
        { type: "影像训练记录" },
      ],
    };
  },
  mounted() {
    this.changeCur(this.tabList[0].type);
  },
  methods: {
    changeCur(name) {
      this.cur = name;
    },
  },
};
</script>

<style lang="less" scoped>
.tabBox {
  width: 100%;
  // height: 66px;
  margin-bottom: 20px;
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
    .cur {
      color: #1991dd;
      border-bottom: 2px solid #1991dd;
    }
  }
}
.curCard {
  box-shadow: 0 0 0 2px rgba(6, 116, 243, 0.856);
}
</style>
