<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu
      ref="menu"
      v-show="!collapsed"
      :active-name="activeName"
      :open-names="openedNames"
      width="auto"
      @on-select="handleSelect"
    >
      <!-- :accordion="accordion" -->
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <side-menu-item
            v-if="showChildren(item)"
            :key="`menu-${item.name}`"
            :parent-item="item"
          ></side-menu-item>
          <menu-item
            v-else
            :name="getNameOrHref(item, true)"
            :key="`menu-${item.children[0].name}`"
            ><common-icon :type="item.children[0].icon || ''" :size="15" /><span>{{
              showTitle(item.children[0])
            }}</span></menu-item
          >
        </template>
        <template v-else>
          <side-menu-item
            v-if="showChildren(item)"
            :key="`menu-${item.name}`"
            :parent-item="item"
          ></side-menu-item>
          <menu-item
            v-else
            :name="getNameOrHref(item)"
            :key="`menu-${item.name}`"
            ><common-icon :type="item.icon || ''" :size="15" /><span>{{
              showTitle(item)
            }}</span></menu-item
          >
        </template>
      </template>
    </Menu>
    <Row v-show="!collapsed" :gutter="16" style="margin: 0">
      <Col v-if="hasPerm('rule')"  span="12" flex="main:center cross:center">
        <div flex="dir:top main:center" class="external-link-box">
          <img src="@/assets/images/engine.svg" />
          <div>规则引擎</div>
          <a
            href="http://10.15.196.127/"
            target="_blank"
            rel="nofollow"
            class="link-button_white"
            >点击进入链接页面</a
          >
        </div>
      </Col>
      <Col v-if="hasPerm('rpa')"  span="12">
        <div flex="dir:top cross:center" class="external-link-box">
          <img src="@/assets/images/robot.svg" />
          <div>RPA编辑器</div>
          <a href="LCRPAProject://" class="link-button_white">点击进入链接页面</a>
        </div></Col
      >
    </Row>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu
          v-if="item.children"
          @on-click="handleSelect"
          hide-title
          :root-icon-size="rootIconSize"
          :icon-size="iconSize"
          :theme="theme"
          :parent-item="item"
          :key="`drop-menu-${item.name}`"
        ></collapsed-menu>
        <Tooltip
          transfer
          v-else
          :content="
            showTitle(
              item.children && item.children[0] ? item.children[0] : item
            )
          "
          placement="right"
          :key="`drop-menu-${item.name}`"
        >
          <a
            @click="handleSelect(getNameOrHref(item, true))"
            class="drop-menu-a"
            :style="{ textAlign: 'center' }"
            ><common-icon
              :size="rootIconSize"
              :color="textColor"
              :type="item.icon || (item.children && item.children[0].icon)"
          /></a>
        </Tooltip>
      </template>
      <div class="external-menu-collapsed">
        <Tooltip v-if="hasPerm('rule')"
          transfer
          content="规则引擎"
          placement="right"
          key="drop-menu-engine"
        >
          <a
            href="http://10.15.196.127/"
            target="_blank"
            rel="nofollow"
            :style="{ textAlign: 'center' }"
            class="drop-menu-a"
            ><img src="@/assets/images/engine.svg" :width="rootIconSize" /></a
          >
        </Tooltip>
        <Tooltip v-if="hasPerm('rpa')"
          transfer
          content="RPA编辑器"
          placement="right"
          key="drop-menu-robot"
        >
          <a
            href="LCRPAProject://"
            rel="nofollow"
            :style="{ textAlign: 'center' }"
            class="drop-menu-a"
            ><img src="@/assets/images/robot.svg" :width="rootIconSize" /></a
          >
        </Tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import SideMenuItem from "./side-menu-item.vue";
import CollapsedMenu from "./collapsed-menu.vue";
import { getUnion } from "@/libs/tools";
import mixin from "./mixin";

export default {
  name: "SideMenu",
  mixins: [mixin],
  components: {
    SideMenuItem,
    CollapsedMenu,
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
    collapsed: {
      type: Boolean,
    },
    theme: {
      type: String,
      default: "light",
    },
    rootIconSize: {
      type: Number,
      default: 20,
    },
    iconSize: {
      type: Number,
      default: 16,
    },
    accordion: {
      type: Boolean,
      default: false,
    },
    activeName: {
      type: String,
      default: "",
    },
    openNames: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      openedNames: [],
    };
  },
  methods: {
    handleSelect(name) {
      this.$emit("on-select", name);
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched
        .map((item) => item.name)
        .filter((item) => item !== name);
    },
    // updateOpenName (name) {
    //   if (name === this.$config.homeName) this.openedNames = []
    //   else this.openedNames = this.getOpenedNamesByActiveName(name)
    // }
  },
  computed: {
    textColor() {
      return '#fff';
      // return this.theme === "dark" ? "#fff" : "#495060";
    },
  },
  watch: {
    activeName(name) {
      // if (this.accordion)
        // this.openedNames = this.getOpenedNamesByActiveName(name);
      // else
      //   this.openedNames = getUnion(
      //     this.openedNames,
      //     this.getOpenedNamesByActiveName(name)
      //   );
    },
    openNames(newNames) {
      // this.openedNames = newNames;
    },
    openedNames() {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened();
      });
    },
  },
  mounted() {
    this.openedNames = this.menuList.map(i => i.name);
    // this.openedNames = getUnion(
    //   this.openedNames,
    //   this.getOpenedNamesByActiveName(name)
    // );
  },
};
</script>
<style lang="less">
@import "./side-menu.less";
.link-button_white {
  background: #ffffff;
  border-radius: 3px;
  font-weight: 400;
  color: #1991dd;
  padding: 0.2rem 0.5rem;
}
.external-link-box {
  min-height: 120px;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;
}
</style>
