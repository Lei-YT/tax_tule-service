<template>
  <div class="wraps">
    <div class="dataMonitor">
      <Card style="width: 100%">
        <div style="display: flex;justify-content: space-between;">
            <Form
              :inline="true"
              
              :label-width="80"
              class="demo-form-inline"
              ref="formInline"
            >
              
              <FormItem label="表单名称：" prop="name">
                <Select style="width: 200px;" v-model="selected" @on-change="getTypeSelected">
                    <Option :value="item.name" v-for="item in options" v-bind:key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="审核日期:" prop="checkBeginDate">
                <div class="numCount">
                  <Date-picker placeholder="选择日期" type="date"  format="yyyy-MM-dd"  >
                  </Date-picker>
                  <span style="margin: 0 5px">—</span>
                  <Date-picker placeholder="选择日期" type="date" format="yyyy-MM-dd" >
                  </Date-picker>
                  <!-- <Input
                    v-model="formInline.checkBeginDate"
                    placeholder="请输入"
                  /> -->
                  <!-- <span style="margin: 0 15px">——</span> -->
                  <!-- <Input v-model="formInline.checkEndDate" placeholder="请输入" /> -->
                </div>
              </FormItem>
              
              <FormItem>
                <el-button type="primary" @click="handleClick('add', '')" size="small"
                  >本年</el-button>
             
                <el-button type="primary" @click="handleClick('add', '')" size="small"
                  >本月</el-button>
              
                <el-button type="primary" @click="handleClick('add', '')" size="small"
                  >本日</el-button>
              </FormItem>
              <FormItem>
                <el-button type="primary" @click="searchData()"  icon="el-icon-search" size="small">查询</el-button>
                <el-button @click="handleReset('formInline')" style="margin-left: 15px" icon="el-icon-refresh-left" size="small"
                  >重置</el-button>
              </FormItem>
            </Form>
            
        </div>
       
      </Card>
      <!-- 上 -->
      <Card style="width: 100%" class="topCount">
        <div class="title">机器人数据监控统计</div>
        <div class="listBox">
          <div class="listItem">
            <img src="@/assets/images/icon1.png" class="icon" />
            <div class="counts">
              <p>单据总数（单）</p>
              <p>{{successnum+failnum+timeoutnum}}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon2.png" class="icon" />
            <div class="counts">
              <p>审核通过单量（单）</p>
              <p>{{successnum}}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon3.png" class="icon" />
            <div class="counts">
              <p>审核不通过单量（单）</p>
              <p>{{failnum}}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon4.png" class="icon" />
            <div class="counts">
              <p>超时单量（单）</p>
              <p>{{timeoutnum}}</p>
            </div>
          </div>
          <div class="listItem">
            <img src="@/assets/images/icon5.png" class="icon" />
            <div class="counts">
              <p>审核时效（min）</p>
              <p>{{avgBillDatenum}}</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 35px;margin-bottom: 25px;">
            维度名称：
            <Select ref="checkResult" clearable style="width: 200px;">
              <Option value="1">规则数量</Option>
              <Option value="2">机器人审单量</Option>
              <Option value="3">预警量</Option>
              <Option value="4">通过率</Option>
              <Option value="0">全部</Option>
            </Select>
           
        </div>

        <div class="title">机器人数据监控统计统计表</div>
       <div class="charsBox">
            <div id="charts"></div>
          </div>
      </Card>
    
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import store from "@/store";
export default {
  data() {
    return {
      page: {
        totalElement: 0, // 总页数
        currentPage: 1, // 当前页数
        size: 10, // 每页显示多少条
        
      },
      options: [
          {
              "id":1,
              "name":"CRTG_项目其他经费报销（非会签）"
          },
          {
              "id":2,
              "name":"CRTG_项目其他经费报销（会签）"
          },
          {
              "id":3,
              "name":"CRTG_其他业务收入表"
          },
          {
              "id":4,
              "name":"CRTG_验工计价单"
          },
          {
              "id":5,
              "name":"CRTG_其他业务支出单（公司）新"
          },
          {
              "id":6,
              "name":"CRTG_其他费用报销单(公司)"
          },
          {
              "id":7,
              "name":"CRTG_差旅费报销单"
          },
          {
              "id":8,
              "name":"CRTG_会议费报销"
          },
          {
              "id":9,
              "name":"CRTG_差旅费报销单（公司）"
          },
          {
              "id":10,
              "name":"CRTG_材料结算单（公司）新"
          },
          {
              "id":11,
              "name":"劳务结算单（成本推送）"
          },
          {
              "id":12,
              "name":"材料结算单（成本推送）"
          },
          {
              "id":13,
              "name":"机械租赁结算单"
          },
          {
              "id":14,
              "name":"劳务结算单"
          },
          {
              "id":15,
              "name":"材料结算单"
          },
          {
              "id":16,
              "name":"CRTG＿财务费用收入及支出"
          },
          {
              "id":17,
              "name":"CRTG＿税费结转单"
          },
          {
              "id":18,
              "name":"机械租赁结算单（成本推送）"
          },
          {
              "id":19,
              "name":"现金管理及银行调户单"
          },
          {
              "id":20,
              "name":"其他直接费用结算单"
          }
      ],
      selected:"",
      failnum: 20,           //审核不通过单量
      avgBillDatenum: 90.7778/60,     //平均每单审核时长  单位秒(s)
      successnum: 34,         // 审核通过单量
      timeoutnum: 1         // 超时单量
      
    };
  },
  mounted() {
    this.initChart();
    this.getSelectlist();
   
  },
  created() {
    // this.query();
  },
  methods: {
    getTypeSelected(val) {
        // console.log(val)
        const _this = this;
        _this.selected=val;
    },
    initChart() {
      let myChart = echarts.init(document.getElementById("charts"));
      let option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          legend: {
              data: ['规则数量', '机器人审单量', '预警量', '通过率']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['2021-05-10', '2021-05-11', '2021-05-12', '2021-05-13', '2021-05-14', '2021-05-17', '2021-05-18', '2021-05-19', '2021-05-20']
              }
          ],
          yAxis: [
              {
                  type: 'value'
              },
              {
                type: 'value',
                min: 0,
                max: 100,
                position: 'right',
                axisLabel: {
                    formatter: '{value}%'
                }
              },
          ],
          series: [
              
              {
                  name: '规则数量',
                  type: 'bar',
                  stack: 'zh',
                  emphasis: {
                      focus: 'series'
                  },
                  barWidth: 20,
                  itemStyle:{  
                    normal:{  
                      color:'#1991DD',  
                    }  
                  },  
                  data: [12, 13, 10, 13, 9, 230, 200, 100, 87]
              },
              {
                  name: '机器人审单量',
                  type: 'bar',
                  stack: 'zh',
                  emphasis: {
                      focus: 'series'
                  },
                  barWidth: 20,
                  itemStyle:{  
                    normal:{  
                      color:'#70B822',  
                    }  
                  },
                  data: [4, 15, 47, 94, 88, 234, 209, 284, 97]
              },
              {
                  name: '预警量',
                  type: 'bar',
                  stack: 'zh',
                  emphasis: {
                      focus: 'series'
                  },
                  barWidth: 20,
                  itemStyle:{  
                    normal:{  
                      color:'#C5B5FF',  
                    }  
                  }, 
                  data: [0, 0, 0, 0, 0, 0, 0, 10, 0]
              },
              {
                  name: '通过率',
                  type: 'line',
                  yAxisIndex: 1,
                  showSymbol: false,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#1991DD' },
                        { offset: 1, color: '#FFFFFF' }
                      ])
                    }
                  }, //填充区域样式
                  lineStyle: {
                    color: "#1991DD",
                    width: 1
                  }, //线条的样式
                  itemStyle: {
                    color: "#1991DD",
                    opacity: 0 //为0不会绘制图形拐点消失
                  }, //拐点的样式
                  data: [(0/4)*100, (10/15)*100, (0/47)*100, (80/94)*100, (30/88)*100, (64/234)*100, (40/209)*100, (19/284)*100, (0/97)*100]
              }
             
          ]
      };

      myChart.setOption(option);
    },
    getSelectlist() {
      const _this = this;
      axios
        .get(`http://10.15.196.127:7070/billType/findAll`, {
          
        })
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
            _this.options = data.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCheckdate() {
      const _this = this;
      axios
        .get(`http://10.15.196.127:7070/bill/checkDateChart`, {
          
        })
        .then((resp) => {
          let data = resp.data;
          if (data.code === 20000) {
           
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    

  },
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.ivu-card {
  margin-bottom: 20px;
}
.topCount {
  display: flex;
  flex-direction: column;
  color: #333;
  font-weight: 600;
  .listBox {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 20px;
    .listItem {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        width: 48px;
        height: 48px;
        margin-right: 10px;
      }
      .counts {
        line-height: 1.5;
        p:last-child {
          font-size: 18px;
        }
      }
    }
  }
}
.cenCon {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.titleTop {
  display: flex;
  justify-content: space-around;
}
.btnBox {
  display: flex;
}
.charsBox {
  flex: 1;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#charts,
#secgram,
#thirdgram {
  width: 100%;
  height: 100%;
}
</style>
