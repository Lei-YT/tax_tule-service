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
                </div>
              </div>
              <el-collapse
                v-model="activeName"
                v-if="item.ruleType == 'IMAGES' || item.ruleType == 'OTHERS'"
              >
                <el-collapse-item title="未通过规则" v-bind:name="item.ruleType+'1'">
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
                        })" v-bind:key="i" @click="rowClick(n)">
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
                  </template>
                </el-collapse-item>
                <el-collapse-item title="通过规则" v-bind:name="item.ruleType+'2'">
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
                        })" v-bind:key="i">
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
              <div class="countBox">
                <Button @click="handelAllImage">返回全部展示</Button>
              </div>
            </div>

            <div class="bigimgbox" v-if="showbigimg" style="position: fixed;z-index: 9999;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.3);left:0;top:0;display: flex;justify-content: center;align-items: center;">
                <div class="showbigimgbox" style="width: 1400px;height: 757px;background-color: #fff;">
                    <div class="showimg-title" style="display: flex;justify-content: space-between; align-items:center;width: 100%;height: 46px; border-bottom: 1px solid #999999;padding:0 20px;">
                      <div style="color: #1991DD;font-size: 16px;display: flex;align-items: center;"><img src="@/assets/images/tupian-2.png" style="width: 22px;height: 19px;margin-right: 8px;" />查看图片</div>
                      <div  @click="showImgbox()"><img src="@/assets/images/closebox.png" style="width: 19px;height: 19px;" /></div>
                    </div>
                    <div class="showimg-content" style="padding: 22px 20px;">
                      <ImagePreview :items="showImgData" height="667px" width="1360px"/>
                    </div>
                </div>
            </div>
            <div class="imgBox">
              <div class="leftImg">
                <img :src="imgSrc" class="bigImg" @click="showImgbox()" />
              </div>
              <div class="rightImg">
                <div class="smallImgBox" v-for="(item, index) in imageData" :key="index"
                    @click="handleClick(item.imageURL,index);handelImage(item);">
                  <img
                    :src="item.imageURL"
                    class="smallImg"
                  />
                  <span class="index-icon">{{index+1}}</span>
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
                  @click="handleTab(index, item['发票ID'])"
                >
                  {{ index + 1 }}
                </Button>
              </div>
              <template v-for="(vo, index) in messageInfo.invoices">
                <div
                  :key="vo.invoiceId + index"
                  v-if="tabsInvoiceIndex == index"
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
                        <template v-if="errorMessage.length">
                          <p
                            style="padding: 5px 15px"
                            flex
                            v-for="(v, i) in errorMessage"
                            :key="i"
                          >
                            <span flex-box="0">{{ i + 1 }}、</span>
                            <span flex-box="1">{{ v }}</span>
                          </p>
                        </template>
                        <p v-else style="color: #999; padding: 10px 20px">
                          无影像报错信息
                        </p>
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
import resultJson from '@/dataJson/result.json'
import ImagePreview from '@/components/image-preview'
import { matchCNkeys } from '@/libs/invoice'
import axios from 'axios'
export default {
  components: { ImagePreview },
  data () {
    return {
      allData: [],
      activeName: ['IMAGES1', 'OTHERS1'], // "IMAGES1",
      imageData: [],
      imgSrc: '',
      messageInfo: {},
      imageId: '',
      invoiceId: '',
      cur: 0,
      errorFieldCode: [],
      errorMessage: [],
      billNumber: '',
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 65
        },
        {
          title: '规则',
          slot: 'ruleName'
        },
        {
          title: ' ',
          slot: 'icon',
          width: 65
        },
        {
          title: '审核结果',
          slot: 'message'
        }
      ],
      columns1: [
        {
          title: '序号',
          type: 'index',
          width: 65
        },
        {
          title: '预警等级',
          slot: 'grade',
          width: 90
        },
        {
          title: '规则',
          slot: 'ruleName'
        },
        {
          title: '审核结果',
          slot: 'message'
        }
      ],
      tabsInvoiceIndex: 0,
      showbigimg: false,
      imgIndex: 0,
      showImgData: []
    }
  },

  mounted () {
    // const _this = this;
    // let data  = resultJson;
    // console.log(data, "..........");
    // if (data.status == 200) {
    //   _this.allData = data.data;
    //   _this.imageData = data.data.imageInfo;
    //   _this.imgSrc = data.data.imageInfo[0].imageURL;
    //   _this.imageId = data.data.imageInfo[0]["imageId"];
    //   _this.getMessageInfo(_this.imageId);
    // }

    this.billNumber = this.$route.query.billNumber
    this.query()

    this.handelAllImage()
  },
  computed: {
  },
  methods: {
    handelAllImage (type) {
      // return false;
      const _this = this
      _this.imageData = _this.allData.imageInfo
      _this.invoiceId = _this.imageData[0]['invoices'][0]['发票ID']
      _this.imageId = _this.allData.imageInfo[0]['imageId']
      _this.getMessageInfo([])
      _this.getErrorMessage(_this.invoiceId)
      _this.tabsInvoiceIndex = 0
      if (type === 'Refresh') {
      }
    },
    // 右边小图点击事件
    handelImage (data) {
      console.log('handelImage(data)', data)
      this.tabsInvoiceIndex = 0
      this.invoiceId = data['invoices'][0]['发票ID']
      this.imageId = data.imageId
      this.getMessageInfo([data.imageId])
      this.getErrorMessage(this.invoiceId)
    },
    rowClick (vo, i) {
      if (vo.hasOwnProperty('imageData') && vo.imageData.length > 0) {
        let ids = vo.imageData.map((voi) => {
          return voi.imageId
        })
        this.setImageData(ids)
      }
    },
    setImageData (arr) {
      let newArr = [],
        data = this.allData.imageInfo
      for (let i = 0; i < data.length; i++) {
        if (arr.indexOf(data[i]['imageId']) != -1) {
          newArr.push(data[i])
        }
      }
      this.imageData = newArr
      this.invoiceId = this.imageData[0]['invoices'][0]['发票ID']
      this.imageId = this.imageData[0]['imageId']
      this.getMessageInfo(newArr.map(a => a.imageId))
      this.getErrorMessage(this.invoiceId)
      this.handleClick(this.imageData[0].imageURL, 0)
      this.tabsInvoiceIndex = 0
    },
    query () {
      const _this = this
      axios
        .get(`http://10.15.196.127/api/ql/result?billNumber=${this.billNumber}`)
        .then((resp) => {
          let data = resp.data
          if (data.status == 200) {
            _this.allData = data.data
            _this.imageData = data.data.imageInfo
            _this.imgSrc = data.data.imageInfo[0].imageURL
            _this.imageId = data.data.imageInfo[0]['imageId']
            _this.invoiceId = data.data.imageInfo[0]['invoices'][0]['发票ID']
            _this.getMessageInfo([])
            _this.getErrorMessage(_this.invoiceId)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getMessageInfo (imageIds) {
      let data = this.allData.imageInfo
      let allInvoice = []
      for (let i = 0; i < data.length; i++) {
        const _dataI = {
          ...data[i],
          invoices: data[i].invoices.map((io) => {
            return matchCNkeys(io.invoiceType, io)
          })
        }
        data[i] = _dataI
        allInvoice = allInvoice.concat(_dataI.invoices)
      }
      if (imageIds.length === 0) {
        this.$set(this, 'messageInfo', { invoices: allInvoice })
      } else {
        this.$set(this, 'messageInfo', { invoices: allInvoice.filter(a => imageIds.includes(a.imageId)) })
      }
    },
    getErrorMessage (invoiceIdP) {
      const _this = this
      _this.errorMessage = []
      let error = this.allData.errors
      let findErrorMsg = []
      error.map(e => {
        findErrorMsg = findErrorMsg.concat(e.infos)
        return true
      })
      let findMsg = findErrorMsg.filter(fi => fi.invoiceId === invoiceIdP)
      _this.errorMessage = findMsg[0].messages
    },
    handleTab (index, invoiceId) {
      const _this = this
      this.tabsInvoiceIndex = index
      this.invoiceId = invoiceId
      this.getErrorMessage(invoiceId)
      const fi = this.imageData.map(id => id.invoices.filter(ii => ii['发票ID'] === invoiceId))
      const findImg = fi.filter(fii => fii.length > 0)[0][0].imageId
      _this.allData.imageInfo.map((iid, i) => {
        if (iid.imageId == findImg) {
          _this.handleClick(iid.imageURL, i)
          return false
        }
      })
    },
    handleClick (url, index) {
      this.imgSrc = url
      this.imgIndex = index
    },
    showImgbox () {
      this.showbigimg = !this.showbigimg
      this.showImgData = []
      this.showImgData.push(this.imageData[this.imgIndex])
    }
  }
}
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
.rightCon{
  /deep/.ivu-card-head {
    padding: 8px 16px;
  }
}
/deep/.ivu-card-head {
  background: #1991dd;
  p {
    color: #fff;
    font-weight: 400;
  }
}
.countBox {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-around;
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
      height: 100%;
      border: 0;
    }
  }
  .rightImg {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .smallImgBox{
      position:relative;
      margin-bottom: 5px;
    }
    .smallImgBox:last-child{
      margin-bottom: 0;
    }
    .index-icon{
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
      color: #FFFFFF;
      position:absolute;
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
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
    border-radius:10px;
  }
  /* 滚动条滑块 */
  .rightImg::-webkit-scrollbar-thumb {
    border-radius:10px;
    background:rgba(0,0,0,0.1);
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
  }
  .rightImg::-webkit-scrollbar-thumb:window-inactive {
    background:rgba(255,0,0,0.4);
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
