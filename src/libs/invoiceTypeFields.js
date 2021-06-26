export const getInvoiceFields = (invoiceType) => {
  let getBase = _.cloneDeep(base);
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
          { label: '电子客票号码', key: 'invoiceCode', col: 12 , width: 100 },
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
          { label: '销售单位代号', key: 'agentCode', col: 8, width: 100  },
        ],
        [
          { label: '出发地是否为国内', key: 'isDomestic', col: 12, width: 100 },
        ],
      ]
      break;

    default:
      break;
  }
  return [getBase, buyer, seller, itemDetail, other];
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
  label: '发票详情', prename: 'invoiceInfo-', checkField: 'invoiceItems', fields: [
  ]
}

const flightsDetail = {
  label: '机票详情', prename: 'invoiceInfo-', checkField: 'invoiceFlights', fields: [
  ]
}
