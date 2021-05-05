<template>
  <div class="wraps">
    <div id="list">
      <Card style="width: 100%">
        <Form
          :inline="true"
          :model="formInline"
          :label-width="80"
          class="demo-form-inline"
          ref="formInline"
        >
          <FormItem label="单据编号:" prop="code">
            <Input v-model="formInline.code" placeholder="请输入单据编号" />
          </FormItem>
          <FormItem label="业务名称:" prop="type">
            <Input v-model="formInline.type" placeholder="请输入业务名称" />
          </FormItem>
          <FormItem label="审核结果:" prop="checkResult">
            <Select v-model="model1" style="width: 200px">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="预警风险:" prop="earlyWarning">
            <Select v-model="model1" style="width: 200px">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="审核日期:" prop="checkBeginDate">
            <DatePicker
              type="daterange"
              placement="bottom-end"
              placeholder="请选择"
            />
          </FormItem>
          <FormItem label="审核时间:" prop="contactPhone">
            <TimePicker
              type="timerange"
              placement="bottom-end"
              placeholder="请选择"
            />
          </FormItem>
          <FormItem label="金额区间:" prop="cname">
            <div class="numCount">
              <Input v-model="formInline.cname" placeholder="请输入" />
              <span style="margin: 0 15px">——</span>
              <Input v-model="formInline.cname" placeholder="请输入" />
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="searchData()">查询</Button>
            <Button @click="handleReset('formInline')" style="margin-left: 15px"
              >重置</Button
            >
          </FormItem>
        </Form>
      </Card>

      <Card style="width: 100%; margin-top: 20px">
        <div class="addBox">
          <Button type="primary" icon="ios-folder-open" @click="exported"
            >导出</Button
          >
          <Button
            type="primary"
            icon="md-settings"
            @click="setting"
            style="margin-left: 15px"
            >设置</Button
          >
        </div>
        <div class="tableList">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            empty-text="暂无数据"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" align="center" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >审核结果页</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="单据编号"
              align="center"
              sortable
            />
            <el-table-column
              prop="type"
              label="业务名单"
              align="center"
              sortable
            />
            <el-table-column
              prop="money"
              label="金额"
              align="center"
              sortable
            />
            <el-table-column
              prop="checkDate"
              label="审核日期"
              align="center"
              sortable
            />
            <el-table-column
              prop="checkBeginDate"
              label="审核开始时间"
              align="center"
            />
            <el-table-column
              prop="checkEndDate"
              label="审核结束时间"
              align="center"
            />
            <el-table-column
              width="180"
              prop="ocrSchedule"
              label="识别进度"
              align="center"
            >
              <template slot-scope="scope">
                <Progress
                  :percent="Number(scope.row.ocrSchedule)"
                  :stroke-width="5"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="invoiceSize"
              label="影像张数"
              align="center"
            />
            <el-table-column prop="checkResult" label="审核结果" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1">可用</span>
                <span v-if="scope.row.status === 0">不可用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="earlyWarning"
              label="预警风险"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1">可用</span>
                <span v-if="scope.row.status === 0">不可用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rpaDate"
              label="数据获取时长"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                <span>{{ scope.row.rpaDate }}s</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ocrDate"
              label="OCR识别时长"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.ocrDate ? scope.row.ocrDate + "min" : "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="rulesDate"
              label="规则审核时长"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.rulesDate ? scope.row.rulesDate + "min" : "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalDate"
              label="审核总时长"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.totalDate ? scope.row.totalDate + "min" : "--"
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row class="paginationStyle">
          <Page
            @on-change="currentChange"
            @on-page-size-change="sizeChange"
            :current="page.currentPage"
            :total="page.totalElement"
            show-elevator
            show-sizer
            show-total
          />
        </el-row>
      </Card>
    </div>
    <!-- 弹框 -->
    <el-dialog title="设置" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="160px" center>
        <el-form-item label="选择列表展示字段：">
          <el-checkbox-group v-model="form.type" @change="handleChange">
            <el-checkbox label="单据编号" name="type"></el-checkbox>
            <el-checkbox label="业务名称" name="type"></el-checkbox>
            <el-checkbox label="金额" name="type"></el-checkbox>
            <el-checkbox label="审核日期" name="type"></el-checkbox>
            <el-checkbox label="审核开始时间" name="type"></el-checkbox>
            <el-checkbox label="审核结束时间" name="type"></el-checkbox>
            <el-checkbox label="审核结果" name="type"></el-checkbox>
            <el-checkbox label="预警风险" name="type"></el-checkbox>
            <el-checkbox label="影像张数" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import logJson from "@/dataJson/log.json";
import store from "@/store";
export default {
  data() {
    return {
      dialogFormVisible: false,
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
      },
      formInline: {
        code: "",
        type: "",
        checkResult: "",
        earlyWarning: "",
        checkBeginDate: "",
        checkEndDate: "",
        beginMoney: "",
        endMoney: "",
      },
      form: {
        type: [],
      },
      tableData: [],
      cityList: [
        {
          value: "New York",
          label: "New York",
        },
        {
          value: "London",
          label: "London",
        },
        {
          value: "Sydney",
          label: "Sydney",
        },
      ],
      model1: "",
    };
  },
  created() {
    if (logJson.code == 20000) {
      let { data } = logJson.data;
      this.tableData = data;
    }
    this.query();
  },
  methods: {
    handleChange(value) {
      this.form.type = value;
    },
    handleSelectionChange(val){
      console.log(val,'454587542');
    },
    query() {
      let params = {
        // id: store.state.user.id,
        code: this.formInline.code.replace(/\s*/g, "") || "",
        type: this.formInline.type.replace(/\s*/g, "") || "",
        checkResult: this.formInline.checkResult.replace(/\s*/g, "") || "",
        earlyWarning: this.formInline.earlyWarning.replace(/\s*/g, "") || "",
        pageNum: this.page.currentPage,
        pageSize: this.page.size,
      };
      getTableData(params).then((res) => {
        let data = res.data;
        if (data.code === 200) {
          let showData = data.data;
          this.tableData = showData.list;
          this.page.totalElement = showData.total;
          this.page.size = showData.pageSize;
        }
      });
    },
    // 导出
    exported() {},
    // 设置
    setting() {
      this.dialogFormVisible = true;
    },
    submit() {},
    handleClick(row) {
      this.$router.push({ path: "/logResult/logResult" });
      // let path =
      //   type == "view"
      //     ? "/companyManage/viewCompany"
      //     : "/companyManage/editCompany";
      // this.$router.push({
      //   path: path,
      //   query: {
      //     id: row.id,
      //     type,
      //   },
      // });
    },
    searchData() {
      this.page.currentPage = 1;
      this.query();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.query();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.query();
    },
    sizeChange(size) {
      this.page.size = size;
      this.query();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.numCount {
  display: flex;
}
/deep/.el-dialog {
  width: 30%;
}
</style>
