<template>
  <div class="imgBox" v-cloak>
    <div class="leftImg">
      <ImageViewer :image="imageUrl" :width="width" :height="height" />
    </div>
   <!--  <div class="rightImg">
      <img
        :src="vo.imageURL"
        class="smallImg"
        v-for="(vo, index) in items"
        :key="index"
        @click="handelImage(index, vo)"
      />
    </div> -->
  </div>
</template>

<script>
import ImageViewer from "./image-viewer.vue";
export default {
  components: { ImageViewer },
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      bs: null,
      imageUrl: "",
      imageIndex: 0,
    };
  },
  computed: {},
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      _this.initImage();
    });
  },
  methods: {
    handelImage(index, vo) {
      this.imageUrl = vo.imageURL;
      this.imageIndex = index;
      this.$emit("on-change", {
        index: index,
        imageId: vo.imageId,
        imageUrl: vo.imageUrl,
        invoiceId: vo.ocrResult[0].invoiceId,
        items: vo,
      });
    },
    initImage() {
      this.imageUrl = this.items[0]["imageURL"];
      this.imageIndex = 0;
    },
  },
  watch: {
    items() {
      this.initImage();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
// [v-cloak] {
//   display: none;
// }
.imgBox {
  width: 100%;
  height: 450px;
  display: flex;
  .leftImg {
    width: 80%;
    border: 0;
    position: relative;
    .bigImg {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  .rightImg {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .smallImg {
      width: 100%;
      height: 85px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .smallImg:last-child {
      margin-bottom: 0;
    }
  }
}
.box {
  position: relative;
  border-bottom: #ddd 1px solid;
  padding: 0 120px 0 0;
  /* background-color: #f9f9f9; */
}
.image-scroll {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 120px;
  background-color: #f9f9f9;
  border-left: #eee 1px solid;
}
.all-button {
  border-bottom: #eee 1px solid;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: #fff;
}
.scroll-wrapper {
  position: absolute;
  right: 0;
  top: 30px;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
.scroll-item {
  position: relative;
  padding: 3px;
  border-bottom: #eee 1px solid;
}
.scroll-item .index {
  position: absolute;
  right: 5px;
  top: 5px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
</style>