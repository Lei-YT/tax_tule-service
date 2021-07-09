<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    console.log(
      `%c Build %c v0.95.7 %c`,
      "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
      "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
      "background:transparent"
    );
  },
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: auto;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.ivu-page-item,
.ivu-page-item-jump-next {
  display: none !important;
}
.ivu-page-prev,
.ivu-page-next {
  border: 1px solid #dcdee2 !important;
}
.ivu-page-prev a,
.ivu-page-next a {
  margin: 0 6px!important;
}
</style>
