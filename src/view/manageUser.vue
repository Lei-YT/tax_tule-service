<template>
  <div class="wrapper">
    <!-- 左 -->
    <Card :bordered="false" style="width: 25%">
      <div slot="title" class="cardHead">
        <Icon type="ios-school-outline" color="#fff" size="22" />
        <p>组织机构</p>
      </div>
      <div class="searchCon" v-if="hasPerm('user_search') || hasPerm('organ_search')">
        <Input
          v-model="searchOrgan"
          icon="md-close"
          placeholder="请输入机构关键字"
          @on-click="clearCon"
          style="width: 83%"
        />
        <Button type="primary" icon="ios-search" @click="getTreeData" />
      </div>
      <div class="treeCon">
        <Tree
          :data="TreeData"
          expand-node
          @on-select-change="onTreeNodeClick"
          @on-toggle-expand="onTreeToggle"
        />
      </div>
    </Card>
    <!-- 右 -->
    <div class="rightCon" v-if="!addPostCon" style="width: 74%">
      <!-- 上 -->
      <Card :bordered="false">
        <div slot="title" class="cardHead">
          <Icon type="ios-contact-outline" color="#fff" size="22" />
          <p>用户信息</p>
        </div>
        <div class="userTables" v-if="!isCustom">
          <div class="searchWarp">
            <div class="leftWrap" v-if="hasPerm('user_search')">
              <Input v-model="searchName" placeholder="请输入关键字查询" />
              <Button
                type="primary"
                @click="searchData()"
                icon="ios-search"
                style="margin-left: 15px"
                >查询</Button
              >
            </div>
            <div class="rigthWrap" v-if="hasPerm('user_operate')">
              <Button
                type="error"
                v-if="chooseLength.length > 0"
                @click="handel('1')"
                >确认删除</Button
              >
              <Button type="error" icon="md-trash" ghost v-else
                >删除用户</Button
              >
              <Button
                type="primary"
                icon="ios-ionic-outline"
                style="margin: 0 15px"
                @click="handel('4')"
                >启用</Button
              >
              <Button type="primary" icon="md-add" @click="addUserBtn"
                >添加用户</Button
              >
            </div>
          </div>
          <el-table
            :data="tableData1"
            stripe
            border
            highlight-current-row
            @current-change="handleOnUserClick"
            @selection-change="handleSelectionChange"
            empty-text="暂无数据"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              fontWeight: 'normal',
              fontSize: '12px',
            }"
            style="margin-top: 15px"
          >
            <el-table-column v-if="hasPerm('user_operate')" type="selection" align="center" width="55" />
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60"
            />
            <el-table-column prop="name" label="姓名" align="center" width="120"/>
            <el-table-column prop="adminNo" label="账号" align="center" />
            <el-table-column prop="organ" label="所属机构" align="center" width="200" >
              <template slot-scope="scope">
                {{ scope.row.organ && scope.row.organ.OrgName }}
              </template>
              </el-table-column>
            <el-table-column label="用户状态" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.isEnable == 1"
                  type="text"
                  size="small"
                  @click="handel('4', scope.row)"
                  >启用</el-button
                >
                <el-button
                  v-else
                  type="text"
                  size="small"
                  style="color: #e02020"
                  @click="handel('3', scope.row)"
                  >禁用</el-button
                >
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="created_at" label="创建时间" align="center" width="160" />
          </el-table>
          <div class="pageCon" v-if="userBySearch">
            <div class="showCon">共 {{ page.totalElement }} 条</div>
            <div class="paginationStyle">
              <el-button @click="currentChange(1)" type="text" size="small"
                >首页</el-button
              >
              <Page
                @on-change="currentChange"
                @on-page-size-change="sizeChange"
                :current="page.currentPage"
                :total="page.totalElement"
                prev-text="< 上一页"
                next-text="下一页 >"
                show-elevator
                show-sizer
                class-name="page-box"
              />
            </div>
          </div>
          <div class="pageCon" v-else>
            <div class="showCon">共 {{ ouPage.totalElement }} 条</div>
            <div class="paginationStyle">
              <el-button
                @click="currentOrganUserChange(1)"
                type="text"
                size="small"
                >首页</el-button
              >
              <Page
                @on-change="currentOrganUserChange"
                @on-page-size-change="organUserSizeChange"
                :current="ouPage.currentPage"
                :total="ouPage.totalElement"
                prev-text="< 上一页"
                next-text="下一页 >"
                show-elevator
                show-sizer
                class-name="page-box"
              />
            </div>
          </div>
        </div>
        <div v-if="isCustom">
          <span>自定义添加</span>
          <el-divider />
          <Form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :label-width="80"
            class="demo-ruleForm"
          >
            <el-col :span="12">
              <FormItem label="账号" prop="account">
                <Input v-model="ruleForm.account" placeholder="请输入账号" />
              </FormItem>
              <FormItem label="手机号" prop="phone">
                <Input v-model="ruleForm.phone" placeholder="请输入手机号" />
              </FormItem>
            </el-col>
            <el-col :span="12">
              <FormItem label="姓名" prop="name">
                <Input v-model="ruleForm.name" placeholder="请输入姓名" />
              </FormItem>
              <FormItem label="邮箱" prop="email">
                <Input v-model="ruleForm.email" placeholder="请输入邮箱" />
              </FormItem>
            </el-col>
          </Form>
          <div class="footers">
            <Button type="primary" ghost @click="resetForm('ruleForm')"
              >取消</Button
            >
            <Button
              type="primary"
              @click="submitForm('ruleForm')"
              style="margin-left: 15px"
              >提交</Button
            >
          </div>
        </div>
      </Card>
      <!-- 下 -->
      <Card
        :bordered="false"
        style="margin-top: 15px"
        class="ghostHeader"
        v-if="!isCustom"
      >
        <div slot="title" class="cardHeads">
          <div class="leftCon" v-if="hasPerm('user_operate')">
            <Button
              type="primary"
              icon="md-add"
              @click="addPost"
              style="margin-right: 15px"
              >添加岗位</Button
            >
            <Button
              type="error"
              v-if="postLength.length > 0"
              @click="handel('2')"
              >确认删除</Button
            >
            <Button type="error" icon="md-trash" ghost v-else>删除岗位</Button>
          </div>
          <!-- <div class="subCon">
            <Button type="primary">提交</Button>
          </div> -->
        </div>
        <el-table
          :data="tableData2"
          stripe
          border
          height="290"
          @selection-change="handlePostChange"
          empty-text="暂无数据"
          :header-cell-style="{
            background: '#eef1f6',
            color: '#606266',
            fontWeight: 'normal',
            fontSize: '12px',
            marginTop: '10px',
          }"
        >
          <el-table-column v-if="hasPerm('user_operate')" type="selection" align="center" width="55" />
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />
          <el-table-column label="姓名" align="center">
            <template v-if="tableData2.length>0">
              {{ currentUser.name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="organ.OrgSName"
            label="所属机构"
            align="center"
          />
          <el-table-column prop="station.name" label="岗位" align="center" />
        </el-table>
      </Card>
    </div>

    <div class="rightCons" v-if="addPostCon" style="width: 74%">
      <Card :bordered="false">
        <div slot="title" class="cardHead">
          <Icon type="ios-contact-outline" color="#fff" size="22" />
          <p>岗位信息</p>
        </div>
        <div>
          <!-- <span>岗位信息</span>
          <el-divider /> -->
          <div class="postSearch">
            <Input
              v-model="searchStation"
              placeholder="请输入岗位关键字"
              style="width: 250px"
            />
            <Button
              type="primary"
              icon="ios-search"
              style="margin-left: 15px"
              @click="searchStationList"
              >查询</Button
            >
          </div>
          <el-table
            :data="postTableData"
            stripe
            border
            @selection-change="postSelected"
            empty-text="暂无数据"
            :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
              fontWeight: 'normal',
              fontSize: '12px',
            }"
            style="margin-top: 15px"
          >
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column prop="station.name" label="岗位名称" align="center" />
            <el-table-column prop="station.number" label="岗位编号" align="center" />
          </el-table>
          <div class="choosedCon">
            <div>已选机构和岗位：</div>
            <div class="mechanism">
              <template v-for="ss in selectedOrganStation">
                <p :key="'on' + ss.id">{{ ss.organ.OrgSName }}</p>
              </template>
            </div>
            <div class="postName">
              <template v-for="ss in selectedOrganStation">
                <p :key="'os' + ss.id">{{ ss.station.name }}</p>
              </template>
            </div>
          </div>
          <div class="footers">
            <Button type="primary" ghost @click="addPostCon = false"
              >取消</Button
            >
            <Button
              type="primary"
              @click="submitUserAddOS"
              style="margin-left: 15px"
              >提交</Button
            >
          </div>
        </div>
      </Card>
    </div>

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogTableVisible">
      <div class="userBox">
        用户：<Input
          v-model="userName"
          placeholder="请输入用户账号或者姓名"
          style="width: 200px"
        />
        <Button type="primary" icon="ios-search" @click="getList" />
        <Button type="primary" @click="handleCustom">自定义添加 》</Button>
      </div>
      <el-table
        :data="gridData"
        stripe
        border
        empty-text="暂无数据"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          fontWeight: 'normal',
          fontSize: '12px',
        }"
      >
        <el-table-column property="UserName" label="姓名" align="center" />
        <el-table-column property="UserCode" label="账号" align="center" />
        <el-table-column property="organ" label="所属机构" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleImport(scope.row)" type="text" size="small"
              >导入</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 删除用户/岗位弹框 -->
    <el-dialog title="确认提示" :visible.sync="centerDialogVisible" width="30%">
      <span style="display: flex; justify-content: center; margin: 50px 0">{{
        delCon
      }}</span>
      <span slot="footer" class="dialog-footer">
        <Button type="primary" @click="centerDialogVisible = false" ghost
          >取 消</Button
        >
        <Button type="primary" @click="sureDel" style="margin-left: 20px"
          >确 定</Button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList, // 账号列表
  addUser, // 新增
  getAddlist, // 添加导入用户查询接口
  delUsers, // 删除账号
  deleteUserOrgan,
  enableUser,
  importAddUser,
  getOrganUserList, // 机构用户列表
  getOrganList, // 机构列表
  getOrganChildren,
  userOrgan,
  organStation,
  userWithOrgan,
  userAddOrganS,
  getStation,
} from "@/api/mangeUser";
export default {
  components: {},
  data() {
    return {
      searchName: "",
      addPostCon: false,
      delCon: "",
      delType: "",
      centerDialogVisible: false,
      chooseLength: [],
      idArr: [],
      postLength: [],
      isCustom: false,
      dialogTableVisible: false,
      searchVal: "",
      searchOrgan: "",
      searchStation: "",
      userName: "",
      choosedList: [],
      ouPage: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      stationPage: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      TreeData: [],
      currentOrgan: {},
      tableData1: [],
      tableData2: [],
      gridData: [],
      postTableData: [],
      ruleForm: {
        name: "",
        account: "",
        phone: "",
        email: "",
      },
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        account: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      userInfo: null,
      currentUser: {},
      selectedOrganStation: [],
      userBySearch: false,
      userOrganStation: [],
    };
  },
  created() {
    this.getTreeData();
    // this.getList();
  },
  methods: {
    getTreeData() {
      const _this = this;
      const r = {
        org_name: this.searchOrgan,
      };
      Object.keys(r).forEach(
        (key) => (r[key] == null || r[key] == "") && delete r[key]
      );
      getOrganList(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.TreeData = data.data.map((row) =>
              _this.parseOrganTree(row, "twolevel")
            );
            // _this.TreeData[0].selected = true;
            if (data.data.length > 0) {
              _this.currentOrgan = _this.TreeData[0];
              _this.getCurrenOrganUseList(_this.TreeData[0]);
              const firstRoot = data.data.findIndex(
                (ee) => Number(ee.IsLowest) === 0
              );
              _this.getCurrentOrganChildren(_this.TreeData[firstRoot]);
            }
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    parseOrganTree(obj, childrenKey = null) {
      const _this = this;
      const o = { ...obj };
      o.title = o.OrgName;
      // o.selected = true;
      o.expand = false;
      o.children = Number(o.IsLowest) === 0 ? [{ expand: false }] : [];
      if (childrenKey && o.hasOwnProperty(childrenKey)) {
        o.children = o[childrenKey].map((ch) =>
          _this.parseOrganTree(ch, childrenKey)
        );
        o.expand = true;
      }
      return o;
    },
    onTreeNodeClick(currentTree, currentNode) {
      const _this = this;
      // _this.TreeData[0].selected = false;
      _this.currentOrgan = currentNode;
      if (this.addPostCon === false && this.isCustom === false) {
        this.tableData1 = [];
        this.tableData2 = [];
        this.getCurrenOrganUseList(currentNode);
        if (Number(currentNode.IsLowest) === 0) {
          this.getCurrentOrganChildren(currentNode);
        }
      } else if (this.addPostCon === true) {
        this.postTableData = [];
        this.getUserOrganStation(this.currentUser);
      }
    },
    getCurrentOrganChildren(currentNode) {
      const _this = this;
      if (currentNode.children[0].hasOwnProperty("title")) {
        return false;
      }
      const r2 = { OrgID: currentNode.OrgID };
      getOrganChildren(r2)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            currentNode.expand = true;
            currentNode.children = data.data.map((row) =>
              _this.parseOrganTree(row, "twolevel")
            );
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCurrenOrganUseList(currentNode) {
      const _this = this;
      const r = {
        pageindex: this.ouPage.currentPage,
        pagesize: this.ouPage.size,
        organid: currentNode.OrgID,
        username: this.searchName.replace(/\s*/g, "") || "",
      };
      getOrganUserList(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.userBySearch = false;
            _this.tableData1 = data.data;
            _this.ouPage.totalElement = data.totalcount;
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * @deprecated
     */
    getCurrentOrganStation() {
      const _this = this;
      const r = {
        orgid: this.currentOrgan.id,
      };
      organStation(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.postTableData = data.data;
            _this.searchStation = "";
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onTreeToggle(currentNode) {
      const _this = this;
      if (Number(currentNode.IsLowest) === 0) {
        this.getCurrentOrganChildren(currentNode);
      }
    },
    getList() {
      const _this = this;
      let params = {
        userName: this.userName.replace(/\s*/g, "") || "",
      };
      getAddlist(params).then((res) => {
        if (res.data.code == 20000) {
          _this.gridData = res.data.data.list;
        } else {
          _this.$Notice.warning({
            title: "温馨提示",
            desc: data.msg,
          });
        }
      });
    },
    // 确认删除
    sureDel() {
      const _this = this;
      let r = {};
      switch (Number(this.delType)) {
        case 1:
          // 删除该用户
          r = {
            idarr: this.chooseLength.map((u) => u.id),
          };
          delUsers(r)
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1200,
                });
                _this.getCurrenOrganUseList(_this.currentOrgan);
              }
            })
            .catch((err) => {
              _this.$message({
                type: "info",
                message: err,
              });
            });
          break;
        case 2:
          // 删除用户的岗位
          r = {
            userid: this.currentUser.id,
            osIdArr: this.postLength.map((r) => r.id),
          };
          deleteUserOrgan(r)
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1200,
                });
                _this.getUserOrganStation(_this.currentUser);
              }
            })
            .catch((err) => {
              _this.$message({
                type: "info",
                message: err,
              });
            });

          break;
        case 3:
          // 禁用账户,单行
          r = {
            idarr: this.chooseLength.map((u) => u.id),
            isEnable: 1,
          };
          enableUser(r)
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1200,
                });
              }
            })
            .catch(() => {
              _this.$message({
                type: "info",
                message: res.data.msg,
              });
            });

          break;
        case 4:
          // 启用账户, 勾选的多个
          r = {
            idarr: this.chooseLength.map((u) => u.id),
            isEnable: 0,
          };
          enableUser(r)
            .then((res) => {
              if (res.data.code == 0) {
                _this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1200,
                });
              }
            })
            .catch(() => {
              _this.$message({
                type: "info",
                message: res.data.msg,
              });
            });

          break;

        default:
          break;
      }
      this.centerDialogVisible = false;
    },
    handel(type, row) {
      if (row) {
        this.userInfo = row;
        this.chooseLength = [{ ...row }];
      }
      this.delType = type;
      if (type == 1) {
        this.delCon = "您是否要删除该用户？";
      } else if (type == 2) {
        this.delCon = "您是否要删除该岗位？";
      } else if (type == 4) {
        this.delCon = "您是否要启用该用户？";
      } else if (type == 3) {
        this.delCon = "您是否要禁用该用户？";
      }
      this.centerDialogVisible = true;
    },
    handlePostChange(val) {
      this.postLength = val;
    },
    handleSelectionChange(val) {
      this.chooseLength = val;
      let idArr = [];
      val.map((item, index) => {
        return idArr.push(item.id);
      });
      this.idArr = idArr;
    },
    handleOnUserClick(currentUser) {
      this.currentUser = currentUser;
      this.getUserOrganStation(currentUser);
    },
    getUserOrganStation(user) {
      if (user===null || Object.keys(user).length===0) {
        return false;
      }
      const _this = this;
      const r = {
        userid: user.id,
        org_id: this.currentOrgan.id
      };
      userOrgan(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            const is_user_organ_station = data.data.filter(os => Number(os.userorgan_count)===1);
            _this.tableData2 = is_user_organ_station;
            _this.userOrganStation = is_user_organ_station;
            const not_user_organ_station = data.data.filter(os => Number(os.userorgan_count)!==1);
            _this.postTableData = not_user_organ_station;
            // _this.tableData2 = data.data;
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm(formName) {
      const _this = this;
      let params = {
        name: this.ruleForm.name.replace(/\s*/g, "") || "",
        account: this.ruleForm.account.replace(/\s*/g, "") || "",
        phone: this.ruleForm.phone || "",
        email: this.ruleForm.email || "",
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addUser(params).then((res) => {
            if (res.data.code == 0) {
              _this.$message({
                message: res.data.msg,
                type: "success",
                duration: 1500,
              });
              _this.isCustom = false;
              const newUser = res.data.data;
              _this.boundUserToOrgan(newUser);
              _this.getCurrenOrganUseList(_this.currentOrgan);
            } else {
              _this.$Notice.warning({
                title: "温馨提示",
                desc: data.msg,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    postSelected(val) {
      const _this = this;
      this.selectedOrganStation = val.map((s) => ({
        ...s,
        organName: _this.currentOrgan.OrgSName,
      }));
    },
    searchStationList() {
      const _this = this;
      let params = {
        name: this.searchStation.replace(/\s*/g, "") || "",
        pageindex: this.stationPage.currentPage,
        pagesize: this.stationPage.size,
      };
      getStation(params).then((res) => {
        if (res.data.code == 0) {
          _this.postTableData = res.data.data;
          _this.stationPage.totalElement = res.data.totalcount;
        } else {
          _this.$Notice.warning({
            title: "温馨提示",
            desc: data.message,
          });
        }
      });
    },
    submitUserAddOS() {
      const _this = this;
      const r = {
        userid: this.currentUser.id,
        osIdArr: this.selectedOrganStation.map((s) => s.id),
      };
      userAddOrganS(r)
        .then((resp) => {
          let data = resp.data;
          if (data.code === 0) {
            _this.$message({
              message: data.msg,
              type: "success",
              duration: 1500,
            });
            _this.addPostCon = false;
            _this.getUserOrganStation(_this.currentUser);
          } else {
            _this.$Notice.warning({
              title: "温馨提示",
              desc: data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isCustom = false;
    },
    clearCon() {
      this.searchOrgan = "";
    },
    addUserBtn() {
      if (
        this.currentOrgan === null ||
        Object.keys(this.currentOrgan).length === 0
      ) {
        this.$Notice.warning({
          title: "请先选中一个机构",
        });
        return false;
      }
      this.dialogTableVisible = true;
    },
    addPost() {
      if (
        this.currentUser === null ||
        Object.keys(this.currentUser).length === 0
      ) {
        this.$Notice.warning({
          title: "请先选中一个用户",
        });
        return false;
      }
      this.getUserOrganStation(this.currentUser);
      this.addPostCon = true;
    },
    handleImport(row) {
      const _this = this;
      importAddUser(row).then((res) => {
        if (res.data.code == 0) {
          _this.$message({
            message: res.data.msg,
            type: "success",
            duration: 1500,
          });
          _this.getCurrenOrganUseList(_this.currentOrgan);
          _this.dialogTableVisible = false;
        } else {
          _this.$Notice.warning({
            title: "温馨提示",
            desc: data.msg,
          });
        }
      });
    },
    boundUserToOrgan(user) {
      const _this = this;
      const r = {
        userid: user.id,
        orgname: this.currentOrgan.OrgName,
        orgid: this.currentOrgan.OrgID,
      };
      userWithOrgan(r).then((res) => {
        if (res.data.code == 0) {
          _this.getCurrenOrganUseList();
        } else {
          _this.$Notice.warning({
            title: "温馨提示",
            desc: data.msg,
          });
        }
      });
    },
    handleCustom() {
      this.dialogTableVisible = false;
      this.isCustom = true;
    },
    // 机构用户
    currentOrganUserChange(current) {
      this.ouPage.currentPage = current;
      this.getCurrenOrganUseList(this.currentOrgan);
    },
    organUserSizeChange(size) {
      this.ouPage.size = size;
      this.currentOrganUserChange(1);
    },
    searchData() {
      this.currentOrganUserChange(1);
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
}
/deep/.ivu-card-head {
  border-radius: 5px 5px 0 0;
  background: #1991dd;
  p {
    color: #fff;
    font-weight: 400;
  }
}
.cardHead {
  display: flex;
  align-items: center;
  p {
    margin-left: 10px;
  }
}
.searchCon {
  width: 100%;
  display: flex;
  padding-bottom: 15px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #999;
}

.treeCon {
  margin-top: 17px;
}
/deep/.ivu-tree-title{
  width: calc(~"100% - 16px");
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/.ghostHeader .ivu-card-head {
  background: #fff;
}
.cardHeads,
.searchWarp,
.pageCon {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.leftWrap,
.postSearch {
  display: flex;
}
.pageCon {
  margin-top: 20px;
}
/deep/.paginationStyle {
  display: flex;
  margin-top: 0;
}
.paginationStyle > .el-button {
  margin-right: 1rem;
}
/deep/.el-dialog {
  width: 33%;
}
/deep/.el-dialog__body {
  padding: 20px;
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #999;
}
/deep/.el-dialog__footer {
  border-top: 1px solid;
  display: flex;
  justify-content: center;
}
.userBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
}
.footers {
  display: flex;
  justify-content: center;
  margin-top: 200px;
}
.choosedCon {
  display: flex;
  margin-top: 15px;
  justify-content: flex-start;
}
.postName {
  margin-left: 15px;
}
/deep/.el-table__body tr.current-row > td,
/deep/.el-table--striped
  .el-table__body
  tr.el-table__row--striped.current-row
  td {
  background-color: #b2e2fa;
}
</style>
