<template>
  <div class="wraps">
    <div id="list">
      <!-- 头部 -->
      <Card style="width: 100%" class="ticketType">
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
                <p v-if="item.ruleType == 'WARNING'">超预警通知</p>
                <div class="countBox">
                  <p
                    v-if="
                      item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'
                    "
                  >
                    规则：{{ item.ruleCount }}条
                    &nbsp;&nbsp;&nbsp;
                    报错：{{ item.errorCount }}条
                  </p>
                  <p v-if="item.ruleType == 'WARNING'">
                    预警数：{{ item.ruleCount }}条
                  </p>
                </div>
              </div>
              <el-collapse
                @change="handleChange"
                v-if="item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'"
              >
                <el-collapse-item title="未通过规则" name="1">
                  <template
                    v-if="
                      item.result.filter((obj) => {
                        return obj.correct == false;
                      }).length
                    "
                  >
                    <table style="width: 100%;" class="rule-table">
                      <thead>
                        <tr>
                          <th width="60">序号</th>
                          <th style="text-align: left;">规则</th>
                          <th width="60"></th>
                          <th width="200" style="text-align: left;">审核结果</th>
                        </tr>                        
                      </thead>
                      <tbody>                        
                        <tr v-for="(n,i) in item.result.filter((obj) => {
                          return obj.correct == false;
                        })">
                          <td style="text-align: center;">{{ i+1 }}</td>
                          <td>{{ n.ruleName }}</td>
                          <td style="text-align: center;">
                              <Icon
                              type="md-close-circle"
                              size="25"
                              color="#E02020"
                            />
                          </td>
                          <td>{{ n.message ? n.message : "——" }}</td>
                        </tr>  
                      </tbody>
                    </table>
                    <!-- <Table
                      size="small"
                      :columns="columns"
                      :data="
                        item.result.filter((obj) => {
                          return obj.correct == false;
                        })
                      "
                    >
                      <template slot="ruleName" slot-scope="{ row }">
                        <div flex>
                          {{ row.ruleName }}
                          <Icon
                            type="md-close-circle"
                            size="18"
                            color="#E02020"
                            style="margin-left: 60%"
                          />
                        </div>
                      </template>
                      <template slot="message" slot-scope="{ row }">
                        {{ row.message ? row.message : "——" }}
                      </template>
                    </Table> -->
                  </template>
                </el-collapse-item>
                <el-collapse-item title="通过规则" name="2">
                  <template
                    v-if="
                      item.result.filter((obj) => {
                        return obj.correct == true;
                      }).length
                    "
                  >
                    <table style="width: 100%;" class="rule-table">
                      <thead>
                        <tr>
                          <th width="60">序号</th>
                          <th style="text-align: left;">规则</th>
                          <th width="60"></th>
                          <th width="200" style="text-align: left;">审核结果</th>
                        </tr>                        
                      </thead>
                      <tbody>                        
                        <tr v-for="(n,i) in item.result.filter((obj) => {
                          return obj.correct == true;
                        })">
                          <td style="text-align: center;">{{ i+1 }}</td>
                          <td>{{ n.ruleName }}</td>
                          <td style="text-align: center;">
                              <Icon
                              type="md-checkmark-circle"
                              size="25"
                              color="#6DD400"
                            />
                          </td>
                          <td>通过</td>
                        </tr>  
                      </tbody>
                    </table>
                    <!-- <Table
                      size="small"
                      :columns="columns"
                      :data="
                        item.result.filter((obj) => {
                          return obj.correct == true;
                        })
                      "
                    >
                      <template slot="ruleName" slot-scope="{ row }">
                        <div flex>
                          {{ row.ruleName }}
                          <Icon
                            type="md-checkmark-circle"
                            size="18"
                            color="#6DD400"
                            style="margin-left: 60%"
                          />
                        </div>
                      </template>
                      <template slot="message" slot-scope="{ row }">
                        {{ row.message ? row.message : "——" }}
                      </template>
                    </Table> -->
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
          <!-- <ResultItem :data="allData.data"></ResultItem> -->
        </div>
        <!-- 右面 -->
        <div class="rightCon">
          <Card style="width: 100%">
            <div class="cardTit" slot="title">
              <p>影像展示</p>
              <div class="countBox">
                <Button>返回全部展示</Button>
              </div>
            </div>
            <div class="imgBox">
              <div class="leftImg">
                <img :src="imgSrc" class="bigImg" />
              </div>
              <div class="rightImg">
                <img
                  :src="item.imageURL"
                  class="smallImg"
                  v-for="(item, index) in imageData"
                  :key="index"
                  @click="handleClick(item.imageURL)"
                />
              </div>
            </div>
            <div class="conBoxs">
              <div class="tabs">
                <div
                  :class="cur == index ? 'active' : 'tabItem'"
                  v-for="(item, index) in messageInfo.invoices"
                  :key="index"
                  @click="handleTab(index, item.invoiceId)"
                >
                  {{ index + 1 }}
                </div>
              </div>
              <template v-for="(vo, index) in messageInfo.invoices">
                <div
                  :key="vo.invoiceId + index"
                  v-if="cur == index"
                  class="infoBox"
                >
                  <div class="info-box-left">
                    <div class="billnumber-bar">
                      <b>结构化数据</b>
                    </div>
                    <div class="invoice-scroll scroll-style">
                      <template v-for="(value, key) in vo">
                        <template v-if="typeof value === 'object'">
                          <template v-for="(v, i) in value">
                            <template v-for="(vv, kk) in v">
                              <p
                                style="padding: 5px 15px"
                                flex
                                :key="kk + i"
                                class="flex-space"
                              >
                                <span flex-box="0">{{ kk }}：</span>
                                <span
                                  flex-box="1"
                                  style="text-align: right"
                                  :style="{
                                    color:
                                      errorFieldCode.indexOf(kk) != -1
                                        ? 'red'
                                        : '',
                                  }"
                                  >{{ vv || "--" }}</span
                                >
                              </p>
                            </template>
                          </template>
                        </template>
                        <template v-else>
                          <p style="padding: 5px 15px" flex :key="key">
                            <span flex-box="0">{{ key }}：</span>
                            <span flex-box="1" style="text-align: right">{{
                              value || "--"
                            }}</span>
                          </p>
                        </template>
                      </template>
                    </div>
                  </div>
                  <div class="info-box-right">
                    <div class="billnumber-bar">
                      <b>影像报错</b>
                    </div>
                    <div class="invoice-scroll scroll-style">
                      <div style="padding: 10px 0">
                        <!-- <template v-if="errorMessage.length">
                        <p style="padding:5px 15px" flex v-for="(v,i) in errorMessage" :key="i">
                          <span flex-box="0">{{i+1}}、</span>
                          <span flex-box="1">{{v}}</span>
                        </p>
                      </template>
                      <p v-else style="color:#999;padding:10px 20px">无影像报错信息</p> -->
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import resultJson from "@/dataJson/result.json";
// import ResultItem from "@/components/resultItem/index";
import { matchCNkeys } from "@/libs/invoice";
import axios from "axios";
// import jsonpath from "jsonpath";
import store from "@/store";
export default {
  // components: { ResultItem },
  data() {
    return {
      allData: [],
      imageData: [],
      imgSrc: "",
      messageInfo: {},
      imageId: "",
      invoiceId: "",
      cur: 0,
      errorFieldCode: [],
      billNumber: "",
    };
  },

  created() {
    this.billNumber = this.$route.query.billNumber;
    this.query();
  },
  methods: {
    query() {
      const _this = this;
      axios
        .get(`http://10.15.196.127/api/ql/result?billNumber=${this.billNumber}`)
        .then((resp) => {
          let data = resp.data;
          console.log(data, "..........");
          if (data.status == 200) {
            _this.allData = data.data;
            _this.imageData = data.data.imageInfo;
            _this.imgSrc = data.data.imageInfo[0].imageURL;
            _this.imageId = data.data.imageInfo[0]["imageId"];
            _this.getMessageInfo(_this.imageId);
            _this.getErrorFieldCode(_this.invoiceId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      
      // let data = {
      //   "status": 200,
      //   "message": "成功",
      //   "data": {
      //     "billType": "CRTG_机械租赁结算单",
      //     "versionName": "测试-1.2",
      //     "imageInfo": [{
      //       "imageId": "1388020616505200641",
      //       "billId": "1387964794877222913",
      //       "attachmentId": "1387964796051628033",
      //       "imageURL": "https://i.zhimacaipt.com/xueersi/2021/04/30/ff210ab02ea273db56dbc37e4d5a4301.jpg",
      //       "invoices": [{
      //         "invoiceFormName": "发票联",
      //         "purchaserBankAccount": "中国建设银行郑州市开发区支行4100150910059999999",
      //         "sellerName": "衢州鸿珍商贸有限公司",
      //         "isDaikai": "no",
      //         "sellerAddress": "浙江省衢州市江山市虎山街道南市街55号18767025705",
      //         "purchaserAddress": "郑州高新技术产业开发区科学大道99号0371-67283864",
      //         "invoicePrintNo": "26118196",
      //         "invoiceType": "增值税专用发票",
      //         "invoiceNo": "26118196",
      //         "amountWithoutTax": "94500.00",
      //         "specialSeal": "发票专用章",
      //         "invoiceDate": "2021-03-12",
      //         "invoiceCode": "3300203130",
      //         "purchaserName": "中铁隧道股份有限公司",
      //         "invoicePrintCode": "3300203130",
      //         "sellerTaxNo": "91330881MA2DJLGQ81",
      //         "invoiceItems": [{
      //           "itemUnitPrice": "135",
      //           "itemName": "*非金属矿石*人工砂",
      //           "itemQuantity": "700",
      //           "itemAmount": "94500",
      //           "itemModel": "0-5mm",
      //           "itemUnit": "立方米",
      //           "itemTaxAmount": "2835",
      //           "itemTaxRate": "3%"
      //         }],
      //         "purchaserTaxNo": "9141000017292850XF",
      //         "sellerBankAccount": "浙江江山农村商业银行股份有限公司营业部201000258502462",
      //         "invoiceId": "1388047416230834178",
      //         "invoiceSubType": "",
      //         "taxAmount": "2835",
      //         "amountWithTax": "97335.00",
      //         "fileType": "",
      //         "remarks": "中隧股份滇中引水大理I段4标项目部&lt;br/&gt;地址：大理州  鹤庆县"
      //       }, {
      //         "invoiceFormName": "发票联",
      //         "purchaserBankAccount": "中国建设银行郑州市开发区支行4100150910059999999",
      //         "sellerName": "衢州鸿珍商贸有限公司",
      //         "isDaikai": "no",
      //         "sellerAddress": "浙江省衢州市江山市虎山街道南市街55号18767025705",
      //         "purchaserAddress": "郑州高新技术产业开发区科学大道99号0371-67283864",
      //         "invoicePrintNo": "26118396",
      //         "invoiceType": "增值税专用发票",
      //         "invoiceNo": "26118396",
      //         "amountWithoutTax": "83928.15",
      //         "specialSeal": "发票专用章",
      //         "invoiceDate": "2021-03-15",
      //         "invoiceCode": "3300203130",
      //         "purchaserName": "中铁隧道股份有限公司",
      //         "invoicePrintCode": "3300203130",
      //         "sellerTaxNo": "91330881MA2DJLGQ81",
      //         "invoiceItems": [{
      //           "itemUnitPrice": "135",
      //           "itemName": "*非金属矿石*人工砂",
      //           "itemQuantity": "122.69",
      //           "itemAmount": "16563.15",
      //           "itemModel": "0-5mm",
      //           "itemUnit": "立方米",
      //           "itemTaxAmount": "496.89",
      //           "itemTaxRate": "3%"
      //         }, {
      //           "itemUnitPrice": "125",
      //           "itemName": "*非金属矿石*米石",
      //           "itemQuantity": "538.92",
      //           "itemAmount": "67365",
      //           "itemModel": "5-10mm",
      //           "itemUnit": "立方米",
      //           "itemTaxAmount": "2020.95",
      //           "itemTaxRate": "3%"
      //         }],
      //         "purchaserTaxNo": "9141000017292850XF",
      //         "sellerBankAccount": "浙江江山农村商业银行股份有限公司营业部201000258502462",
      //         "invoiceId": "1388047427672895489",
      //         "invoiceSubType": "",
      //         "taxAmount": "2517.84",
      //         "amountWithTax": "86445.99",
      //         "fileType": "",
      //         "remarks": "中隧股份滇中引水大理I段4标项目部    地址：大理州 鹤庆县"
      //       }]
      //     }],
      //     "errors": [],
      //     "data": [{
      //       "ruleCount": 8, //总条数
      //       "errorCount": 2, //报错条数
      //       "ruleType": "IMAGES",//影像规则
      //       "result": [{
      //         "ruleId": "CB5150927067",
      //         "ruleName": "影像.发票.发票代码=机器代码，且影像.发票.发票号码=机器号码", //规则名称
      //         "correct": true, //correct为true通过规则 false为未通过规则
      //         "ruleType": "IMAGE"
      //       }, {
      //         "ruleId": "WN5654539076",
      //         "ruleName": "影像.发票.购买方名称+纳税人识别号=表单.单据信息.所属法人及纳税人识别号",
      //         "correct": true,
      //         "ruleType": "IMAGE"
      //       }, {
      //         "ruleId": "XV8100705232",
      //         "ruleName": "专票影像.发票.购买方.地址、电话、开户行及账户≠空",
      //         "correct": true,
      //         "ruleType": "IMAGE"
      //       }, {
      //         "ruleId": "AJ3050537413",
      //         "ruleName": "增值税发票影像.发票.销售方.地址、电话、开户行及账户≠空",
      //         "correct": true,
      //         "ruleType": "IMAGE"
      //       }, {
      //         "ruleId": "BG9348516788",
      //         "ruleName": "影像.发票.联次=发票联",
      //         "correct": true,
      //         "ruleType": "IMAGE"
      //       }, {
      //         "ruleId": "CK9214631582",
      //         "ruleName": "影像.发票≠定额发票",
      //         "correct": true,
      //         "ruleType": "IMAGE"
      //       }, {
      //         "ruleId": "CP9865614318",
      //         "ruleName": "应有税控系统打印的销售清单",
      //         "correct": false,
      //         "message": "发票缺少对应的销售清单",
      //         "ruleType": "IMAGE"
      //       }, {
      //         "ruleId": "KE8266482421",
      //         "ruleName": "影像.发票.货物或应税劳务、服务名称=“*运输服务*”时，发票备注栏应包括将起运地、到达地、车种车号以及运输货物信息等内容，否则应另附相关内容清单",
      //         "correct": false,
      //         "message": "运输服务开具发票时应将起运地、到达地、车种车号以及运输货物信息等内容填写在发票备注栏中，如内容较多可另附清单", //correct为false,message为审核结果
      //         "ruleType": "IMAGE"
      //       }]
      //     }, {
      //       "ruleCount": 12,//规则条数
      //       "errorCount": 0,//报错条数
      //       "ruleType": "OTHERS", //非影像规则
      //       "result": [{
      //         "ruleId": "BQ9853735345",
      //         "ruleName": "表单.发票信息.发票类型=影像.发票.发票类型",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "XA9031558433",
      //         "ruleName": "表单.发票信息.发票代码=影像.发票.发票代码",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "GM6713065082",
      //         "ruleName": "表单.发票信息.发票号=影像.发票.发票号",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "EF6206350696",
      //         "ruleName": "表单.发票信息.开票日期=影像.发票.开票日期",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "KM3798346856",
      //         "ruleName": "表单.发票信息.税率=影像.发票.税率",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "LU8414349360",
      //         "ruleName": "表单.发票信息.价税合计=影像.发票.价税合计",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "EX3760127778",
      //         "ruleName": "表单.发票信息.金额=影像.发票.金额",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "YQ4976205447",
      //         "ruleName": "表单.发票信息.税额=影像.发票.税额",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "UT3161589338",
      //         "ruleName": "表单.发票信息.发票类别=“进项发票”",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "MT4373879470",
      //         "ruleName": "系统当前日期月数-表单.财务信息.制证日期月数≤3个月",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "CD8881882360",
      //         "ruleName": "表单.财务信息.制证日期-表单.发票信息.开票日期＜2个自然年",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }, {
      //         "ruleId": "QV4651922203",
      //         "ruleName": "表单.常用意见.节点含有“项目经理”、“项目书记”",
      //         "correct": true,
      //         "ruleType": "BILLS"
      //       }]
      //     }, {
      //       "ruleCount": 0,//预警条数
      //       "ruleType": "WARNING",//预警
      //       "result": []
      //     }]
      //   }
      // };
      
      console.log(data, "..........");
      if (data.status == 200) {
        _this.allData = data.data;
        _this.imageData = data.data.imageInfo;
        _this.imgSrc = data.data.imageInfo[0].imageURL;
        _this.imageId = data.data.imageInfo[0]["imageId"];
        _this.getMessageInfo(_this.imageId);
        _this.getErrorFieldCode(_this.invoiceId);
      }
    },
    getMessageInfo(imageId) {
      let data = this.allData.imageInfo;
      for (let i = 0; i < data.length; i++) {
        if (data[i]["imageId"] == imageId) {
          const _dataI = {
            ...data[i],
            invoices: data[i].invoices.map((io) => {
              return matchCNkeys(io.invoiceType, io);
            }),
          };
          this.$set(this, "messageInfo", _dataI);
        }
      }
    },
    // getErrorFieldCode(invoiceId) {
    //   let data = jsonpath.query(
    //     this.allData,
    //     `$..invoiceData[?(@.invoiceId==${invoiceId})]`
    //   );
    //   this.errorFieldCode = data[0].fields;
    // },
    zoom(str) {
      // var img = this.$refs.eImg,
      //   imgTop = parseInt(img.style.top.replace(/px/, "")),
      //   imgLeft = parseInt(img.style.left.replace(/px/, ""));
      // if (str == "enlarge") {
      //   if (img.offsetHeight > 2300) {
      //     return;
      //   }
      //   img.height = img.offsetHeight + 200;
      //   img.style.top = imgTop - 100 + "px";
      //   img.style.left = imgLeft - 100 + "px";
      // }
      // if (str == "narrow") {
      //   if (img.offsetHeight < 300) {
      //     return;
      //   }
      //   img.height = img.offsetHeight - 200;
      //   img.style.top = imgTop + 100 + "px";
      //   img.style.left = imgLeft + 100 + "px";
      // }
    },
    handleTab(index, invoiceId) {
      this.cur = index;
      this.invoiceId = invoiceId;
    },
    handleClick(url) {
      this.imgSrc = url;
    },
    submit() {},
  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.item {
  margin-bottom: 20px;
}
.ticketType {
  /deep/.ivu-card-body {
    display: flex;
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
/deep/.ivu-card-head {
  background: #1991dd;
  p {
    color: #fff;
    font-weight: 400;
  }
}
.countBox {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
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
.conBoxs {
  width: 100%;
  height: 500px;
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

.rule-table{
  width:100%;
  border-collapse:collapse;
  border: 1px solid #eeeeee;
  thead{
    background-color:#EEEEEE;
  }
  tr{
    border: 1px solid #EEEEEE; 
  } 
  td{
    padding:10px 0;
  }
  th{
    padding:10px 0;
  }
}
</style>
