<template>
  <div class="wraps">
    <div id="list">
      <!-- 头部 -->
      <Card style="width: 100%" class="ticketType">
        <el-button
          v-if="!forbidExternal"
          type="primary"
          plain
          @click="$router.push({ name: 'auditLogIndex' })"
          icon="el-icon-arrow-left"
          size="small"
          >返回</el-button
        >

        <p>单据类型：{{ allData.billType }}</p>
        <p>单据编号：{{ allData.billNo }}</p>
      </Card>
      <!-- 内容 -->
      <div class="conBox">
        <div class="leftCon">
          <div class="item" v-for="(item, index) in allData.data" :key="index">
            <Card style="width: 100%">
              <div class="cardTit" slot="title">
                <p v-if="item.ruleType == 'IMAGES'">影像规则</p>
                <p v-if="item.ruleType == 'OTHERS'">非影像规则</p>
                <p v-if="item.ruleType == 'WARNING'">预警通知</p>
                <div class="countBox">
                  <p
                    v-if="
                      item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'
                    "
                  >
                    规则：{{ item.ruleCount }}条&nbsp;&nbsp;&nbsp;
                  </p>
                  <p
                    v-if="
                      item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'
                    "
                  >
                    报错：{{ item.errorCount }}条
                  </p>
                  <p v-if="item.ruleType == 'WARNING'">
                    预警数：{{ item.ruleCount }}条
                  </p>
                  <Button
                    v-if="
                      item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'
                    "
                    @click="toggleRuleCollapse(item.ruleType)"
                    style="margin-left: 1rem"
                    >{{
                      item.ruleType == "IMAGES"
                        ? imagesCollapseAction
                        : othersCollapseAction
                    }}</Button
                  >
                </div>
              </div>
              <el-collapse
                v-model="activeName"
                v-if="item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'"
              >
                <el-collapse-item
                  title="未通过规则"
                  v-bind:name="item.ruleType + '1'"
                >
                  <template>
                    <table style="width: 100%" class="rule-table td-wrap">
                      <thead>
                        <tr>
                          <th width="60">序号</th>
                          <th style="text-align: left">规则</th>
                          <th width="60"></th>
                          <th width="200" style="text-align: left">审核结果</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-if="
                            item.result.filter((obj) => {
                              return obj.correct == false;
                            }).length === 0
                          "
                        >
                          <td colspan="4" style="text-align: center">
                            暂无数据
                          </td>
                        </tr>
                        <tr
                          v-for="(n, i) in item.result.filter((obj) => {
                            return obj.correct == false;
                          })"
                          v-bind:key="i"
                          class="hover-primary"
                        >
                          <td style="text-align: center">{{ i + 1 }}</td>
                          <td
                            style="text-align: left"
                            @click="ruleClick(item.ruleType, n, i)"
                          >
                            {{ n.ruleName }}
                          </td>
                          <td
                            style="text-align: center"
                            @click="ruleResultClick(item.ruleType, n, i)"
                          >
                            <Icon
                              type="md-close-circle"
                              size="25"
                              color="#E02020"
                            />
                          </td>
                          <td
                            style="text-align: left"
                            @click="ruleResultClick(item.ruleType, n, i)"
                          >
                            {{ n.message ? n.message : "——" }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                </el-collapse-item>
                <el-collapse-item
                  title="通过规则"
                  v-bind:name="item.ruleType + '2'"
                >
                  <template>
                    <table style="width: 100%" class="rule-table td-wrap">
                      <thead>
                        <tr>
                          <th width="60">序号</th>
                          <th style="text-align: left">规则</th>
                          <th width="60"></th>
                          <th width="200" style="text-align: left">审核结果</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-if="
                            item.result.filter((obj) => {
                              return obj.correct == true;
                            }).length === 0
                          "
                        >
                          <td colspan="4" style="text-align: true">暂无数据</td>
                        </tr>
                        <tr
                          v-for="(n, i) in item.result.filter((obj) => {
                            return obj.correct == true;
                          })"
                          v-bind:key="i"
                        >
                          <td style="text-align: center">{{ i + 1 }}</td>
                          <td style="text-align: left">{{ n.ruleName }}</td>
                          <td style="text-align: center">
                            <Icon
                              type="md-checkmark-circle"
                              size="25"
                              color="#6DD400"
                            />
                          </td>
                          <td style="text-align: left">通过</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                </el-collapse-item>
              </el-collapse>
              <el-collapse v-else>
                <Table
                  size="small"
                  :columns="columns1"
                  :data="
                    item.result.filter((obj) => {
                      return obj.correct == false;
                    })
                  "
                >
                  <template slot="grade" slot-scope="{ row }">
                    <div flex>{{ row.warnRank.grade }}</div>
                  </template>
                  <template slot="ruleName" slot-scope="{ row }">
                    <div flex>
                      {{ row.ruleName }}
                      <Icon
                        type="ios-information-circle"
                        size="18"
                        :color="row.warnRank.color"
                        style="margin-left: 60%"
                      />
                    </div>
                  </template>
                  <template slot="message" slot-scope="{ row }">
                    {{ row.message ? row.message : "——" }}
                  </template>
                </Table>
              </el-collapse>
            </Card>
          </div>
        </div>
        <!-- 右面 -->
        <div class="rightCon">
          <Card style="width: 100%">
            <div class="cardTit" slot="title">
              <p>影像展示</p>
              <div class="countBox" v-if="!emptyImageInfo">
                <Button @click="handelAllImage">返回全部展示</Button>
              </div>
            </div>

            <Modal
              v-model="showbigimg"
              draggable
              scrollable
              :closable="true"
              :footer-hide="true"
              @on-cancel="showbigimg = false"
              width="1400"
            >
              <div
                slot="header"
                style="
                  color: #1991dd;
                  font-size: 16px;
                  display: flex;
                  align-items: center;
                "
              >
                <img
                  src="@/assets/images/tupian-2.png"
                  style="width: 22px; height: 19px; margin-right: 8px"
                />查看图片
              </div>
              <div
                class="showbigimgbox"
                style="height: 677px; background-color: #fff"
              >
                <div class="showimg-content">
                  <ImagePreview
                    :items="showImgData"
                    height="667px"
                    width="1360px"
                  />
                </div>
              </div>
            </Modal>
            <div
              v-if="emptyImageInfo"
              class="empty-text"
              style="text-align: center"
            >
              暂无数据
            </div>
            <div class="imgBox" v-if="!emptyImageInfo">
              <div class="leftImg">
                <img v-lazy="imgSrc" class="bigImg" @click="showImgbox()" />
              </div>
              <div class="rightImg">
                <div
                  class="smallImgBox"
                  v-for="(item, index) in imageData"
                  :key="index"
                  @click="
                    handleClick(item.imageURL, index);
                    handelImage(item);
                  "
                >
                  <img v-lazy="item.imageURL" class="smallImg" />
                  <span
                    :class="
                      imgHasError.includes(item.imageId)
                        ? 'index-icon red-index'
                        : 'index-icon '
                    "
                    >{{ index + 1 }}</span
                  >
                </div>
              </div>
            </div>

            <div class="conBoxs">
              <div class="tabs">
                <Button
                  :type="tabsInvoiceIndex == index ? 'primary' : 'dashed'"
                  size="small"
                  v-for="(item, index) in messageInfo.invoices"
                  :key="index"
                  @click="handleTab(index, item['invoiceId'])"
                >
                  {{ index + 1 }}
                </Button>
              </div>
              <div class="tabData">
                <p class="data-header" v-if="!emptyImageInfo">
                  <template>
                    <Button
                      type="text"
                      size="small"
                      :ghost="!showInvoiceRaw"
                      :class="{ 'btn-active': showInvoiceRaw }"
                      @click="showInvoiceRaw = true"
                      >结构化数据</Button
                    >
                    <!-- <Divider type="vertical" /> -->
                    <Button
                      type="text"
                      size="small"
                      :ghost="showInvoiceRaw"
                      :class="{ 'btn-active': !showInvoiceRaw }"
                      @click="goEdit"
                      >学习样本纠偏</Button
                    >
                  </template>
                  <!-- <template v-else> 结构化数据 </template> -->

                  <span class="text-primary pr-1"
                    >报错信息: {{ currentInvoiceErrorFields.length }}条</span
                  >
                </p>

                <template v-for="(vo, index) in messageInfo.invoices">
                  <Form
                    :ref="'invoiceData' + vo.invoiceId"
                    :model="vo"
                    label-position="left"
                    :label-width="70"
                    :key="vo.invoiceId + index"
                    v-if="tabsInvoiceIndex == index"
                  >
                    <Row
                      :gutter="16"
                      type="flex"
                      style="
                        padding-left: 10px;
                        padding-top: 10px;
                        margin-top: 0.5rem;
                      "
                      v-if="!showInvoiceRaw"
                    >
                      <Col :span="24" style="flex: 1 0 auto">
                        <invoiceType
                          fieldKey="invoiceType"
                          fieldName="学习样本类型"
                          :defaultKeyValue="editInvoice.invoiceType"
                          :invoiceData="editInvoice"
                          :isReadonly="!editable"
                          :label-width="120"
                          :isRaw="false"
                          @on-input-change="handleCorrectField"
                          @on-icon-click="getFieldError"
                          @on-select-type="onPickInvoiceType"
                        />
                      </Col>
                    </Row>
                    <el-collapse
                      style="width: 100%; padding-left: 10px"
                      v-model="dataPanelOpen"
                    >
                      <template v-for="iset in invoiceFieldsSetting">
                        <template
                          v-if="
                            iset.isItems === true &&
                            [
                              'invoiceFlights',
                              'invoiceItems',
                              'fpItems',
                            ].includes(iset.checkField)
                          "
                        >
                          <el-collapse-item
                            :key="iset.label"
                            :title="iset.label"
                            v-if="
                              vo[iset.checkField] &&
                              vo[iset.checkField].length > 0
                            "
                            v-bind:name="iset.prename + vo.invoiceId"
                            style="width: 100%"
                          >
                            <invoiceItems
                              v-if="showInvoiceRaw"
                              :key="iset.checkField + '0'"
                              :fieldKey="iset.checkField"
                              :fieldName="iset.label"
                              :defaultKeyValue="vo[iset.checkField]"
                              :itemData="vo[iset.checkField]"
                              :itemFields="iset.columns"
                              :showSummary="iset.showSummary"
                              :showIndex="iset.showIndex"
                              :invoiceData="vo"
                              :isReadonly="true"
                              :isRaw="true"
                              @on-input-change="handleCorrectField"
                              @on-icon-click="getFieldError"
                              @on-item-change="handleCorrectItemField"
                            />
                            <invoiceItems
                              v-else
                              :key="iset.checkField + '1'"
                              :fieldKey="iset.checkField"
                              :fieldName="iset.label"
                              :defaultKeyValue="editInvoice[iset.checkField]"
                              :itemData="editInvoice[iset.checkField]"
                              :itemFields="iset.columns"
                              :showSummary="iset.showSummary"
                              :showIndex="iset.showIndex"
                              :invoiceData="editInvoice"
                              :isReadonly="!editable"
                              :isRaw="false"
                              @on-input-change="handleCorrectField"
                              @on-icon-click="getFieldError"
                              @on-item-change="handleCorrectItemField"
                            />
                          </el-collapse-item>
                        </template>
                        <el-collapse-item
                          v-else-if="
                            iset.isItems !== true &&
                            vo[iset.checkField] !== undefined
                          "
                          :key="iset.label"
                          :title="iset.label"
                          v-bind:name="iset.prename + vo.invoiceId"
                          style="width: 100%"
                        >
                          <Row
                            :gutter="16"
                            type="flex"
                            v-for="(irow, ri) in iset.fields"
                            :key="ri"
                          >
                            <template v-for="(ifield, fi) in irow">
                              <!-- <template v-if="ifield.key !== 'invoiceType' "> -->
                              <template v-if="showInvoiceRaw">
                                <Col
                                  :key="fi.label"
                                  :span="ifield.col"
                                  style="flex: 1 0 auto"
                                  v-if="vo[ifield.key] !== undefined"
                                >
                                  <defaultC
                                    :key="ifield.key + '0'"
                                    :fieldKey="ifield.key"
                                    :fieldName="ifield.label"
                                    :defaultKeyValue="vo[ifield.key]"
                                    :labelWidth="ifield.width"
                                    :invoiceData="vo"
                                    :isReadonly="true"
                                    :isRaw="true"
                                    @on-icon-click="getFieldError"
                                  />
                                </Col>
                              </template>
                              <template v-else>
                                <Col
                                  :key="fi.label"
                                  :span="ifield.col"
                                  style="flex: 1 0 auto"
                                  v-if="
                                    vo[ifield.key] !== undefined &&
                                    ifield.key !== 'invoiceType'
                                  "
                                >
                                  <defaultC
                                    :key="ifield.key + '1'"
                                    :fieldKey="ifield.key"
                                    :fieldName="ifield.label"
                                    :defaultKeyValue="editInvoice[ifield.key]"
                                    :labelWidth="ifield.width"
                                    :invoiceData="editInvoice"
                                    :isReadonly="!editable"
                                    :isRaw="false"
                                    @on-input-change="handleCorrectField"
                                    @on-icon-click="getFieldError"
                                  />
                                </Col>
                              </template>
                            </template>
                          </Row>
                        </el-collapse-item>
                      </template>
                      <Row
                        v-if="editable && !showInvoiceRaw"
                        type="flex"
                        justify="center"
                        align="middle"
                        :style="{ marginBottom: '1rem' }"
                      >
                        <Col span="8">
                          <Button
                            long
                            type="primary"
                            @click="
                              handleSubmitData(
                                'invoiceData' + vo.invoiceId,
                                editInvoice
                              )
                            "
                            >保存</Button
                          >
                        </Col>
                      </Row>
                    </el-collapse>
                  </Form>
                </template>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    <Modal
      title=" "
      v-model="ruleRowtoggle"
      draggable
      scrollable
      :closable="true"
      :footer-hide="true"
      width="1000"
      class-name="result-data-modal"
    >
      <Row :gutter="10" style="margin-left: 0; margin-right: 0">
        <Col
          v-if="ruleFormToggle"
          :span="ruleImageToggle ? 12 : 24"
          class="thead-name"
          style="padding-left: 0; padding-right: 0"
          >表单</Col
        >
        <Col
          v-if="ruleImageToggle"
          :span="ruleFormToggle ? 12 : 24"
          class="thead-name"
          style="padding-left: 0; padding-right: 0"
          >影像</Col
        >
      </Row>
      <div class="table-row">
        <el-table
          :data="resultFormData"
          v-if="ruleFormToggle"
          style="width: 100%"
          border
          empty-text="暂无数据"
          :header-cell-style="{
            background: '#eef1f6',
            color: '#606266',
            fontWeight: 'normal',
            fontSize: '12px',
          }"
          :cell-class-name="formTableCellClassName"
        >
          <template v-for="col in formColumnsChildren">
            <el-table-column
              :prop="col.key"
              :label="col.title"
              v-bind:key="col.key"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row[col.key] }}
              </template>
            </el-table-column>
          </template>
        </el-table>

        <el-table
          :data="resultImageData"
          v-if="ruleImageToggle"
          style="width: 100%"
          border
          empty-text="暂无数据"
          :header-cell-style="{
            background: '#eef1f6',
            color: '#606266',
            fontWeight: 'normal',
            fontSize: '12px',
          }"
          :cell-class-name="imageTableCellClassName"
        >
          <template v-for="col in imageColumnsChildren">
            <el-table-column
              :prop="col.key"
              :label="col.title"
              v-bind:key="col.key"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row[col.key] }}
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import "@/components/invoice-field/index.js";
import ImagePreview from "@/components/image-preview";
// import { matchCNkeys } from "@/libs/invoice";
import invoiceTypeData from "@/libs/invoiceType";
import { getInvoiceFields } from "@/libs/invoiceTypeFields";
import { Notification, Loading } from "element-ui";
import axios from "@/libs/api.request";
const clubArray = (arr) => {
  return arr.reduce((acc, val, ind) => {
    acc[ind] = acc[ind] && acc[ind] !== null ? acc[ind] : {};
    val.map((v) => {
      if (typeof v === "object" && v !== null) {
        const key = Object.keys(v)[0];
        acc[ind][key] = v[key];
      }
    });
    return acc;
  }, []);
};
const removeEmptyOrNull = (obj) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === "object" && removeEmptyOrNull(obj[k])) ||
      ((obj[k] === "" || obj[k] === null) && delete obj[k])
  );
  return obj;
};
export default {
  components: { ImagePreview },
  data() {
    return {
      // invoiceFieldsSetting: [],
      currentInvoiceType: "",
      invoiceTypeData: invoiceTypeData,
      selectedInvoiceType: [],
      showFormRet: false,
      showImageRet: false,
      formColumnsB: [
        {
          title: "表单",
          align: "center",
          // children: [],
          childrenBak: [
            {
              title: "序号",
              type: "index",
              width: 65,
            },
          ],
        },
      ],
      formColumnsChildren: [],
      imageColumns: [
        {
          title: "影像",
          align: "center",
          // children: [],
          childrenBak: [
            {
              title: "序号",
              type: "index",
              width: 65,
            },
          ],
        },
      ],
      imageColumnsChildren: [],
      resultFormDataRaw: [],
      resultFormData: [],
      resultImageDataRaw: [],
      resultImageData: [],
      allData: [],
      activeName: ["IMAGES1", "OTHERS1"], // "IMAGES1",
      ruleCollapseActive: "IMAGES",
      imagesCollapseAction: "展开",
      othersCollapseAction: "展开",
      dataPanelOpen: [],
      imageData: [],
      imgSrc: "",
      messageInfo: {},
      imageId: "",
      invoiceId: "",
      cur: 0,
      errorFieldCode: [],
      errorMessage: [],
      errorFieldCnt: 0,
      billNumber: "",
      columns: [
        {
          title: "序号",
          type: "index",
          width: 65,
        },
        {
          title: "规则",
          slot: "ruleName",
        },
        {
          title: " ",
          slot: "icon",
          width: 65,
        },
        {
          title: "审核结果",
          slot: "message",
        },
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 65,
        },
        {
          title: "预警等级",
          slot: "grade",
          width: 90,
        },
        {
          title: "规则",
          slot: "ruleName",
        },
        {
          title: "审核结果",
          slot: "message",
        },
      ],
      tabsInvoiceIndex: 0,
      showbigimg: false,
      imgIndex: 0,
      showImgData: [],
      imgHasError: [],
      ruleRowtoggle: false,
      ruleFormToggle: true,
      ruleImageToggle: true,
      allImageInvoiceIds: {},
      currentInvoiceErrorFields: [],
      currentInvoiceRuleId: "",
      forbidExternal: this.$route.meta.forbidExternal,
      isReadonly: true,
      correctData: [],
      correctItemData: [],
      editFields: [],
      editFieldsItems: [],
      inputCommonStyle: {
        backgroundColor: "#FFFA99",
        width: "100%",
      },
      invoiceIsFirstEdit: false,
      editInvoice: {},
      showInvoiceRaw: true,
    };
  },
  mounted() {
    this.billNumber =
      this.$route.params.billNumber || this.$route.query.billNumber;
    this.query();
  },
  computed: {
    emptyImageInfo: function () {
      return this.imageData.length === 0;
    },
    editable: function () {
      return this.invoiceIsFirstEdit && this.showInvoiceRaw === false;
    },
    invoiceFieldsSetting() {
      return getInvoiceFields(this.currentInvoiceType);
    },
  },
  methods: {
    ...mapMutations([
      "setEditFields",
      "setEditFieldsItems",
      "setCurrentInvoiceErrorFields",
    ]),
    handelAllImage() {
      const _this = this;
      // 有字段的报错图片
      const errorFields = _this.allData.errors.filter((e) => {
        const hasfield = e.infos.filter((ei) => ei.hasOwnProperty("fields"));
        return hasfield.length > 0;
      });
      // 所有报错图片
      _this.imgHasError = _this.allData.errors.map((i) => i.imageId);
      let newSortImageInfo = _this.allData.imageInfo.filter((img) =>
        _this.imgHasError.includes(img.imageId)
      );
      const noErrImage = _this.allData.imageInfo.filter(
        (img) => !_this.imgHasError.includes(img.imageId)
      );
      _this.imageData = newSortImageInfo.concat(noErrImage);
      _this.invoiceId =
        _this.imageData.length > 0
          ? _this.imageData[0]["invoices"].length > 0
            ? _this.imageData[0]["invoices"][0]["invoiceId"]
            : ""
          : "";
      _this.imageId =
        _this.imageData.length > 0 ? _this.allData.imageInfo[0]["imageId"] : "";
      _this.imgSrc =
        _this.imageData.length > 0 ? _this.allData.imageInfo[0].imageURL : "";
      _this.getMessageInfo([]);
      _this.getErrorMessage(_this.invoiceId);
      // _this.tabsInvoiceIndex = 0;
    },
    // 右边小图点击事件
    handelImage(data) {
      this.tabsInvoiceIndex = 0;
      this.invoiceId =
        data["invoices"].length > 0 ? data["invoices"][0]["invoiceId"] : "";
      this.imageId = data.imageId;
      this.getMessageInfo([data.imageId]);
      this.getErrorMessage(this.invoiceId);
    },
    toggleRuleCollapse(collapseTab) {
      const _this = this;
      let activeTxt = "";
      if (
        this.activeName.includes(`${collapseTab}1`) &&
        this.activeName.includes(`${collapseTab}2`)
      ) {
        _this.activeName = _this.activeName.filter(
          (i) => i.includes(collapseTab) === false
        );
        activeTxt = "展开";
      } else {
        _this.activeName = [
          ...new Set([
            ...this.activeName.concat([`${collapseTab}1`, `${collapseTab}2`]),
          ]),
        ];
        activeTxt = "收起";
      }
      switch (collapseTab) {
        case "IMAGES":
          this.imagesCollapseAction = activeTxt;
          break;
        case "OTHERS":
          this.othersCollapseAction = activeTxt;
          break;
        default:
          break;
      }
    },
    ruleClick(ruleType, vo, i) {
      const _this = this;
      if (ruleType !== "IMAGES") {
        return this.ruleResultClick(ruleType, vo, i);
      }
      _this.currentInvoiceRuleId = vo.ruleId;
      _this.isReadonly = true;
      if (vo.hasOwnProperty("imageData")) {
        let ids = vo.imageData.map((voi) => {
          return voi.imageId;
        });
        this.imgHasError = ids;
        this.setImageData(ids, vo.imageData[0].infos[0].invoiceId);
        console.log("image", vo);
        // _this.invoiceId = vo.imageData[0].infos[0].invoiceId;
      } else {
        Notification.closeAll();
        Notification({
          message: "无影像数据",
          type: "warning",
          duration: 2000,
        });
      }
    },
    ruleResultClick(ruleType, vo, i) {
      const _this = this;
      _this.currentInvoiceRuleId = vo.ruleId;
      const ruleRequest = {
        ruleId: vo.ruleId,
        billNumber: _this.allData.billNo, // this.billNumber,
        taskId: _this.allData.taskId,
      };
      _this.getRuleInvoice(ruleRequest);
    },
    // mapper highlight
    formTableCellClassName({ row, column, rowIndex, columnIndex }) {
      const _this = this;
      const columnName = column.property;
      if (columnName === undefined) {
        return "";
      }
      const dataIndex = Number(columnName.replace(/\D/g, ""));
      if (!_this.resultFormDataRaw[dataIndex].hasOwnProperty("valueData")) {
        return "";
      }
      if (!row.hasOwnProperty(columnName)) {
        return "";
      }
      const valueObj = _this.resultFormDataRaw[dataIndex].valueData.find(
        (ele) => `${ele.index} | ${ele.value}` === row[columnName]
      );
      return valueObj.highLight === true ? "text-highlight" : "";
    },
    imageTableCellClassName({ row, column, rowIndex, columnIndex }) {
      const _this = this;
      const columnName = column.property;
      if (columnName === undefined) {
        return "";
      }
      const dataIndex = Number(columnName.replace(/\D/g, ""));
      if (!_this.resultImageDataRaw[dataIndex].hasOwnProperty("valueData")) {
        return "";
      }
      if (!row.hasOwnProperty(columnName)) {
        return "";
      }
      const valueObj = _this.resultImageDataRaw[dataIndex].valueData.find(
        (ele) => `${ele.index} | ${ele.value}` === row[columnName]
      );
      return valueObj.highLight === true ? "text-highlight" : "";
    },
    getRuleInvoice(request, showAllRules = true) {
      const _this = this;
      const loadingInstance = Loading.service({
        fullscreen: true,
        background: "hsla(0,0%,100%,.2)",
      });
      axios
        .request({
          method: "post",
          url: `/api/server/qldata`,
          data: request,
        })
        .then((resp) => {
          loadingInstance.close();
          let data = resp.data;
          if (data.status === 200) {
            if (data.data.form.length === 0 && !showAllRules) {
              _this.ruleFormToggle = false;
            }
            if (data.data.image.length === 0 && !showAllRules) {
              _this.ruleImageToggle = false;
            }
            // Modal
            _this.resultFormDataRaw = data.data.form;
            _this.resultImageDataRaw = data.data.image;
            const formColumnsChildren = data.data.form.map((fc, i) => ({
              title: fc.keyName,
              key: `data${i}`,
            }));
            _this.formColumnsChildren = formColumnsChildren;
            // _this.formColumns[0].children = _this.formColumns[0].childrenBak.concat(
            // formColumnsChildren
            // )
            const imageColumnsChildren = data.data.image.map((fc, i) => ({
              title: fc.keyName,
              key: `data${i}`,
            }));
            _this.imageColumnsChildren = imageColumnsChildren;
            // _this.imageColumns[0].children = _this.imageColumns[0].childrenBak.concat(
            //   imageColumnsChildren
            // )

            const xx = data.data.form.map((fc, i) => {
              const keyn = `data${i}`;
              const formData = fc.valueData.map(
                (hi) => `${hi.index} | ${hi.value}`
              ); // fc.data
              return formData.map((d) => {
                const newd = {};
                newd[keyn] = d;
                return newd;
              });
            });
            if (xx.length > 0) {
              const newArray = xx[0].map((col, i) => xx.map((row) => row[i]));
              const parr = JSON.parse(JSON.stringify(newArray)).filter(
                (s) => s
              );
              _this.resultFormData = clubArray(parr)
                .map((x) => removeEmptyOrNull(x))
                .filter((nn) => Object.keys(nn).length !== 0);
              _this.showFormRet = true;
            } else {
              _this.resultFormData = [];
              _this.resultFormDataRaw = [];
              _this.showFormRet = true;
            }

            const tt = data.data.image.map((fc, i) => {
              const keyn = `data${i}`;
              const imageData = fc.valueData.map(
                (hi) => `${hi.index} | ${hi.value}`
              ); // fc.data
              return imageData.map((d) => {
                const newd = {};
                newd[keyn] = d;
                return newd;
              });
            });
            if (tt.length > 0) {
              const newArray2 = tt[0].map((col, i) => tt.map((row) => row[i]));
              const parr2 = JSON.parse(JSON.stringify(newArray2));
              _this.resultImageData = clubArray(parr2)
                .map((x) => removeEmptyOrNull(x))
                .filter((nn) => Object.keys(nn).length !== 0);
              _this.showImageRet = true;
            } else {
              _this.resultImageData = [];
              _this.resultImageDataRaw = [];
              _this.showImageRet = true;
            }
            _this.ruleRowtoggle = true;
          } else {
            Notification.closeAll();
            Notification({
              message: data.msg || data.message,
              type: "warning",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
    setImageData(arr, invoiceIdP) {
      const _this = this;
      let newArr = [];
      let data = this.allData.imageInfo;
      for (let i = 0; i < data.length; i++) {
        if (arr.indexOf(data[i]["imageId"]) !== -1) {
          newArr.push(data[i]);
        }
      }
      let newSortImageInfo = data.filter((img) => arr.includes(img.imageId));
      const noErrImage = data.filter((img) => !arr.includes(img.imageId));
      _this.imageData = newSortImageInfo.concat(noErrImage);
      // this.imageData = newArr;
      let targetInvoice = invoiceIdP
        ? invoiceIdP
        : newArr.length > 0
        ? newArr[0]["invoices"].length > 0
          ? newArr[0]["invoices"][0]["invoiceId"]
          : ""
        : "";
      this.invoiceId = targetInvoice;
      this.imageId = newArr.length > 0 ? newArr[0]["imageId"] : "";
      this.getMessageInfo(newArr.map((a) => a.imageId));
      this.getErrorMessage(this.invoiceId);
      const imageURL0 = newArr.length > 0 ? newArr[0]["imageURL"] : "";
      this.handleClick(imageURL0, 0);
      // this.tabsInvoiceIndex = 0;
    },
    query() {
      const _this = this;
      axios
        .request({
          method: "post",
          url: `/api/server/qlresult`,
          data: {
            taskId: this.billNumber,
          },
        })
        .then((resp) => {
          let data = resp.data;
          if (data.status == 200) {
            _this.allData = data.data;
            _this.allData.imageInfo.map((img) => {
              return img.invoices.map((invo) => {
                const taxRate = Number(
                  ((invo.taxAmount / invo.amountWithoutTax) * 100).toFixed(2)
                );
                invo.taxRate = invo.amountWithoutTax ? `${taxRate}%` : "";
                return invo;
                // const sumR = invo.invoiceItems.reduce((acc, val) => {
                //   return acc.itemAmount+val.itemAmount;
                // });
              });
            });
            _this.handelAllImage();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getMessageInfo(imageIds) {
      const _this = this;
      let data = this.allData.imageInfo;
      let allInvoice = [];
      let filterInvoices = [];
      let filterImages = data.filter((img) => imageIds.includes(img.imageId));
      data.map((dd) => {
        allInvoice = allInvoice.concat(dd.invoices);
        _this.allImageInvoiceIds[dd.imageId] = dd.invoices.map(
          (di) => di.invoiceId
        );
        return true;
      });
      this.tabsInvoiceIndex = allInvoice.findIndex(
        (i) => i.invoiceId === _this.invoiceId
      );
      const panelSet = [
        { name: "buyerInfo-", need: ["purchaserName"] },
        { name: "sellerInfo-", need: ["sellerName"] },
        {
          name: "invoiceInfo-",
          need: ["invoiceItems", "invoiceFlights", "fpItems"],
        },
      ];
      if (imageIds.length === 0) {
        this.$set(this, "messageInfo", { invoices: allInvoice });
        const _thisKeys = Object.keys(allInvoice[0]);
        const panelNames = panelSet
          .filter((s) => {
            return (
              _thisKeys
                .map((k) => {
                  return s.need.includes(k);
                })
                .filter((i) => i).length > 0
            );
          })
          .map((ii) => ii.name);
        this.$set(
          this,
          "dataPanelOpen",
          ["baseInfo-", "otherInfo-"]
            .concat(panelNames)
            .map(
              (i) =>
                `${i}${
                  allInvoice.length > 0 ? allInvoice[0]["invoiceId"] : "0"
                }`
            )
        );
      } else {
        filterImages.map((a) => {
          filterInvoices = filterInvoices.concat(a.invoices);
          return true;
        });
        this.tabsInvoiceIndex = filterInvoices.findIndex(
          (i) => i.invoiceId === _this.invoiceId
        );
        this.$set(this, "messageInfo", { invoices: filterInvoices });
        const _thisKeys = Object.keys(filterInvoices[0]);
        const panelNames = panelSet
          .filter((s) => {
            return (
              _thisKeys
                .map((k) => {
                  return s.need.includes(k);
                })
                .filter((i) => i).length > 0
            );
          })
          .map((ii) => ii.name);
        this.$set(
          this,
          "dataPanelOpen",
          ["baseInfo-", "otherInfo-"]
            .concat(panelNames)
            .map(
              (i) =>
                `${i}${
                  filterInvoices.length > 0
                    ? filterInvoices[0]["invoiceId"]
                    : "0"
                }`
            )
        );
      }
    },
    getErrorMessage(invoiceIdP) {
      const _this = this;
      _this.currentInvoiceErrorFields = [];
      _this.setCurrentInvoiceErrorFields([]);
      const panelSet = [
        { name: "buyerInfo-", need: ["purchaserName"] },
        { name: "sellerInfo-", need: ["sellerName"] },
        {
          name: "invoiceInfo-",
          need: ["invoiceItems", "invoiceFlights", "fpItems"],
        },
      ];
      let allInvoice = [];
      this.allData.imageInfo.map((dd) => {
        allInvoice = allInvoice.concat(dd.invoices);
      });
      const fI = allInvoice.find((x) => x.invoiceId === invoiceIdP);
      const _thisKeys = Object.keys(fI);
      const panelNames = panelSet
        .filter((s) => {
          return (
            _thisKeys
              .map((k) => {
                return s.need.includes(k);
              })
              .filter((i) => i).length > 0
          );
        })
        .map((ii) => ii.name);
      _this.$set(
        _this,
        "dataPanelOpen",
        ["baseInfo-", "otherInfo-"]
          .concat(panelNames)
          .map((i) => `${i}${invoiceIdP || "0"}`)
      );
      // this.invoiceFieldsSetting = getInvoiceFields(fI.invoiceType);
      // console.log('xx', this.invoiceFieldsSetting)
      this.currentInvoiceType = fI.invoiceType;
      let findImgId = "";
      if (this.currentInvoiceRuleId !== "") {
        const findRule = _this.allData.data.find(
          (r) => r.ruleType === "IMAGES"
        );
        const findRet = findRule.result.find(
          (rr) => rr.ruleId === _this.currentInvoiceRuleId
        );

        let dataImgIds = Object.keys(_this.allImageInvoiceIds);
        findImgId = dataImgIds.find((k) => {
          return _this.allImageInvoiceIds[k].includes(invoiceIdP);
        });
        let fieldsImgs = findRet.imageData.find(
          (ee) => ee.imageId === findImgId
        );
        let fieldsInvoice = fieldsImgs.infos.find(
          (ei) => ei.invoiceId === invoiceIdP
        );
        _this.currentInvoiceErrorFields = fieldsInvoice.fields || [];
        _this.setCurrentInvoiceErrorFields(_this.currentInvoiceErrorFields);
      } else {
        findImgId = _this.imageId;
      }
      _this.editInvoice = _.cloneDeep(
        _this.messageInfo.invoices[_this.tabsInvoiceIndex]
      );
      const rr = { imageId: findImgId, invoiceId: invoiceIdP };
      _this.getEditField(rr);
    },
    getEditField(request) {
      const _this = this;
      let editFields = [];
      let editFieldsItems = [];
      _this.editFields = editFields;
      _this.editFieldsItems = editFieldsItems;
      _this.setEditFields([]);
      _this.setEditFieldsItems([]);
      const loadingInstance = Loading.service({
        fullscreen: true,
        background: "hsla(0,0%,100%,.2)",
      });
      axios
        .request({
          method: "post",
          url: `/api/server/isfirstedit`,
          data: request,
        })
        .then((resp) => {
          loadingInstance.close();
          let data = resp.data;
          if (data.code === 20000) {
            _this.invoiceIsFirstEdit = data.data.isFirstEdit;
            if (data.data.isFirstEdit == true) {
              return false;
            }
            const allKeyNames = data.data.edit.map((k) => k.keyName);
            editFields = allKeyNames.filter((f) => f.indexOf(".") === -1);
            const items = allKeyNames.filter((f) => f.indexOf(".") !== -1);
            let itemsKey = []; // 'invoiceItems';
            items.map((ik) => {
              const ss = ik.split(".");
              const itemIndex = Number(ss[1]);
              itemsKey.push(ss[0]);

              editFieldsItems[itemIndex] = editFieldsItems[itemIndex] || [];
              editFieldsItems[itemIndex].push(ss[2]);
            });
            itemsKey = [...new Set([...itemsKey])];
            _this.setEditFields(editFields);
            _this.setEditFieldsItems(editFieldsItems);
            _this.editFields = editFields;
            _this.editFieldsItems = editFieldsItems;
            editFields.map((ek) => {
              const findObj = data.data.edit.find((f) => f.keyName === ek);
              _this.editInvoice[ek] = findObj.keyValue;
            });
            if (itemsKey.length > 0) {
              editFieldsItems.map((row, ii) => {
                if (ii === 0) return true;
                row.map((rowK) => {
                  const iiKey = `${itemsKey[0]}.${ii}.${rowK}`;
                  const findObj = data.data.edit.find(
                    (f) => f.keyName === iiKey
                  );
                  _this.editInvoice[itemsKey[0]][ii - 1][rowK] =
                    findObj.keyValue;
                });
              });
            }
          } else {
            Notification.closeAll();
            Notification({
              message: data.msg || data.message,
              type: "warning",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
    getFieldError(vo, currentKey, currentVal) {
      const _this = this;
      const ruleRequest = {
        ruleId: _this.currentInvoiceRuleId,
        billNumber: _this.allData.billNo, // this.billNumber,
        taskId: _this.allData.taskId,
        keyName: currentKey,
        value: currentVal,
      };
      this.getRuleInvoice(ruleRequest, false);
    },
    handleTab(index, invoiceId) {
      const _this = this;
      this.isReadonly = true;
      this.tabsInvoiceIndex = index;
      this.invoiceId = invoiceId;
      this.getErrorMessage(invoiceId);
      const fi = this.imageData.map((id) =>
        id.invoices.filter((ii) => ii["invoiceId"] === invoiceId)
      );
      const findImg = fi.filter((fii) => fii.length > 0)[0][0].imageId;
      _this.allData.imageInfo.map((iid, i) => {
        if (iid.imageId == findImg) {
          _this.handleClick(iid.imageURL, i);
          return false;
        }
      });
    },
    handleClick(url, index) {
      this.imgSrc = url;
      this.imgIndex = index;
    },
    showImgbox() {
      this.showbigimg = !this.showbigimg;
      this.showImgData = [];
      this.showImgData.push(this.imageData[this.imgIndex]);
    },
    handleSubmitData(formRef, formData) {
      const changeField = [
        ...new Set([...this.correctData.map((t) => t.fieldKeyName)]),
      ];
      const changeFieldObj = [];
      changeField.map((k, i) => {
        let t = {};
        this.correctData.map((kn) => {
          if (k === kn.fieldKeyName) {
            t = { ...kn };
            t.fieldKeyValue = formData[kn.fieldKeyName];
            changeFieldObj[i] = t;
          }
        });
      });
      const changeItemField = [
        ...new Set([
          ...this.correctItemData.map(
            (t) => `${t.fieldKeyName}-${t.lineNumber}`
          ),
        ]),
      ];
      const changeItemFieldObj = [];
      changeItemField.map((k, i) => {
        let t = {};
        this.correctItemData.map((kn) => {
          if (k === `${kn.fieldKeyName}-${kn.lineNumber}`) {
            t = { ...kn };
            t.fieldKeyValue =
              formData[kn.parentKeyName][kn.lineNumber - 1][kn.fieldKeyName];
            changeItemFieldObj[i] = t;
          }
        });
      });
      console.log([...changeFieldObj, ...changeItemFieldObj]);
      const postEditData = [...changeFieldObj, ...changeItemFieldObj];
      if (postEditData.length === 0) {
        Notification.closeAll();
        Notification({
          message: "未修改数据",
          type: "warning",
          duration: 2000,
        });
        return false;
      }
      const _this = this;
      const loadingInstance = Loading.service({
        fullscreen: true,
        background: "hsla(0,0%,100%,.2)",
      });
      const postBody = {
        billNumber: _this.allData.billNo,
        taskId: _this.allData.taskId,
        imageUrl: _this.imgSrc,
        imageId: _this.imageId,
        invoiceId: _this.invoiceId,
        invoiceType: formData.invoiceType,
        data: postEditData,
      };
      axios
        .request({
          method: "post",
          url: `/api/server/save`,
          data: postBody,
        })
        .then((resp) => {
          loadingInstance.close();
          let data = resp.data;
          if (data.code === 20000) {
            _this.isReadonly = true;
            _this.invoiceIsFirstEdit = false;
            _this.correctData = [];
            _this.correctItemData = [];
            const rr = { imageId: _this.imageId, invoiceId: _this.invoiceId };
            _this.getEditField(rr);
          } else {
            Notification.closeAll();
            Notification({
              message: data.msg || data.message,
              type: "warning",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loadingInstance.close();
        });
    },
    handleCorrectField(field, fieldName) {
      const tmpObj = {
        fieldName: fieldName,
        fieldKeyName: field,
      };
      this.correctData.push(tmpObj);
    },
    handleCorrectItemField(i, field, fieldName, p) {
      const tmpObj = {
        fieldName: fieldName,
        fieldKeyName: field,
        lineNumber: i + 1,
        parentKeyName: p,
      };
      this.correctItemData.push(tmpObj);
    },
    onPickInvoiceType(invoiceTypeValue) {
      this.handleCorrectField("invoiceType", "发票类型");
      this.currentInvoiceType = invoiceTypeValue;
      this.$set(this.editInvoice, "invoiceType", invoiceTypeValue);
    },
    invoiceTypeFormatter(label) {
      return label.slice(-1)[0];
    },
    goEdit() {
      this.isReadonly = false;
      this.showInvoiceRaw = false;
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="less" scoped>
.item {
  margin-bottom: 20px;
}
.ticketType {
  /deep/.ivu-card-body {
    display: flex;
    align-items: center;
    p {
      width: 300px;
      color: #1991dd;
      margin: 0 15px;
    }
  }
}
/deep/.el-dialog {
  width: 30%;
}
.conBox {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .leftCon {
    width: 50%;
  }
  .rightCon {
    width: 48%;
  }
}
.cardTit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rightCon {
  /deep/.ivu-card-head {
    padding: 8px 16px;
  }
}
/deep/.ivu-card-head {
  background: #1991dd;
  p {
    color: #fff;
    font-weight: 400;
    display: inline-block;
    width: auto;
  }
}
.countBox {
  // width: 50%;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.imgBox {
  width: 100%;
  height: 450px;
  display: flex;
  .leftImg {
    width: 90%;
    border: 0;
    position: relative;
    .bigImg {
      width: 100%;
      max-height: 450px;
      height: 100%;
      border: 0;
    }
  }
  .rightImg {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .smallImgBox {
      position: relative;
      margin-bottom: 5px;
      min-height: 50px;
    }
    .smallImgBox:last-child {
      margin-bottom: 0;
    }
    .index-icon {
      margin-top: -9px;
      display: block;
      width: 18px;
      height: 18px;
      background: rgba(25, 145, 221, 0.6);
      border-radius: 50%;
      text-align: center;
      line-height: 18px;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      position: absolute;
      right: 5px;
      top: 50%;
    }
    .smallImg {
      width: 100%;
      border-radius: 8px;
      height: 50px;
    }
  }

  /* 设置滚动条的样式 */
  .rightImg::-webkit-scrollbar {
    width: 3px;
  }
  /* 滚动槽 */
  .rightImg::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  /* 滚动条滑块 */
  .rightImg::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
  .rightImg::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255, 0, 0, 0.4);
  }
}
.conBoxs {
  width: 100%;
  // height: 500px;
  margin-top: 20px;
  display: flex;
  .tabs {
    width: 8%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .tabItem {
      width: 100%;
      height: 50px;
      color: #333;
      background: #fafafa;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px 0 0 10px;
    }
  }
  .tabData {
    flex: 1;
    height: 100%;
  }
}
.active {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px 0 0 10px;
  width: 100%;
  height: 50px;
  background: #1991dd;
  color: #fff;
}
.tool {
  position: absolute;
  bottom: 0;
  left: 50%;
  right: 0;
  height: 60px;
  width: 240px;
  margin-left: -120px;
}
.tool a {
  display: block;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 20px;
  float: left;
  margin: 0 10px 0 10px;
  border-radius: 5px;
}

.tool a img {
  display: block;
  width: 20px;
  margin: 10px auto 0 auto;
}
.infoBox {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  display: flex;
  border: 1px solid #eee;
  .info-box-left,
  .info-box-right {
    height: 100%;
    position: relative;
    .billnumber-bar {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #eee;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .info-box-left {
    width: 60%;
    border-right: 1px solid #eee;
    position: relative;
  }
  .info-box-right {
    width: 40%;
  }
}
.invoice-scroll {
  margin-top: 50px;
  // position: absolute;
  // top: 50px;
  // left: 0;
  // right: 0;
  // bottom: 0;
  overflow-y: auto;
}
.rule-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eeeeee;
  &.td-nowrap {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  thead {
    background-color: #eeeeee;
  }
  tr {
    border: 1px solid #eeeeee;
  }
  td {
    max-width: 130px;
    padding: 10px 0;
    text-align: center;
  }
  th {
    max-width: 130px;
    padding: 10px 0;
    text-align: center;
  }
  .ivu-tooltip {
    width: 100%;
    text-align: center;
    display: inline-block;
  }
  .ivu-tooltip-rel {
    // max-width: 130px;
    width: 100%;
    text-align: center;
  }
}
/deep/.el-collapse-item__content {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
/deep/.ivu-form-item {
  margin-bottom: 0.5rem;
}
/deep/.ivu-form-label-left .ivu-form-item-label {
  text-align: justify;
}
/deep/.ivu-form-label-left .ivu-form-item-label::after {
  content: "";
  display: inline-block;
  padding-left: 100%;
}
// , fieldset[disabled] .ivu-input
/deep/.ivu-input[readonly] {
  color: #333;
  background-color: #f3f3f3;
}
/deep/.el-collapse-item__wrap {
  border: none;
}
/deep/.el-collapse-item__header {
  position: relative;
  border: none;
}
/deep/.el-collapse-item__header::after {
  content: " ";
  width: calc(100% - 20rem);
  border-top: 1px solid #999;
  position: absolute;
  // right: 2.5rem;
  right: 26px;
  overflow: hidden;
}
/deep/.el-collapse-item__header {
  padding-left: 0.5rem;
  border-left: 2px solid #1991dd;
}
/deep/.result-data-modal .ivu-modal-body .ivu-row {
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
}
/deep/.result-data-modal .ivu-modal-body .ivu-row .thead-name {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #606266;
  padding: 10px 0 12px 0;
  background: #eef1f6;
  border-bottom: 1px solid #fff;
}
/deep/.result-data-modal .ivu-modal-body .ivu-row,
/deep/.result-data-modal .ivu-modal-body .table-row {
  display: flex;
}
/deep/.el-table__append-wrapper {
  overflow: visible;
}
/deep/.ivu-tooltip,
/deep/.ivu-tooltip-rel {
  display: inherit;
}

/deep/.el-button--primary.is-plain {
  color: #1991dd;
  background: #ffffff;
  border-color: #1991dd;
}
/deep/.el-button--primary.is-plain:focus,
/deep/.el-button--primary.is-plain:hover {
  color: #ffffff;
  background: #1991dd;
  border-color: #1991dd;
}
/deep/.text-highlight,
/deep/.text-highlight .ivu-input {
  background-color: #fffa99;
}
/deep/.hover-primary:hover {
  cursor: pointer;
  background-color: #ecf5ff;
  // #b3d8ff
}
/deep/.data-header {
  // padding: 10px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border: 1px solid #eeeeee;
  background: #fafafa;
  position: relative;
}
/deep/.data-header .ivu-btn-text.btn-active {
  background-color: #1991dd;
  color: #fff;
}
/deep/.data-header .ivu-btn-text {
  height: 45px;
  border-radius: 0;
  background-color: inherit;
  color: inherit;
  border: none;
}
/deep/.text-primary {
  color: #1991dd;
}
/deep/.pr-1 {
  position: absolute;
  right: 1rem;
}
/deep/.ivu-input-icon,
/deep/.icon-danger {
  color: #fe3d3d;
  font-weight: 700;
  cursor: pointer;
  font-size: 18px;
  vertical-align: text-bottom;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover > td.text-highlight {
  background-color: #fffa99;
}
/deep/.rule-table .ivu-tooltip-rel {
  max-width: 130px;
  text-overflow: ellipsis;
  overflow: hidden;
}
/deep/.imgBox .rightImg .index-icon.red-index {
  background-color: rgba(254, 61, 61, 0.6);
}
</style>
