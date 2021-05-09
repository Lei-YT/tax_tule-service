<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <div class="avatarBox">
        <!-- <img :src="userAvatar" class="icon" /> -->
        <svg t="1620487856051" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10694" width="48" height="48"><path d="M922.93 338.39c-22.46-53.11-54.62-100.81-95.57-141.76-40.95-40.95-88.64-73.1-141.76-95.57C630.61 77.8 572.2 66 512 66c-60.2 0-118.61 11.8-173.61 35.06-53.11 22.46-100.81 54.62-141.76 95.57-40.95 40.95-73.1 88.64-95.57 141.76C77.8 393.39 66 451.8 66 512c0 60.2 11.8 118.61 35.06 173.61 22.46 53.11 54.62 100.81 95.57 141.76 40.95 40.95 88.64 73.1 141.76 95.57C393.39 946.2 451.8 958 512 958c60.2 0 118.61-11.8 173.61-35.06 53.11-22.46 100.81-54.62 141.76-95.57 40.95-40.95 73.1-88.64 95.57-141.76C946.2 630.61 958 572.2 958 512c0-60.2-11.8-118.61-35.07-173.61zM796.07 773.07v-11.59c0-99.38-51-152.26-93.77-179.14-18.41-11.57-39.43-20.94-62.89-28.02-34.05 29.81-78.69 47.9-127.41 47.9s-93.36-18.09-127.41-47.9c-23.46 7.08-44.48 16.46-62.89 28.02-42.77 26.8-93.76 79.75-93.76 179.14v11.6C164.68 704.3 126 612.58 126 512c0-212.84 173.16-386 386-386s386 173.16 386 386c0 100.58-38.68 192.29-101.93 261.07z" fill="#1991DD" p-id="10695"></path><path d="M512 408.57m-154.95 0a154.95 154.95 0 1 0 309.9 0 154.95 154.95 0 1 0-309.9 0Z" fill="#1991DD" p-id="10696"></path></svg>
        <span>{{ userName }}</span>
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
      </div>

      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
export default {
  name: "User",
  props: {
    userName: {
      type: String,
      default: "",
    },
    userAvatar: {
      type: String,
      default: "",
    },
    messageUnreadCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: "login",
        });
      });
    },
    message() {
      this.$router.push({
        name: "message_page",
      });
    },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "message":
          this.message();
          break;
      }
    },
  },
};
</script>


<style rel="stylesheet/scss" lang="less" scoped>
.avatarBox{
  height: 100%;
  // background: red;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon{
    width: 45px;
    height: 45px;
  }
}
</style>
