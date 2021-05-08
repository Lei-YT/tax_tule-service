<template>
  <div v-cloak>
    <div class="wrap" flex="dir:top" ref="viewer" :style="{width:width,height:height}">
      <div class="viewer">
        <lcImageViewer
          :image="image"
          :width="width"
          :height="viewerHeight+'px'"
        />
      </div>
      <div class="scroll-box">
        <div :style="{width:scrollWidth}">
          <div class="scroll-item" :style="currentIndex==index?'background:#86a9eb':''" v-for="(vo,index) in images" :key="index">
            <Tag @click.native="change(vo,index)" class="error" color="error" v-if="vo.isError=='yes'">错</Tag>
            <img @click="change(vo,index)" :src="vo.smallimage" style="width:80px;height:50px;display:block" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lcImageViewer from "./lc-image-viewer.vue";
export default {
  components: { lcImageViewer },
  props: {
    images: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: String,
      default: "500px"
    },
    height: {
      type: String,
      default: "300px"
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scrollWidth: "",
      offsetWidth: null,
      viewerHeight: null,
      currentIndex:this.index,
      image:'',
      imageList:this.images
    };
  },
  mounted() {
    let _this = this;
    this.inits()
    this.$nextTick(function() {
      _this.offsetWidth = this.$refs.viewer.offsetWidth;
      _this.viewerHeight = this.$refs.viewer.offsetHeight - 80;
      _this.scrollWidth = _this.images.length * 90 + "px";
    });
  },
  methods:{
    inits(){
        let _this = this;
        _this.image = _this.imageList[_this.currentIndex]['bigImage']
    },
    change(vo,index){
      this.currentIndex = index
      this.image = vo.bigImage
      this.$emit('on-change',{
        vo:vo,
        index:index
      })
    }
  }
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
.wrap {
  position: relative;
}
.viewer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 80px;
  overflow: hidden;
}
.scroll-box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 0 0 0;
  height: 80px;
  /* background-color: #eee; */
  overflow-x: auto;
  overflow-y: hidden;
}
.scroll-box .scroll-item {
  position: relative;
  float: left;
  padding:5px;
  cursor: pointer;
}
.scroll-box .scroll-item .error{
  position: absolute;
  right:5px;
  top:5px
}

.scroll-box::-webkit-scrollbar {
  /*滚动条整体样式*/
  height: 6px;
}
.scroll-box::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.scroll-box::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
</style>
