<template>
  <Layout style="height: 100%" class="main">
    <Sider
      hide-trigger
      collapsible
      :width="256"
      :collapsed-width="64"
      v-model="collapsed"
      class="left-sider"
      :style="{ overflow: 'hidden' }"
    >
      <side-menu
        accordion
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <div class="logBox" v-show="!collapsed" key="max-logo">
            <!-- <img :src="logo" class="logo" /> -->
            <p>中铁隧道局Human-AI协同平台</p>
          </div>
          <!-- <img v-show="collapsed" :src="logo" key="min-logo" class="logo" /> -->
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar
          :collapsed="collapsed"
          @on-coll-change="handleCollapsedChange"
        >
          <user
            v-if="userToken"
            :message-unread-count="unreadCount"
            :user-avatar="userAvatar"
            :userName="userName"
          />
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>

    <el-dialog
      title="首次登录, 请修改密码"
      :visible="showPWModify"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="handleCloseModify"
    >
      <el-form
        :model="pwModify"
        label-width="100px"
        center
        :rules="pwRules"
        ref="pwModify"
      >
        <el-form-item label="旧密码：" prop="oldpassword">
          <el-input v-model="pwModify.oldpassword" />
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input v-model="pwModify.password" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitModify('pwModify')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import User from "./components/user";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewTagList, routeEqual, localSave, localRead } from "@/libs/util";
import { passwordchange } from "@/api/user";
import routers from "@/router/routers";
import "./main.less";
export default {
  name: "Main",
  components: {
    SideMenu,
    HeaderBar,
    User,
  },
  data() {
    return {
      collapsed: false,
      minLogo: "",
      maxLogo: "",
      isFullscreen: false,
      pwModify: {
        // adminNo: "",
        password: "",
        oldpassword: "",
      },
      pwRules: {
        // adminNo: [{ required: true, message: "请填写账号" }],
        password: [{ required: true, message: "请填写新密码" }],
        oldpassword: [{ required: true, message: "请填写旧密码" }],
      },
    };
  },
  computed: {
    ...mapGetters(["errorCount"]),
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvatar() {
      return this.$store.state.user.avatarImgPath;
    },
    adminNo() {
      return this.$store.state.user.adminNo;
    },
    showPWModify: {
      get() {
        return this.$store.state.user.showPWModify;
      },
      set() {},
    },
    cacheList() {
      const list = [
        "ParentView",
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter((item) => !(item.meta && item.meta.notCache))
              .map((item) => item.name)
          : []),
      ];
      return list;
    },
    menuList() {
      return this.$store.getters.menuList;
    },
    local() {
      return this.$store.state.app.local;
    },
    unreadCount() {
      return this.$store.state.user.unreadCount;
    },
    userName() {
      return this.$store.state.user.userName;
    },
    userToken() {
      return this.$store.state.user.token;
    },
  },
  methods: {
    ...mapMutations([
      "setBreadCrumb",
      "setTagNavList",
      "addTag",
      "setLocal",
      "setHomeRoute",
      "closeTag",
      "setShowPWModify",
    ]),
    ...mapActions(["handleLogin", "getUnreadMessageCount"]),
    handleCloseModify() {
      this.setShowPWModify(false);
    },
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === "string") name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query,
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
      localSave("collapsed", state);
    },
    handleCloseTag(res, type, route) {
      if (type !== "others") {
        if (type === "all") {
          this.turnToPage(this.$config.homeName);
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },
    handleClick(item) {
      this.turnToPage(item);
    },
    submitModify(formName) {
      const _this = this;
      let params = {
        adminNo: this.adminNo,
        password: this.pwModify.password.replace(/\s*/g, "") || "",
        oldpassword: this.pwModify.oldpassword.replace(/\s*/g, "") || "",
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          passwordchange(params).then((res) => {
            if (res.data.code == 0) {
              _this.$message({
                message: res.data.msg,
                type: "success",
                duration: 1500,
              });
            }
          });
          _this.setShowPWModify(false);
        } else {
          return false;
        }
      });
    },
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: "push",
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
    },
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.setHomeRoute(routers);
    const { name, params, query, meta } = this.$route;
    this.addTag({
      route: { name, params, query, meta },
    });
    this.setBreadCrumb(this.$route);
    // 设置初始语言
    this.setLocal(this.$i18n.locale);
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName,
      });
    }
    // 获取未读消息条数
    this.getUnreadMessageCount();
  },
};
</script>
