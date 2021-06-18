<template>
  <div class="wraps">
    <div id="list">
      <!-- 头部 -->
      <Card style="width: 100%" class="ticketType">
        <el-button v-if="!forbidExternal"
          type="primary"
          plain
          @click="$router.push({name: 'auditLogIndex'})"
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
                          <td colspan="4" style="text-align: left">
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
                          <td style="text-align: left" @click="ruleClick(item.ruleType, n, i)">{{ n.ruleName }}</td>
                          <td style="text-align: center"
                            @click="ruleResultClick(item.ruleType, n, i)"
                          >
                            <Icon
                              type="md-close-circle"
                              size="25"
                              color="#E02020"
                            />
                          </td>
                          <td style="text-align: left" @click="ruleResultClick(item.ruleType, n, i)">{{ n.message ? n.message : "——" }}</td>
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
                          <td colspan="4" style="text-align: left">
                            暂无数据
                          </td>
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
      draggable scrollable
      :closable="true"
      :footer-hide="true"
      @on-cancel="showbigimg=false"
      width="1400"
    >
                  <div slot="header"
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
                <div class="showimg-content" >
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
                <img :src="imgSrc" class="bigImg" @click="showImgbox()" />
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
                  <img :src="item.imageURL" class="smallImg" />
                  <span :class="imgHasError.includes(item.imageId) ? 'index-icon red-index' : 'index-icon '">{{ index + 1 }}</span>
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
              <div>
              <p class="data-header" v-if="!emptyImageInfo">结构化数据
                <span class="text-primary pr-1">报错信息: {{currentInvoiceErrorFields.length}}条</span>
              </p>

              <template v-for="(vo, index) in messageInfo.invoices">
                <el-collapse
                  :key="vo.invoiceId + index"
                  v-if="tabsInvoiceIndex == index"
                  style="width: 100%; padding-left: 10px"
                  v-model="dataPanelOpen"
                >
                  <el-collapse-item
                    title="基本信息"
                    v-bind:name="'baseInfo-' + vo.invoiceId"
                    style="width: 100%"
                  >
                    <template v-if="vo.invoiceType==='航空运输电子客票行程单'">
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="证件号码">
                              <Input v-model="vo.passengerID" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'passengerID', vo.passengerID)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('passengerID')"></Input>
                              <Input v-else v-model="vo.passengerID" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="旅客姓名">
                              <Input v-model="vo.passengerName" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'passengerName', vo.passengerName)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('passengerName')"></Input>
                              <Input v-else v-model="vo.passengerName" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="印刷序号">
                              <Input v-model="vo.serialNo" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'serialNo', vo.serialNo)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('serialNo')"></Input>
                              <Input v-else v-model="vo.serialNo" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="16">
                            <FormItem label="电子客票号码">
                              <Input v-model="vo.invoiceCode" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"></Input>
                              <Input v-else v-model="vo.invoiceCode" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="票价">
                              <Input v-model="vo.fare" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'fare', vo.fare)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('fare')"></Input>
                              <Input v-else v-model="vo.fare" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem label="民航发展基金">
                              <Input v-model="vo.CAACDF" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'CAACDF', vo.CAACDF)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('CAACDF')"></Input>
                              <Input v-else v-model="vo.CAACDF" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="其他税费">
                              <Input v-model="vo.otherTaxes" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'otherTaxes', vo.otherTaxes)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('otherTaxes')"></Input>
                              <Input v-else v-model="vo.otherTaxes" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem label="合计">
                              <Input v-model="vo.amountWithTax" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'amountWithTax', vo.amountWithTax)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('amountWithTax')"></Input>
                              <Input v-else v-model="vo.amountWithTax" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="填开日期">
                              <Input v-model="vo.issueDate" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'issueDate', vo.issueDate)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('issueDate')"></Input>
                              <Input v-else v-model="vo.issueDate" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="16">
                            <FormItem label="填开单位">
                              <Input v-model="vo.sellerName" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'sellerName', vo.sellerName)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('sellerName')"></Input>
                              <Input v-else v-model="vo.sellerName" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <!-- <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="航班信息-起点">
                              <Input v-model="vo.origin" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'origin', vo.origin)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('origin')"></Input>
                              <Input v-else v-model="vo.origin" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="航班信息-终点">
                              <Input v-model="vo.destination" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'destination', vo.destination)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('destination')"></Input>
                              <Input v-else v-model="vo.destination" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="航班信息-日期">
                              <Input v-model="vo.invoiceDate" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceDate', vo.invoiceDate)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceDate')"></Input>
                              <Input v-else v-model="vo.invoiceDate" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row> -->
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='客运票'">
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票号码">
                              <Input v-model="vo.invoiceNo" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceNo', vo.invoiceNo)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceNo')"></Input>
                              <Input v-else v-model="vo.invoiceNo" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票代码">
                              <Input v-model="vo.invoiceCode" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"></Input>
                              <Input v-else v-model="vo.invoiceCode" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="发票抬头">
                              <Input v-model="vo.invoiceTitle" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceTitle', vo.invoiceTitle)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceTitle')"></Input>
                              <Input v-else v-model="vo.invoiceTitle" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="起始站">
                              <Input v-model="vo.startCity" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'startCity', vo.startCity)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('startCity')"></Input>
                              <Input v-else v-model="vo.startCity" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem label="终点站">
                              <Input v-model="vo.terminus" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'terminus', vo.terminus)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('terminus')"></Input>
                              <Input v-else v-model="vo.terminus" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="出行日期">
                              <Input v-model="vo.invoiceDate" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceDate', vo.invoiceDate)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceDate')"></Input>
                              <Input v-else v-model="vo.invoiceDate" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem label="开车时间">
                              <Input v-model="vo.invoiceTime" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceTime', vo.invoiceTime)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceTime')"></Input>
                              <Input v-else v-model="vo.invoiceTime" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="旅客姓名">
                              <Input v-model="vo.passengerName" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'passengerName', vo.passengerName)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('passengerName')"></Input>
                              <Input v-else v-model="vo.passengerName" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem label="证件号码">
                              <Input v-model="vo.passengerID" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'passengerID', vo.passengerID)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('passengerID')"></Input>
                              <Input v-else v-model="vo.passengerID" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="价税合计（小写）">
                              <Input v-model="vo.amountWithTax" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'amountWithTax', vo.amountWithTax)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('amountWithTax')"></Input>
                              <Input v-else v-model="vo.amountWithTax" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='过路过桥票'">
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票号码">
                              <Input v-model="vo.invoiceNo" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceNo', vo.invoiceNo)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceNo')"></Input>
                              <Input v-else v-model="vo.invoiceNo" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票代码">
                              <Input v-model="vo.invoiceCode" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"></Input>
                              <Input v-else v-model="vo.invoiceCode" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="金额">
                              <Input v-model="vo.invoiceAmount" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceAmount', vo.invoiceAmount)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceAmount')"></Input>
                              <Input v-else v-model="vo.invoiceAmount" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem label="发票日期" :label-width="70">
                              <Input
                                v-model="vo.invoiceDate"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceDate', vo.invoiceDate)"
                                v-if="currentInvoiceErrorFields.includes('invoiceDate')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoiceDate"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='出租车票'">
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票号码">
                              <Input v-model="vo.invoiceNo" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceNo', vo.invoiceNo)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceNo')"></Input>
                              <Input v-else v-model="vo.invoiceNo" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票代码">
                              <Input v-model="vo.invoiceCode" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"></Input>
                              <Input v-else v-model="vo.invoiceCode" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="金额">
                              <Input v-model="vo.invoiceAmount" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceAmount', vo.invoiceAmount)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceAmount')"></Input>
                              <Input v-else v-model="vo.invoiceAmount" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票日期" :label-width="70">
                              <Input
                                v-model="vo.invoiceDate"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceDate', vo.invoiceDate)"
                                v-if="currentInvoiceErrorFields.includes('invoiceDate')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoiceDate"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="所属城市" :label-width="70">
                              <Input
                                v-model="vo.invoiceAddress"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceAddress', vo.invoiceAddress)"
                                v-if="currentInvoiceErrorFields.includes('invoiceAddress')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoiceAddress"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='定额发票'">
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票号码">
                              <Input v-model="vo.invoiceNo" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceNo', vo.invoiceNo)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceNo')"></Input>
                              <Input v-else v-model="vo.invoiceNo" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票代码">
                              <Input v-model="vo.invoiceCode" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"></Input>
                              <Input v-else v-model="vo.invoiceCode" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="金额">
                              <Input v-model="vo.invoiceAmount" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceAmount', vo.invoiceAmount)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceAmount')"></Input>
                              <Input v-else v-model="vo.invoiceAmount" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="16">
                            <FormItem label="票据归属地" :label-width="120">
                              <Input
                                v-model="vo.invoiceAddress"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceAddress', vo.invoiceAddress)"
                                v-if="currentInvoiceErrorFields.includes('invoiceAddress')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoiceAddress"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='铁路车票'">
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="出发站">
                              <Input v-model="vo.origin" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'origin', vo.origin)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('origin')"></Input>
                              <Input v-else v-model="vo.origin" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="到达站">
                              <Input v-model="vo.destination" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'destination', vo.destination)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('destination')"></Input>
                              <Input v-else v-model="vo.destination" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="出行日期">
                              <Input v-model="vo.invoiceDate" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceDate', vo.invoiceDate)"
                                v-if="currentInvoiceErrorFields.includes('invoiceDate')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceDate" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="座位等级">
                              <Input v-model="vo.class" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'class', vo.class)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('class')"></Input>
                              <Input v-else v-model="vo.class" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="金额合计（小写）">
                              <Input v-model="vo.amountWithoutTax" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'amountWithoutTax', vo.amountWithoutTax)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('amountWithoutTax')"></Input>
                              <Input v-else v-model="vo.amountWithoutTax" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="12">
                            <FormItem label="火车票编号(左上)" :label-width="120">
                              <Input v-model="vo.invoiceNumber" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceNumber', vo.invoiceNumber)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceNumber')"></Input>
                              <Input v-else v-model="vo.invoiceNumber" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="12">
                            <FormItem label="火车票代码(左下)" :label-width="120">
                              <Input
                                v-model="vo.invoiceCode"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoiceCode"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='通用机打发票'">
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票号码">
                              <Input v-model="vo.invoiceNo" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceNo', vo.invoiceNo)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceNo')"></Input>
                              <Input v-else v-model="vo.invoiceNo" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票代码">
                              <Input v-model="vo.invoiceCode" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"></Input>
                              <Input v-else v-model="vo.invoiceCode" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="开票日期" :label-width="70">
                              <Input
                                v-model="vo.invoiceDate"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceDate', vo.invoiceDate)"
                                v-if="currentInvoiceErrorFields.includes('invoiceDate')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoiceDate"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                          <Col span="16">
                            <FormItem label="合计金额（小写）">
                              <Input v-model="vo.amountWithTax" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'amountWithTax', vo.amountWithTax)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('amountWithTax')"></Input>
                              <Input v-else v-model="vo.amountWithTax" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="发票机打代码" :label-width="120">
                              <Input
                                v-model="vo.invoicePrintCode"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoicePrintCode', vo.invoicePrintCode)"
                                v-if="currentInvoiceErrorFields.includes('invoicePrintCode')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoicePrintCode"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="发票机打号码" :label-width="120">
                              <Input
                                v-model="vo.invoicePrintNo"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoicePrintNo', vo.invoicePrintNo)"
                                v-if="currentInvoiceErrorFields.includes('invoicePrintNo')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoicePrintNo"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="发票抬头" :label-width="70">
                              <Input
                                v-model="vo.invoiceTitle"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceTitle', vo.invoiceTitle)"
                                v-if="currentInvoiceErrorFields.includes('invoiceTitle')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoiceTitle"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='委外工程验工结算表'">
                      <Form label-position="left" :label-width="120">
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="乙方" >
                              <Input v-model="vo.partyB" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'partyB', vo.partyB)"
                                v-if="currentInvoiceErrorFields.includes('partyB')"
                              ></Input>
                              <Input v-else v-model="vo.partyB" readonly ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="本期计价金额" >
                              <Input v-model="vo.currentValuationAmount" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'currentValuationAmount', vo.currentValuationAmount)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('currentValuationAmount')"></Input>
                              <Input v-else v-model="vo.currentValuationAmount" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else-if="vo.invoiceType==='机械设备租赁费结算单'">
                      <Form label-position="left" :label-width="120">
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="乙方">
                              <Input v-model="vo.outsourcer" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'outsourcer', vo.outsourcer)"
                                v-if="currentInvoiceErrorFields.includes('outsourcer')"
                              ></Input>
                              <Input v-else v-model="vo.outsourcer" readonly ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="24">
                            <FormItem label="本期计价金额">
                              <Input v-model="vo.currentValuationAmount" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'currentValuationAmount', vo.currentValuationAmount)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('currentValuationAmount')"></Input>
                              <Input v-else v-model="vo.currentValuationAmount" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                    <template v-else >
                      <Form label-position="left" :label-width="70">
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="发票类型">
                              <Input v-model="vo.invoiceType" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
                                v-if="currentInvoiceErrorFields.includes('invoiceType')"
                              ></Input>
                              <Input v-else v-model="vo.invoiceType" readonly ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票号码">
                              <Input v-model="vo.invoiceNo" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceNo', vo.invoiceNo)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceNo')"></Input>
                              <Input v-else v-model="vo.invoiceNo" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="发票代码">
                              <Input v-model="vo.invoiceCode" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceCode', vo.invoiceCode)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceCode')"></Input>
                              <Input v-else v-model="vo.invoiceCode" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="8">
                            <FormItem label="开票日期">
                              <Input v-model="vo.invoiceDate" readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'invoiceDate', vo.invoiceDate)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('invoiceDate')"></Input>
                              <Input v-else v-model="vo.invoiceDate" readonly></Input>
                            </FormItem>
                          </Col>
                          <Col span="16">
                            <FormItem label="发票机打代码" :label-width="120">
                              <Input
                                v-model="vo.invoicePrintCode"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoicePrintCode', vo.invoicePrintCode)"
                                v-if="currentInvoiceErrorFields.includes('invoicePrintCode')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoicePrintCode"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row :gutter="16">
                          <Col span="16">
                            <FormItem label="发票机打号码" :label-width="120">
                              <Input
                                v-model="vo.invoicePrintNo"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'invoicePrintNo', vo.invoicePrintNo)"
                                v-if="currentInvoiceErrorFields.includes('invoicePrintNo')"
                              ></Input>
                              <Input v-else
                                v-model="vo.invoicePrintNo"
                                readonly
                              ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8">
                            <FormItem label="校验码">
                              <Input v-model="vo.invoiceCRC" readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo,'invoiceCRC', vo.invoiceCRC)"
                                v-if="currentInvoiceErrorFields.includes('invoiceCRC')"></Input>
                              <Input v-else v-model="vo.invoiceCRC" readonly></Input>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </template>
                  </el-collapse-item>
                  <el-collapse-item
                    title="购买方信息"
                    v-if="vo.purchaserName"
                    v-bind:name="'buyerInfo-' + vo.invoiceId"
                    style="width: 100%"
                  >
                    <Form label-position="left" :label-width="100">
                      <Row :gutter="16">
                        <Col span="10">
                          <FormItem label="名称">
                            <Tooltip
                              :content="vo.purchaserName"
                              :max-width="200"
                              transfer
                            >
                            <Input
                              v-model="vo.purchaserName"
                              readonly
                                icon="ios-alert-outline"
                                @click.native="getFieldError(vo, 'purchaserName', vo.purchaserName)"
                                style="width: auto"
                                v-if="currentInvoiceErrorFields.includes('purchaserName')"
                            ></Input>
                            <Input v-else
                              v-model="vo.purchaserName"
                              readonly
                            ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                        <Col span="14">
                          <FormItem label="地址电话">
                            <Tooltip
                              :content="vo.purchaserAddress"
                              :max-width="200"
                              transfer
                            >
                              <Input
                                v-model="vo.purchaserAddress"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'purchaserAddress', vo.purchaserAddress)"
                                v-if="currentInvoiceErrorFields.includes('purchaserAddress')"
                              ></Input>
                              <Input v-else
                                v-model="vo.purchaserAddress"
                                readonly
                              ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row :gutter="16">
                        <Col span="10">
                          <FormItem label="纳税人识别号">
                            <Tooltip
                              :content="vo.purchaserTaxNo"
                              :max-width="200"
                              transfer
                            >
                            <Input
                              v-model="vo.purchaserTaxNo"
                              readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'purchaserTaxNo', vo.purchaserTaxNo)"
                                v-if="currentInvoiceErrorFields.includes('purchaserTaxNo')"
                            ></Input>
                            <Input v-else
                              v-model="vo.purchaserTaxNo"
                              readonly
                            ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                        <Col span="14">
                          <FormItem label="开户行及账号">
                            <Tooltip
                              :content="vo.purchaserBankAccount"
                              :max-width="200"
                              transfer
                            >
                              <Input
                                v-model="vo.purchaserBankAccount"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'purchaserBankAccount', vo.purchaserBankAccount)"
                                v-if="currentInvoiceErrorFields.includes('purchaserBankAccount')"
                              ></Input>
                              <Input v-else
                                v-model="vo.purchaserBankAccount"
                                readonly
                              ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </el-collapse-item>
                  <el-collapse-item
                    title="销售方信息"
                    v-if="vo.sellerName "
                    v-bind:name="'sellerInfo-' + vo.invoiceId"
                    style="width: 100%"
                  >
                    <Form label-position="left" :label-width="100">
                      <Row :gutter="16">
                        <Col span="10">
                          <FormItem label="名称">
                            <Tooltip
                              :content="vo.sellerName"
                              :max-width="200"
                              transfer
                            >
                            <Input
                              v-model="vo.sellerName"
                              readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'sellerName', vo.sellerName)"
                                v-if="currentInvoiceErrorFields.includes('sellerName')"
                            ></Input>
                            <Input v-else
                              v-model="vo.sellerName"
                              readonly
                            ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                        <Col span="14">
                          <FormItem label="地址电话">
                            <Tooltip
                              :content="vo.sellerAddress"
                              :max-width="200"
                              transfer
                            >
                              <Input
                                v-model="vo.sellerAddress"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'sellerAddress', vo.sellerAddress)"
                                v-if="currentInvoiceErrorFields.includes('sellerAddress')"
                              ></Input>
                              <Input v-else
                                v-model="vo.sellerAddress"
                                readonly
                              ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row :gutter="16">
                        <Col span="10">
                          <FormItem label="纳税人识别号">
                            <Tooltip
                              :content="vo.sellerTaxNo"
                              :max-width="200"
                              transfer
                            >
                            <Input
                              v-model="vo.sellerTaxNo"
                              readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'sellerTaxNo', vo.sellerTaxNo)"
                                v-if="currentInvoiceErrorFields.includes('sellerTaxNo')"
                            ></Input>
                            <Input v-else
                              v-model="vo.sellerTaxNo"
                              readonly
                            ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                        <Col span="14">
                          <FormItem label="开户行及账号">
                            <Tooltip
                              :content="vo.sellerBankAccount"
                              :max-width="200"
                              transfer
                            >
                              <Input
                                v-model="vo.sellerBankAccount"
                                readonly
                                icon="ios-alert-outline"
                                style="width: auto"
                                @click.native="getFieldError(vo, 'sellerBankAccount', vo.sellerBankAccount)"
                                v-if="currentInvoiceErrorFields.includes('sellerBankAccount')"
                              ></Input>
                              <Input v-else
                                v-model="vo.sellerBankAccount"
                                readonly
                              ></Input>
                            </Tooltip>
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </el-collapse-item>
                  <el-collapse-item
                    title="发票详情"
                    v-if="vo.invoiceItems && vo.invoiceItems.length>0"
                    v-bind:name="'invoiceInfo-' + vo.invoiceId"
                    style="width: 100%"
                  >
                    <template>
                      <table
                        style="width: 100%; text-align: center"
                        class="rule-table td-nowrap"
                      >
                        <thead>
                          <tr style="text-align: center">
                            <th width="60">序号</th>
                            <!-- <th width="60">价税合计</th> -->
                            <th width="180">
                            <Tooltip
                              placement="top-start"
                              content="货物或应税劳务、服务名称"
                              :max-width="200"
                              transfer
                            >货物或应税劳务、服务名称
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'itemName', '')"
                                v-if="currentInvoiceErrorFields.includes('itemName')"
                              />
                            </Tooltip>
                              </th>
                            <th width="60">单位
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'itemUnit', '')"
                                v-if="currentInvoiceErrorFields.includes('itemUnit')"
                              /></th>
                            <th width="60">数量
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'itemQuantity', '')"
                                v-if="currentInvoiceErrorFields.includes('itemQuantity')"
                              /></th>
                            <th width="60">单价
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'itemUnitPrice', '')"
                                v-if="currentInvoiceErrorFields.includes('itemUnitPrice')"
                              /></th>
                            <th width="120">
                            <Tooltip
                              placement="top-start"
                              content="金额"
                              :max-width="200"
                              transfer
                            >金额
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'itemAmount', '')"
                                v-if="currentInvoiceErrorFields.includes('itemAmount')"
                              />
                            </Tooltip></th>
                            <th width="60">
                            <Tooltip
                              placement="top-start"
                              content="税率"
                              :max-width="200"
                              transfer
                            >税率
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'itemTaxRate', '')"
                                v-if="currentInvoiceErrorFields.includes('itemTaxRate')"
                              />
                            </Tooltip></th>
                            <th width="60">税额
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'itemTaxAmount', '')"
                                v-if="currentInvoiceErrorFields.includes('itemTaxAmount')"
                              /></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(n, i) in vo.invoiceItems" v-bind:key="i">
                            <td style="text-align: center">{{ i + 1 }}</td>
                            <!-- <td>
                            <Tooltip
                              placement="top-start"
                              :content="
                                (
                                  Number(n.itemAmount) +
                                  Number(n.itemTaxAmount)
                                ).toFixed(2)"
                              :max-width="200"
                              transfer
                            >
                              {{
                                (
                                  Number(n.itemAmount) +
                                  Number(n.itemTaxAmount)
                                ).toFixed(2)
                              }}
                              </Tooltip>
                            </td> -->
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.itemName"
                              :max-width="200"
                              transfer
                            >{{ n.itemName }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.itemUnit"
                              :max-width="200"
                              transfer
                            >{{ n.itemUnit }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.itemQuantity"
                              :max-width="200"
                              transfer
                            >{{ n.itemQuantity }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="Number(n.itemUnitPrice).toFixed(2)"
                              :max-width="200"
                              transfer
                            >{{ Number(n.itemUnitPrice).toFixed(2) }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.itemAmount"
                              :max-width="200"
                              transfer
                            >{{ n.itemAmount }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.itemTaxRate"
                              :max-width="200"
                              transfer
                            >{{ n.itemTaxRate }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.itemTaxAmount"
                              :max-width="200"
                              transfer
                            >{{ n.itemTaxAmount }}</Tooltip></td>
                          </tr>
                          <tr>
                            <td style="font-weight: 700">合计</td>
                            <td colspan="4"></td>
                            <td>{{vo.amountWithoutTax}}</td>
                            <td>{{vo.taxRate}}</td>
                            <td>{{vo.taxAmount}}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: 700">价税合计</td>
                            <td>{{vo.amountWithTax}}</td>
                            <td colspan="6"></td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
                  </el-collapse-item>
                  <el-collapse-item
                    title="航班信息"
                    v-if="vo.invoiceFlights && vo.invoiceFlights.length>0"
                    v-bind:name="'invoiceInfo-' + vo.invoiceId"
                    style="width: 100%"
                  >
                    <template>
                      <table
                        style="width: 100%; text-align: center"
                        class="rule-table td-nowrap"
                      >
                        <thead>
                          <tr style="text-align: center">
                            <th width="60">序号</th>
                            <!-- <th width="60">价税合计</th> -->
                            <th width="180">
                            <Tooltip
                              placement="top-start"
                              content="日期"
                              :max-width="200"
                              transfer
                            >日期
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'fpDate', '')"
                                v-if="currentInvoiceErrorFields.includes('fpDate')"
                              />
                            </Tooltip>
                              </th>
                            <th width="60">时间
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'fpTime', '')"
                                v-if="currentInvoiceErrorFields.includes('fpTime')"
                              /></th>
                            <th width="60">航班号
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'fpFlightNumber', '')"
                                v-if="currentInvoiceErrorFields.includes('fpFlightNumber')"
                              /></th>
                            <th width="60">起点
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'fpDeparture', '')"
                                v-if="currentInvoiceErrorFields.includes('fpDeparture')"
                              /></th>
                            <th width="120">
                            <Tooltip
                              placement="top-start"
                              content="终点"
                              :max-width="200"
                              transfer
                            >终点
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'fpDestination', '')"
                                v-if="currentInvoiceErrorFields.includes('fpDestination')"
                              />
                            </Tooltip></th>
                            <th width="60">
                            <Tooltip
                              placement="top-start"
                              content="承运"
                              :max-width="200"
                              transfer
                            >承运
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'fpCarrier', '')"
                                v-if="currentInvoiceErrorFields.includes('fpCarrier')"
                              />
                            </Tooltip></th>
                            <th width="60">舱等
                              <Icon type="ios-alert-outline" class="icon-danger"
                                @click.native="getFieldError(vo, 'fpClass', '')"
                                v-if="currentInvoiceErrorFields.includes('fpClass')"
                              /></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(n, i) in vo.invoiceFlights" v-bind:key="i">
                            <td style="text-align: center">{{ i + 1 }}</td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.fpDate"
                              :max-width="200"
                              transfer
                            >{{ n.fpDate }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.fpTime"
                              :max-width="200"
                              transfer
                            >{{ n.fpTime }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.fpFlightNumber"
                              :max-width="200"
                              transfer
                            >{{ n.fpFlightNumber }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="(n.fpDeparture)"
                              :max-width="200"
                              transfer
                            >{{ (n.fpDeparture) }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.fpDestination"
                              :max-width="200"
                              transfer
                            >{{ n.fpDestination }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.fpCarrier"
                              :max-width="200"
                              transfer
                            >{{ n.fpCarrier }}</Tooltip></td>
                            <td>
                            <Tooltip
                              placement="top-start"
                              :content="n.fpClass"
                              :max-width="200"
                              transfer
                            >{{ n.fpClass }}</Tooltip></td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
                  </el-collapse-item>
                  <el-collapse-item
                    title="其他"
                    v-bind:name="'otherInfo-' + vo.invoiceId"
                    style="width: 100%"
                  >
                    <Form label-position="left" :label-width="100">
                      <!-- <Row :gutter="16">
                      </Row> -->
                      <Row :gutter="16">
                        <Col span="10">
                          <FormItem label="是否有发票专用章" :label-width="120">
                            <Input
                              :value="vo.specialSeal"
                              readonly
                            ></Input>
                          </FormItem>
                        </Col>
                        <Col span="14">
                          <Tooltip
                            :content="vo.remarks"
                            :max-width="200"
                            transfer
                          >
                            <FormItem label="备注">
                              <Input v-model="vo.remarks" readonly
                                icon="ios-alert-outline"
                                style="width: 100%"
                                @click.native="getFieldError(vo, 'remarks', vo.remarks)"
                                v-if="currentInvoiceErrorFields.includes('remarks')"></Input>
                              <Input v-else v-model="vo.remarks" readonly></Input>
                            </FormItem>
                          </Tooltip>
                        </Col>
                        <!-- <Col span="12">
                          <FormItem
                            label="盖章单位与开票方是否一致"
                            :label-width="180"
                          >
                            <Input readonly></Input>
                          </FormItem>
                        </Col> -->
                      </Row>
                    </Form>
                  </el-collapse-item>
                </el-collapse>
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
      draggable scrollable
      :closable="true"
      :footer-hide="true"
      width="1000"
      class-name="result-data-modal"
    >
      <Row :gutter="10" style="margin-left: 0;margin-right:0;">
        <Col v-if="ruleFormToggle" :span="ruleImageToggle?12:24" class="thead-name" style="padding-left: 0;padding-right: 0;">表单</Col>
        <Col v-if="ruleImageToggle" :span="ruleFormToggle?12:24" class="thead-name" style="padding-left: 0;padding-right: 0;">影像</Col>
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
          <!-- <el-table-column
            v-if="resultFormData.length>0"
            type="index"
            label="序号"
            align="center"
            width="60"/> -->
          <template v-for="(col, i) in formColumnsChildren">
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
          <!-- <el-table-column
            v-if="resultImageData.length>0"
            type="index"
            label="序号"
            align="center"
            width="60"/> -->
          <template v-for="(col, i) in imageColumnsChildren">
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
import ImagePreview from "@/components/image-preview";
// import { matchCNkeys } from "@/libs/invoice";
import { Notification, Loading } from 'element-ui'
import axios from '@/libs/api.request'
const clubArray = (arr) => {
  return arr.reduce((acc, val, ind) => {
    acc[ind] = acc[ind] ? acc[ind] : {};
    val.map((v) => {
      const key = Object.keys(v)[0];
      acc[ind][key] = v[key];
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
      currentInvoiceRuleId: '',
      forbidExternal: this.$route.meta.forbidExternal
    };
  },
  mounted() {
    this.billNumber = this.$route.params.billNumber || this.$route.query.billNumber;
    this.query();
  },
  computed: {
    emptyImageInfo: function () {
      return this.imageData.length === 0;
    },
  },
  methods: {
    handelAllImage() {
      const _this = this;
      // 有字段的报错图片
      const errorFields = _this.allData.errors.filter(e => {
        const hasfield = e.infos.filter(ei => ei.hasOwnProperty('fields'))
        return hasfield.length > 0;
      })
      // 所有报错图片
      _this.imgHasError = _this.allData.errors.map(i => i.imageId);
      let newSortImageInfo = _this.allData.imageInfo.filter(img => _this.imgHasError.includes(img.imageId));
      const noErrImage = _this.allData.imageInfo.filter(img => !_this.imgHasError.includes(img.imageId));
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
        return false;
      }
      _this.currentInvoiceRuleId = vo.ruleId;
      if (vo.hasOwnProperty("imageData")) {
        let ids = vo.imageData.map((voi) => {
          return voi.imageId;
        });
        this.imgHasError = ids;
        this.setImageData(ids, vo.imageData[0].infos[0].invoiceId);
        // _this.invoiceId = vo.imageData[0].infos[0].invoiceId;
      } else {
        Notification.closeAll()
        Notification({
          message: '无影像数据',
          type: 'warning',
          duration: 2000
        })
      }
    },
    ruleResultClick(ruleType, vo, i) {
      const _this = this;
      if (ruleType !== "IMAGES") {
        return false;
      }
      _this.currentInvoiceRuleId = vo.ruleId;
      const ruleRequest = {
        ruleId: vo.ruleId,
        billNumber: _this.allData.billNo, // this.billNumber,
        taskId: _this.allData.taskId
      }
      _this.getRuleInvoice(ruleRequest);

    },
    // mapper highlight
    formTableCellClassName({row, column, rowIndex, columnIndex}) {
      const _this = this;
      const columnName = column.property;
      if (columnName === undefined) {
        return ''
      }
      const dataIndex = Number(columnName.replace(/\D/g, ""));
      if ( ! _this.resultFormDataRaw[dataIndex].hasOwnProperty('valueData')) {
        return ''
      }
      if ( ! row.hasOwnProperty(columnName)) {
        return ''
      }
      const valueObj = _this.resultFormDataRaw[dataIndex].valueData.find(ele => `${ele.index} | ${ele.value}`===row[columnName]);
      return valueObj.highLight === true ? "text-highlight" : ''
    },
    imageTableCellClassName({row, column, rowIndex, columnIndex}) {
      const _this = this;
      const columnName = column.property;
      if (columnName === undefined) {
        return ''
      }
      const dataIndex = Number(columnName.replace(/\D/g, ""));
      if ( ! _this.resultImageDataRaw[dataIndex].hasOwnProperty('valueData')) {
        return ''
      }
      if ( ! row.hasOwnProperty(columnName)) {
        return ''
      }
      const valueObj = _this.resultImageDataRaw[dataIndex].valueData.find(ele => `${ele.index} | ${ele.value}`===row[columnName]);
      return valueObj.highLight === true ? "text-highlight" : ''
    },
    getRuleInvoice(request, showAllRules = true) {
      const _this = this;
      const loadingInstance = Loading.service({ fullscreen: true, background: 'hsla(0,0%,100%,.2)' })
      axios
        .request({
          method: 'post',
          url: `/api/server/qldata`,
          data: request
        })
        .then((resp) => {
          loadingInstance.close()
          let data = resp.data;
          if (data.status === 200) {
            if (data.data.form.length ===0 && !showAllRules) {
              _this.ruleFormToggle = false;
            }
            if (data.data.image.length ===0 && !showAllRules) {
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
              const formData = fc.valueData.map(hi => `${hi.index} | ${hi.value}`); // fc.data
              return formData.map((d) => {
                const newd = {};
                newd[keyn] = d;
                return newd;
              });
            });
            if (xx.length > 0) {
              const newArray = xx[0].map((col, i) => xx.map((row) => row[i]));
              const parr = JSON.parse(JSON.stringify(newArray));
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
              const imageData = fc.valueData.map(hi => `${hi.index} | ${hi.value}`); // fc.data
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
            Notification.closeAll()
            Notification({
              message: data.msg || data.message,
              type: 'warning',
              duration: 2000
            })
          }
        })
        .catch((err) => {
          console.log(err);
        }).finally(() => {
          loadingInstance.close()
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
      let newSortImageInfo = data.filter(img => arr.includes(img.imageId));
      const noErrImage = data.filter(img => !arr.includes(img.imageId));
      _this.imageData = newSortImageInfo.concat(noErrImage);
      // this.imageData = newArr;
      let targetInvoice = invoiceIdP ? invoiceIdP : (
        newArr.length > 0
          ? newArr[0]["invoices"].length > 0
            ? newArr[0]["invoices"][0]["invoiceId"]
            : ""
          : "" );
      this.invoiceId = targetInvoice;
      this.imageId =
        newArr.length > 0 ? newArr[0]["imageId"] : "";
      this.getMessageInfo(newArr.map((a) => a.imageId));
      this.getErrorMessage(this.invoiceId);
      const imageURL0 =
        newArr.length > 0 ? newArr[0]["imageURL"] : "";
      this.handleClick(imageURL0, 0);
      // this.tabsInvoiceIndex = 0;
    },
    query() {
      const _this = this;
      axios
        .request({
          method: 'post',
          url: `/api/server/qlresult`,
          data: {
            taskId: this.billNumber
          }
        })
        .then((resp) => {
          let data = resp.data;
          if (data.status == 200) {
            _this.allData = data.data;
            _this.allData.imageInfo.map(img => {
              return img.invoices.map(invo => {
                const taxRate = Number(((invo.taxAmount/invo.amountWithoutTax)*100).toFixed(2));
                invo.taxRate = invo.amountWithoutTax ? `${taxRate}%` : '';
                return invo;
                // const sumR = invo.invoiceItems.reduce((acc, val) => {
                //   return acc.itemAmount+val.itemAmount;
                // });
              });
            })
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
      let filterImages = data.filter(img => imageIds.includes(img.imageId));
      data.map(dd => {
        allInvoice = allInvoice.concat(dd.invoices);
        _this.allImageInvoiceIds[dd.imageId] = dd.invoices.map(di => di.invoiceId);
        return true;
      })
      this.tabsInvoiceIndex = allInvoice.findIndex(i => i.invoiceId===_this.invoiceId);
      if (imageIds.length === 0) {
        this.$set(this, "messageInfo", { invoices: allInvoice });
        this.$set(
          this,
          "dataPanelOpen",
          [
            "baseInfo-",
            "buyerInfo-",
            "sellerInfo-",
            "otherInfo-",
            "invoiceInfo-",
          ].map(
            (i) =>
              `${i}${allInvoice.length > 0 ? allInvoice[0]["invoiceId"] : "0"}`
          )
        );
      } else {
        filterImages.map((a) => {
          filterInvoices = filterInvoices.concat(a.invoices)
          return true;
        });
        this.tabsInvoiceIndex = filterInvoices.findIndex(i => i.invoiceId===_this.invoiceId);
        this.$set(this, "messageInfo", { invoices: filterInvoices });
        this.$set(
          this,
          "dataPanelOpen",
          [
            "baseInfo-",
            "buyerInfo-",
            "sellerInfo-",
            "otherInfo-",
            "invoiceInfo-",
          ].map(
            (i) =>
              `${i}${
                filterInvoices.length > 0 ? filterInvoices[0]["invoiceId"] : "0"
              }`
          )
        );
      }
    },
    getErrorMessage(invoiceIdP) {
      const _this = this;
      _this.currentInvoiceErrorFields = [];
      _this.$set(
        _this,
        "dataPanelOpen",
        [
          "baseInfo-",
          "buyerInfo-",
          "sellerInfo-",
          "otherInfo-",
          "invoiceInfo-",
        ].map((i) => `${i}${invoiceIdP || "0"}`)
      );
      if (this.currentInvoiceRuleId !== '') {
        const findRule = _this.allData.data.find(r => r.ruleType==="IMAGES");
        const findRet = findRule.result.find(rr => rr.ruleId===_this.currentInvoiceRuleId);

        let dataImgIds = Object.keys(_this.allImageInvoiceIds);
        let findImgId = dataImgIds.find(k => {
          return _this.allImageInvoiceIds[k].includes(invoiceIdP);
        })
        let fieldsImgs = findRet.imageData.find(ee => ee.imageId===findImgId);
        let fieldsInvoice = fieldsImgs.infos.find(ei => ei.invoiceId === invoiceIdP);
        _this.currentInvoiceErrorFields = fieldsInvoice.fields || [];
      }
    },
    getFieldError (vo, currentKey, currentVal) {
      const _this = this
      const ruleRequest = {
        ruleId: _this.currentInvoiceRuleId,
        billNumber: _this.allData.billNo, // this.billNumber,
        taskId: _this.allData.taskId,
        keyName:currentKey,
        value:currentVal
      }
      this.getRuleInvoice(ruleRequest, false)
    },
    handleTab(index, invoiceId) {
      const _this = this;
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
  &.td-nowrap{
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
  .ivu-tooltip{
    width: 100%;
    text-align: center;
    display: inline-block;
  }
  .ivu-tooltip-rel{
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
  right: 2.5rem;
  overflow: hidden;
}
/deep/.el-collapse-item__header {
  padding-left: 0.5rem;
  border-left: 2px solid #1991dd;
}
/deep/.result-data-modal .ivu-modal-body .ivu-row{
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
}
/deep/.result-data-modal .ivu-modal-body .ivu-row .thead-name{
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #606266;
  padding: 10px 0 12px 0;
  background: #eef1f6;
  border-bottom: 1px solid #fff;
}
/deep/.result-data-modal .ivu-modal-body .ivu-row,
/deep/.result-data-modal .ivu-modal-body .table-row{
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
/deep/.text-highlight{
  background-color: #FFFA99;
}
/deep/.hover-primary:hover{
  cursor: pointer;
  background-color: #ecf5ff;
  // #b3d8ff
}
/deep/.data-header{
  padding: 10px;
  text-align: center;
  border: 1px solid #EEEEEE;
  background: #FAFAFA;
  position: relative;
}
/deep/.text-primary{
  color: #1991dd;
}
/deep/.pr-1{
  position: absolute;
  right: 1rem;
}
/deep/.ivu-input-icon, /deep/.icon-danger{
  color: #FE3D3D;
  font-weight: 700;
  cursor: pointer;
  font-size: 18px;
  vertical-align: text-bottom;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover>td.text-highlight{
  background-color: #FFFA99;
}
/deep/.rule-table .ivu-tooltip-rel{
  max-width: 130px;
}
/deep/.imgBox .rightImg .index-icon.red-index{
  background-color: rgba(254,61,61, .6);
}
</style>
