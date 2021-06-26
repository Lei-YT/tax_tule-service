export const getInvoiceFields = (invoiceType) => {
  let getBase = _.cloneDeep(base);
  let getItems = _.cloneDeep(itemDetail);
  switch (invoiceType) {
    case '客运票':
      getBase.fields = [
        [
          { label: '发票类型', key: 'invoiceType', col: 8 },
          { label: '发票代码', key: 'invoiceCode', col: 8 },
          { label: '发票号码', key: 'invoiceNo', col: 8 },
        ],
        [
          { label: '发票抬头', key: 'invoiceTitle', col: 24 },
        ],
        [
          { label: '起始站', key: 'startCity', col: 12 },
          { label: '终点站', key: 'terminus', col: 12 },
        ],
        [
          { label: '出行日期', key: 'invoiceDate', col: 12 },
          { label: '开车时间', key: 'invoiceTime', col: 12 },
        ],
        [
          { label: '旅客姓名', key: 'passengerName', col: 12 },
          { label: '证件号码', key: 'passengerID', col: 12 },
        ],
        [
          { label: '价税合计（小写）', key: 'amountWithTax', col: 8 },
          { label: '发票所属地', key: 'sellerAddress', col: 8 },
          { label: '消费分类', key: 'industryCategory', col: 8 },
        ],
      ];
      break;
    case '过路过桥票':
    case '过路费发票':
    case '出租车票':
      getBase.fields = [
        [
          { label: '发票类型', key: 'invoiceType', col: 8 },
          { label: '发票代码', key: 'invoiceCode', col: 8 },
          { label: '发票号码', key: 'invoiceNo', col: 8 },
        ],
        [
          { label: '入口站', key: 'origin', col: 12 },
          { label: '出口站', key: 'destination', col: 12 },
        ],
        [
          { label: '价税合计（小写）', key: 'amountWithTax', col: 8 },
          { label: '发票日期', key: 'invoiceDate', col: 8 },
          { label: '所属城市', key: 'invoiceAddress', col: 8 },
        ],
      ];
      break;
    case '铁路车票':
      getBase.fields = [
        [
          { label: '发票类型', key: 'invoiceType', col: 8 },
          { label: '火车票编号(左上)', key: 'invoiceNumber', col: 8 },
          { label: '火车票代码(左下)', key: 'invoiceCode', col: 8 },
        ],
        [
          { label: '发票代码', key: 'ticketNo', col: 24 },
        ],
        [
          { label: '出发站', key: 'origin', col: 8 },
          { label: '到达站', key: 'destination', col: 8 },
          { label: '车次', key: 'transportationNo', col: 8 },
        ],
        [
          { label: '出行日期', key: 'invoiceDate', col: 8 },
          { label: '座位等级', key: 'class', col: 8 },
          { label: '座位号', key: 'seatNo', col: 8 },
        ],
        [
          { label: '旅客姓名', key: 'passengerName', col: 8 },
          { label: '证件号码', key: 'passengerID', col: 8 },
          { label: '金额合计（小写）', key: 'amountWithTax', col: 8 }, // amountWithoutTax
        ],
        [
          { label: '火车票销售地', key: 'sellerAddress', col: 12, width: 100 },
          { label: '出发地是否为国内', key: 'isDomestic', col: 12, width: 100 },
        ],
      ];
      break;
    case '委外工程验工结算表':
    case '机械设备租赁费结算单':
      getBase.fields[0] = [
        { label: '发票类型', key: 'invoiceType', col: 24 },
      ]
      break;
    case '航空运输电子客票行程单':
      getBase.fields = [
        [
          { label: '发票类型', key: 'invoiceType', col: 24 },
        ],
        [
          { label: '印刷序号', key: 'serialNo', col: 12 },
          { label: '电子客票号码', key: 'invoiceCode', col: 12, width: 100 },
        ],
        [
          { label: '旅客姓名', key: 'passengerName', col: 12 },
          { label: '证件号码', key: 'passengerID', col: 12 },
        ],
        [
          { label: '票价', key: 'fare', col: 8 },
          { label: '保险费', key: 'insurance', col: 8 },
          { label: '其他税费', key: 'otherTaxes', col: 8 },
        ],
        [
          { label: '民航发展基金', key: 'CAACDF', col: 12, width: 100 },
          { label: '合计', key: 'amountWithTax', col: 12 },
        ],
        [
          { label: '填开日期', key: 'issueDate', col: 8 },
          { label: '填开单位', key: 'sellerName', col: 8 },
          { label: '销售单位代号', key: 'agentCode', col: 8, width: 100 },
        ],
        [
          { label: '出发地是否为国内', key: 'isDomestic', col: 12, width: 100 },
        ],
      ];
      getItems = flightsDetail;
      break;

    default:
      break;
  }
  return [getBase, buyer, seller, getItems, other];
}
const base = {
  label: '基本信息', prename: 'baseInfo-', checkField: 'invoiceType', fields: [
    [
      { label: '发票类型', key: 'invoiceType', col: 8 },
      { label: '发票代码', key: 'invoiceCode', col: 8 },
      { label: '发票号码', key: 'invoiceNo', col: 8 },
    ],
    [
      { label: '发票机打代码', key: 'invoicePrintCode', col: 12, width: 120 },
      { label: '发票机打号码', key: 'invoicePrintNo', col: 12, width: 120 },
    ],
    [
      { label: '开票日期', key: 'invoiceDate', col: 12 },
      { label: '校验码', key: 'invoiceCRC', col: 12 },
    ],
    [
      { label: '金额合计', key: 'amountWithoutTax', col: 8 },
      { label: '税额合计', key: 'taxAmount', col: 8 },
      { label: '价税合计（小写）', key: 'amountWithTax', col: 8 },
    ],
    [
      { label: '金额', key: 'invoiceAmount', col: 8 },
      { label: '票据归属地', key: 'invoiceAddress', col: 16, width: 100 },
    ],
    [
      { label: '发票抬头', key: 'invoiceTitle', col: 24 },
    ],
    [
      { label: '乙方', key: 'partyB', col: 24 },
      { label: '乙方', key: 'outsourcer', col: 24 },
    ],
    [
      { label: '本期计价金额', key: 'currentValuationAmount', col: 24, width: 120 },
    ],
  ]
};
const buyer = {
  label: '购买方信息', prename: 'buyerInfo-', checkField: 'purchaserName', fields: [
    [
      { label: '名称', key: 'purchaserName', col: 10, width: 100 },
      { label: '地址电话', key: 'purchaserAddress', col: 14, width: 100 },
    ],
    [
      { label: '纳税人识别号', key: 'purchaserTaxNo', col: 10, width: 100 },
      { label: '开户行及账号', key: 'purchaserIDNumber', col: 14, width: 100 },
    ],
    [
      { label: '身份证号码', key: 'purchaserIDNumber', col: 24, width: 100 },
    ],
  ]
};
const seller = {
  label: '销售方信息', prename: 'sellerInfo-', checkField: 'sellerName', fields: [
    [
      { label: '名称', key: 'sellerName', col: 10, width: 100 },
      { label: '地址电话', key: 'sellerAddress', col: 14, width: 100 },
    ],
    [
      { label: '纳税人识别号', key: 'sellerTaxNo', col: 10, width: 100 },
      { label: '开户行及账号', key: 'sellerBankAccount', col: 14, width: 100 },
    ],
  ]
}
const other = {
  label: '其他', prename: 'otherInfo-', checkField: 'specialSeal', fields: [
    [
      { label: '是否有发票专用章', key: 'specialSeal', col: 10, width: 120 },
      { label: '备注', key: 'remarks', col: 14 },
    ],
  ]
}
const itemDetail = {
  label: '发票详情', prename: 'invoiceInfo-', isItems: true, checkField: 'invoiceItems', fields: [
  ],
  showSummary: true,
  columns: [
    { label: '货物或应税劳务、服务名称', key: 'itemName', width: 180 },
    { label: '单位', key: 'itemUnit', width: 60 },
    { label: '数量', key: 'itemQuantity', width: 60 },
    { label: '单价', key: 'itemUnitPrice', width: 60 },
    { label: '金额', key: 'itemAmount', width: 120 },
    { label: '税率', key: 'itemTaxRate', width: 60 },
    { label: '税额', key: 'itemTaxAmount', width: 60 },
  ],
}

