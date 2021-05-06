<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <div class="avatarBox">
        <img :src="userAvatar" class="icon" /> 
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
  margin-top: 13%;
  .icon{
    width: 45px;
    height: 45px;
  }
}
</style>