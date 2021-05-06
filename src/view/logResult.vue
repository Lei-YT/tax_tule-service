<template>
  <div class="wraps">
    <div id="list">
      <!-- 头部 -->
      <Card style="width: 100%" class="ticketType">
        <p>单据类型：{{ allData.billType }}</p>
        <p>单据编号：{{ allData.billNumber }}</p>
      </Card>
      <!-- 内容 -->
      <div class="conBox">
        <div class="leftCon">
          <ResultItem :data="allData.data"></ResultItem>
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
                <!-- <div class="tool">
                  <a href="javascript:;" class="narrow" @click="zoom('narrow')">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFhUlEQVR4Xu3d0W0TYBRD4WQSRgVGZZIgBihuLYGu4i/Pvurv4xz1Mc+HDwIIfEjgiQ0CCHxMgCC+HQj8hQBBfD0QIIjvAAIdAf9BOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECBBkZWs2OAEE6bq5GCBBkZGg1OwIE6bi5GiFAkJGh1ewIEKTj5mqEAEFGhlazI0CQjpurEQIEGRlazY4AQTpurkYIEGRkaDU7AgTpuLkaIUCQkaHV7AgQpOPmaoQAQUaGVrMjQJCOm6sRAgQZGVrNjgBBOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECBBkZWs2OAEE6bq5GCBBkZGg1OwIE6bi5GiFAkJGh1ewIEKTj5mqEAEFGhlazI0CQjpurEQIEGRlazY4AQTpurkYIEGRkaDU7AgTpuLkaIUCQkaHV7AgQpOPmaoQAQUaGVrMjQJCOm6sRAgQZGVrNjgBBOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECBBkZWs2OAEE6bq5GCBBkZGg1OwIE6bi5GiFAkJGh1ewIEKTj5mqEAEFGhlazI0CQjpurEQIEGRlazY4AQTpurkYIEGRkaDU7AgTpuLkaIUCQkaHV7AgQpOPmaoQAQUaGVrMjQJCOm6sRAgQZGVrNjgBBOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECXxbk9Xr9eDwe30b4qPleBH49n88/399Pf1pBvn/6LwgicIfAT4LcGcNL7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hH4b4L4+YN743tRJvDvf/4gv0ECgfch8OXfB3mf6pogkAkQJDOSGCZAkOHxVc8ECJIZSQwTIMjw+KpnAgTJjCSGCRBkeHzVMwGCZEYSwwQIMjy+6pkAQTIjiWECBBkeX/VMgCCZkcQwAYIMj696JkCQzEhimABBhsdXPRMgSGYkMUyAIMPjq54JECQzkhgmQJDh8VXPBAiSGUkMEyDI8PiqZwIEyYwkhgkQZHh81TMBgmRGEsMECDI8vuqZAEEyI4lhAgQZHl/1TIAgmZHEMAGCDI+veiZAkMxIYpgAQYbHVz0TIEhmJDFMgCDD46ueCRAkM5IYJkCQ4fFVzwQIkhlJDBMgyPD4qmcCBMmMJIYJEGR4fNUzAYJkRhLDBAgyPL7qmQBBMiOJYQIEGR5f9UyAIJmRxDABggyPr3omQJDMSGKYAEGGx1c9EyBIZiQxTIAgw+OrngkQJDOSGCZAkOHxVc8ECJIZSQwTIMjw+KpnAgTJjCSGCRBkeHzVMwGCZEYSwwQIMjy+6pkAQTIjiWECBBkeX/VMgCCZkcQwAYIMj696JkCQzEhimABBhsdXPRMgSGYkMUyAIMPjq54JECQzkhgmQJDh8VXPBAiSGUkMEyDI8PiqZwIEyYwkhgkQZHh81TMBgmRGEsMECDI8vuqZAEEyI4lhAgQZHl/1TIAgmZHEMAGCDI+veiZAkMxIYpgAQYbHVz0TIEhmJDFMgCDD46ueCRAkM5IYJkCQ4fFVzwR+A0/LoMnXZPSEAAAAAElFTkSuQmCC"
                    />
                  </a>
                  <a href="javascript:;" class="rotate" @click="rotateLeft">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjAzMDY5OENCQkI0MTFFN0I3MTdFNUNERjk4QTREOEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjAzMDY5OERCQkI0MTFFN0I3MTdFNUNERjk4QTREOEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MDMwNjk4QUJCQjQxMUU3QjcxN0U1Q0RGOThBNEQ4QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MDMwNjk4QkJCQjQxMUU3QjcxN0U1Q0RGOThBNEQ4QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiYn1AQAAA7gSURBVHja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"
                    />
                  </a>
                  <a href="javascript:;" class="rotate" @click="rotateRight">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjRDMzMzOUJCQzUwMTFFN0I3MTdFNUNERjk4QTREOEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjRDMzMzOUNCQzUwMTFFN0I3MTdFNUNERjk4QTREOEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MDMwNjk4RUJCQjQxMUU3QjcxN0U1Q0RGOThBNEQ4QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NEMzMzM5QUJDNTAxMUU3QjcxN0U1Q0RGOThBNEQ4QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoZxBo0AAA8KSURBVHja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"
                    />
                  </a>
                  <a
                    href="javascript:;"
                    class="enlarge"
                    @click="zoom('enlarge')"
                  >
                    <img
                      src="data:image/png;base64,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"
                    />
                  </a>
                </div> -->
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
                              <p style="padding: 5px 15px" flex :key="kk + i" class="flex-space">
                                <span flex-box="0">{{ kk }}：</span>
                                <span
                                flex-box="1"
                                style="text-align:right"
                              >{{vv||'--'}}</span>
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
import ResultItem from "@/components/resultItem/index";
import { matchCNkeys } from "@/libs/invoice";
import axios from "axios";
// import jsonpath from "jsonpath";
import store from "@/store";
export default {
  components: { ResultItem },
  data() {
    return {
      allData: JSON.parse(JSON.stringify(resultJson)),
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
    this.allData = resultJson;
    this.imageData = resultJson.imageInfo;
    this.imgSrc = resultJson.imageInfo[0].imageURL;
    this.imageId = resultJson.imageInfo[0]["imageId"];
    this.getMessageInfo(this.imageId);
    // this.getErrorFieldCode(this.invoiceId);
  },
  mounted() {
    this.query();
  },

  methods: {
    query() {
      const _this = this;
      axios({
        url: `http://10.15.196.127/api/ql/result?billNumber=${this.billNumber}`,
        method: "GET",
        success: (res) => {
          console.log(res, "详情");
          _this.allData = res.data.data;
          _this.imageData = res.data.data.imageInfo;
          _this.imgSrc = res.data.data.imageInfo[0].imageURL;
          _this.imageId = res.data.data.imageInfo[0]["imageId"];
          _this.getMessageInfo(_this.imageId);
        },
      });
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
</style>