const flightsDetail = {
  label: '航班信息', prename: 'invoiceInfo-', isItems: true, checkField: 'invoiceFlights', fields: [
  ],
  showSummary: false,
  columns: [
    { label: '日期', key: 'fpDate', width: 180 },
    { label: '时间', key: 'fpTime', width: 60 },
    { label: '航班号', key: 'fpFlightNumber', width: 60 },
    { label: '起点', key: 'fpDeparture', width: 60 },
    { label: '终点', key: 'fpDestination', width: 120 },
    { label: '承运', key: 'fpCarrier', width: 60 },
    { label: '舱等', key: 'fpClass', width: 60 },
  ],
}
// 材料动态报表封面
const imgBase = {
  label: '基本信息', prename: 'baseInfo-', checkField: 'invoiceType', fields: [
    [
      { label: '影像类型', key: 'invoiceType', col: 24 },
    ],
    // 材料动态报表封面
    [
      { label: '本月发料小计合计', key: 'monthSum', col: 24 },
      { label: '本月发料主材小计', key: 'monthMainMaterialSum', col: 8, width: 120, },
      { label: '本月发料油料小计', key: 'monthMaterialOilSum', col: 8, width: 120, },
    ],
    [
      { label: '本月发料辅材小计', key: 'monthAuxiliaryMaterialSum', col: 8, width: 120, },
      { label: '本月发料配件小计', key: 'monthMaterialPartsSum', col: 8, width: 120, },
      { label: '本月发料其他小计', key: 'monthMaterialOthersSum', col: 8, width: 120, },
    ],
    [
      { label: '本月发料外购半成品小计', key: 'monthPurchasedSemiSum', col: 8, width: 120, },
      { label: '本月发料研发费合计', key: 'monthMaterialRDFundSum', col: 8, width: 120, },
      { label: '本月发料安全费合计', key: 'monthMaterialSafetyFeeSum', col: 8, width: 120, },
    ],
    [
      { label: '本月发料主体工程合计', key: 'fpMainTotal', col: 8, width: 120, },
      { label: '本月发料临建工程合计', key: 'fpTemporaryTotal', col: 8, width: 120, },
      { label: '本月发料调出合计', key: 'fpExportTotal', col: 8, width: 120, },
    ],
    [
      { label: '本月发料其他合计', key: 'fpOtherTotal', col: 8, width: 120, },
    ],
    // 银行承兑汇票
    [
      { label: '票据金额', key: 'billAmount', col: 12, width: 100 },
      { label: '大写金额', key: 'fpCapitalAmount', col: 12, width: 100 },
    ],
    [
      { label: '出票日期', key: 'fpDate', col: 12, width: 100 },
      { label: '票据号码', key: 'fpNumber', col: 12, width: 100 },
    ],
    [
      { label: '出票人全称', key: 'fpPayerName', col: 8, width: 100 },
      { label: '出票人账号', key: 'fpPayerAccount', col: 8, width: 100 },
      { label: '出票人开户银行', key: 'fpPayerBank', col: 8, width: 100 },
    ],
    [
      { label: '收款人全程', key: 'fpBeneficiaryName', col: 8, width: 100 },
      { label: '收款人账号', key: 'fpBeneficiaryAccount', col: 8, width: 100 },
      { label: '收款人开户银行', key: 'fpBeneficiaryBank', col: 8, width: 100 },
    ],
    [
      { label: '承兑人全称', key: 'fpAcceptorName', col: 12, width: 100 },
      { label: '承兑人账号', key: 'fpAcceptorAccount', col: 12, width: 100 },
    ],
    [
      { label: '承兑人开户行行号', key: 'fpAcceptorBankID', col: 12, width: 100 },
      { label: '承兑人开户行名称', key: 'fpAcceptorBank', col: 12, width: 100 },
    ],
    // 税收完税说明
    [
      { label: '金额合计（小写）', key: 'amountTotal', col: 8, width: 100 },
      { label: '金额合计（大写）', key: 'fpCapitalAmount', col: 8, width: 100 },
      { label: '填发日期', key: 'fpDate', col: 8, width: 100 },
      { label: '税务机关', key: 'fpTaxAuthority', col: 8, width: 100 },
      { label: '纳税人识别号', key: 'fpPayerID', col: 8, width: 100 },
      { label: 'itemTaxID	原凭证号', key: 'fpItems', col: 8, width: 100 },
      { label: 'itemTaxType	税种', key: 'fpItems', col: 8, width: 100 },
      { label: 'itemName	品目名称', key: 'fpItems', col: 8, width: 100 },
      { label: 'itemDuringPeriod	税款所属时期', key: 'fpItems', col: 8, width: 100 },
      { label: 'itemWarehouseDate	入(退)库日期', key: 'fpItems', col: 8, width: 100 },
      { label: 'itemAmount	实缴(退)金额', key: 'fpItems', col: 8, width: 100 },

    ],
  ]
}
