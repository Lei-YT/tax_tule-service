
export const matchCNkeys = (invoiceType, invoiceObject) => {
  switch (invoiceType) {
    case '增值税普通发票':
      invoiceObject = renameKeys(zzsptfp, invoiceObject);
      break;

    case '增值税专用发票':
      invoiceObject = renameKeys(zzszyfp, invoiceObject);
      break;

    case '增值税电子普通发票':
      invoiceObject = renameKeys(zzsdzptfp, invoiceObject);
      break;

    case '增值税电子专用发票':
      invoiceObject = renameKeys(zzsdzzyfp, invoiceObject);
      break;

    case '增值税电子普通发票（区块链）':
      invoiceObject = renameKeys(zzsdzptfp_qkl, invoiceObject);
      break;

    case '增值税电子普通发票（通行费）':
      invoiceObject = renameKeys(zzsdzptfp_txf, invoiceObject);
      break;

    case '增值税电子普通发票（卷票）':
      invoiceObject = renameKeys(zzsdzptfp_jp, invoiceObject);
      break;

    case '通用机打发票':
      invoiceObject = renameKeys(tyjdfp, invoiceObject);
      break;

    case '机动车销售统一发票':
      invoiceObject = renameKeys(jdcxstyfp, invoiceObject);
      break;

    case '二手车销售统一发票':
      invoiceObject = renameKeys(escxstyfp, invoiceObject);
      break;

    case '航空运输电子客票行程单':
      invoiceObject = renameKeys(hkysdzkpxcd, invoiceObject);
      break;

    case '定额发票':
      invoiceObject = renameKeys(defp, invoiceObject);
      break;

    case '火车票':
      invoiceObject = renameKeys(hcp, invoiceObject);
      break;

    case '过路过桥费发票':
      invoiceObject = renameKeys(glgqffp, invoiceObject);
      break;

    case '出租车票':
      invoiceObject = renameKeys(czcp, invoiceObject);
      break;
    default:
      // test: 增值税专用发票
      // invoiceObject = renameKeys(zzszyfp, invoiceObject);
      break;
  }
  return invoiceObject;
}
const renameKeys = (keysMap, obj) => {
  const newObject = Object.keys(obj).reduce(
    (acc, key) => ({
      '发票ID': obj['invoiceId'],
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
      '发票详情': obj.hasOwnProperty('invoiceItems') ? obj['invoiceItems'].map((ii) => Object.keys(ii).reduce(
        (acci, keyi) => ({
          ...acci,
          ...{ [keysMap[keyi] || keyi]: ii[keyi] },
        }),
        {}
      )) : '',
    }),
    {}
  );
  delete newObject['invoiceId'];
  return newObject;
};
// 出租车票
const czcp = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoiceDate: "发票日期",
  amountWithTax: "价税合计（小写）",
  specialSeal: "销货单位盖章",

}
// 过路过桥费发票
const glgqffp = {
  invoiceType: "发票类型",
  ticketNo: "发票代码",
  origin: "出发站",
  destination: "到达站",
  transportationNo: "车次",
  invoiceDate: "出行日期",
  invoiceTime: "开车时间",
  seatNo: "座位号",
  amountWithTax: "价税合计（小写）",
  class: "座位等级",
  passengerName: "旅客姓名",
  passengerID: "证件号码",
  sellerAddress: "火车票销售地",

}
// 火车票
const hcp = {
  invoiceType: "发票类型",
  ticketNo: "发票代码",
  origin: "出发站",
  destination: "到达站",
  transportationNo: "车次",
  invoiceDate: "出行日期",
  invoiceTime: "开车时间",
  seatNo: "座位号",
  amountWithTax: "价税合计（小写）",
  class: "座位等级",
  passengerName: "旅客姓名",
  passengerID: "证件号码",
  sellerAddress: "火车票销售地",

}
// 定额发票
const defp = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  amountWithTax: "价税合计（小写）",
  specialSeal: "销货单位盖章",

}
// 航空运输电子客票行程单
const hkysdzkpxcd = {
  invoiceType: "发票类型",
  serialNo: "印刷序号",
  passengerName: "旅客姓名",
  passengerID: "证件号码",
  restrictions: "签注",
  invoiceFlights: "航班信息",
  origin: "起点",
  destination: "终点",
  carrier: "承运人",
  transportationNo: "航班号",
  invoiceTime: "时间",
  class: "座位等级",
  invoiceDate: "日期",
  fare: "票价",
  CAACDF: "民航发展基金",
  fuelSurcharge: "燃油附加费",
  otherTaxes: "其他税费",
  amountWithTax: "合计",
  invoiceCode: "电子客票号码",
  insurance: "保险费",
  agentCode: "销售单位代号",
  sellerName: "填开单位",
  issueDate: "填开日期",
  specialSeal: "销货单位盖章",

}
// 二手车销售统一发票
const escxstyfp = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoiceDate: "开票日期",
  invoicePrintCode: "发票机打代码",
  invoicePrintNo: "发票机打号码",
  purchaserName: "购买方信息-购买方名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  invoiceFormName: "发票联次名称",
  amountWithTax: "价税合计（小写）",
  auctionUnitName: "经营、拍卖单位名称",
  auctionUnitAddress: "经营、拍卖单位地址",
  auctionUnitTaxNo: "经营、拍卖单位纳税人识别号",
  auctionUnitBankAccount: "经营、拍卖单位开户银行、账号",
  auctionUnitPhoneNo: "经营、拍卖单位电话",
  secondHandCarMarketName: "二手车市场名称",
  secondHandCarMarketTaxNo: "二手车市场纳税人识别号",
  secondHandCarMarketAddress: "二手车市场地址",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  taxRate: "增值税税率或征收率",
  taxAmount: "增值税税额",
  amountWithoutTax: "合计金额（小写）",
  specialSeal: "销货方（章）",

}
// 机动车销售统一发票
const jdcxstyfp = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoicePrintCode: "发票机打代码",
  invoiceNo: "发票号码",
  invoicePrintNo: "发票机打号码",
  invoiceDate: "开票日期",
  purchaserName: "购买方信息-购买方名称",
  purchaserIDNumber: "购买方信息-身份证号码",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  invoiceFormName: "发票联次名称",
  amountWithTax: "价税合计（小写）",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  taxRate: "增值税税率或征收率",
  taxAmount: "增值税税额",
  amountWithoutTax: "合计金额（小写）",
  specialSeal: "销货方（章）",

}
// 通用机打发票
const tyjdfp = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoicePrintNo: "发票机打号码",
  invoiceDate: "开票日期",
  industryCategory: "行业分类",
  sellerName: "收款单位",
  sellerTaxNo: "销售方信息-纳税人识别号",
  purchaserName: "付款单位",
  purchaserTaxNo: "付款单位-纳税人识别号",
  invoiceFormName: "发票联次名称",
  invoiceItems: "发票详情--发票详情",
  itemName: "发票详情--项目名称",
  itemUnitPrice: "发票详情--单价",
  itemQuantity: "发票详情--数量",
  itemAmount: "发票详情--金额",
  remarks: "备注",
  amountWithTax: "合计金额（小写）",
  specialSeal: "销货方（章）",

}
// 增值税电子普通发票（卷票）
const zzsdzptfp_jp = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoicePrintNo: "发票机打号码",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  invoiceDate: "开票日期",
  receiptor: "收款员",
  purchaserName: "购买方信息-名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  invoiceItems: "发票详情",
  itemName: "发票详情--项目名称",
  itemUnitPrice: "发票详情--单价",
  itemQuantity: "发票详情--数量",
  itemAmount: "发票详情--金额",
  amountWithTax: "合计金额（小写）",
  specialSeal: "销货方（章）",

}
// 增值税电子普通发票（通行费）
const zzsdzptfp_txf = {
  invoiceType: "发票类型",
  invoiceSubType: "发票子分类(通行费)",
  fileType: "票据文件格式，纸质票为空",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoiceDate: "开票日期",
  purchaserName: "购买方信息-名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  purchaserAddress: "购买方信息-地址、电话",
  purchaserBankAccount: "购买方信息-开户行及账号",
  invoiceItems: "发票详情",
  itemName: "发票详情--项目名称",
  itemModel: "发票详情--规格型号",
  itemUnit: "发票详情--单位",
  itemQuantity: "发票详情--数量",
  itemUnitPrice: "发票详情--单价",
  itemAmount: "发票详情--金额",
  itemTaxRate: "发票详情--税率",
  itemTaxAmount: "发票详情--税额",
  taxAmount: "税额合计",
  amountWithoutTax: "金额合计",
  amountWithTax: "价税合计（小写）",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  sellerAddress: "销售方信息-地址、电话",
  sellerBankAccount: "销售方信息-开户行及账号",
  remarks: "备注",
  specialSeal: "销货方（章）",

}
// 增值税电子普通发票（区块链）
const zzsdzptfp_qkl = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoiceDate: "开票日期",
  purchaserName: "购买方信息-名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  purchaserAddress: "购买方信息-地址、电话",
  purchaserEPayMark: "购买方信息-电子支付标识",
  invoiceFormName: "发票联次名称",
  invoiceItems: "发票详情",
  itemName: "发票详情--项目名称",
  itemModel: "发票详情--规格型号",
  itemUnit: "发票详情--单位",
  itemQuantity: "发票详情--数量",
  itemUnitPrice: "发票详情--单价",
  itemAmount: "发票详情--金额",
  itemTaxRate: "发票详情--税率",
  itemTaxAmount: "发票详情--税额",
  taxAmount: "税额合计",
  amountWithoutTax: "金额合计",
  amountWithTaxDX: "价税合计（大写）",
  amountWithTax: "价税合计（小写）",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  sellerAddress: "销售方信息-地址、电话",
  sellerBankAccount: "销售方信息-开户行及账号",
  remarks: "备注",
  specialSeal: "销售方（章）",

}
// 增值税电子专用发票
const zzsdzzyfp = {
  invoiceType: "发票类型",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoiceDate: "开票日期",
  purchaserName: "购买方信息-名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  purchaserAddress: "购买方信息-地址、电话",
  purchaserBankAccount: "购买方信息-开户行及账号",
  invoiceItems: "发票详情",
  itemName: "发票详情--项目名称",
  itemModel: "发票详情--规格型号",
  itemUnit: "发票详情--单位",
  itemQuantity: "发票详情--数量",
  itemUnitPrice: "发票详情--单价",
  itemAmount: "发票详情--金额",
  itemTaxRate: "发票详情--税率",
  itemTaxAmount: "发票详情--税额",
  taxAmount: "税额合计",
  amountWithoutTax: "金额合计",
  amountWithTax: "价税合计（小写）",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  sellerAddress: "销售方信息-地址、电话",
  sellerBankAccount: "销售方信息-开户行及账号",
  remarks: "备注",
  specialSeal: "销货方（章）",

}
// 增值税电子普通发票
const zzsdzptfp = {
  invoiceType: "发票类型",
  invoiceSubType: "发票子分类(通行费/成品油)",
  fileType: "票据文件格式，纸质票为空",
  invoiceCode: "发票代码",
  invoiceNo: "发票号码",
  invoiceDate: "开票日期",
  purchaserName: "购买方信息-名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  purchaserAddress: "购买方信息-地址、电话",
  purchaserBankAccount: "购买方信息-开户行及账号",
  invoiceItems: "发票详情",
  itemName: "发票详情--项目名称",
  itemModel: "发票详情--规格型号",
  itemUnit: "发票详情--单位",
  itemQuantity: "发票详情--数量",
  itemUnitPrice: "发票详情--单价",
  itemAmount: "发票详情--金额",
  itemTaxRate: "发票详情--税率",
  itemTaxAmount: "发票详情--税额",
  taxAmount: "税额合计",
  amountWithoutTax: "金额合计",
  amountWithTax: "价税合计（小写）",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  sellerAddress: "销售方信息-地址、电话",
  sellerBankAccount: "销售方信息-开户行及账号",
  remarks: "备注",
  specialSeal: "销货方（章）",

}
// 增值税普通发票
const zzsptfp = {
  invoiceType: "发票类型",
  invoiceSubType: "发票子分类(通行费/成品油)",
  fileType: "票据文件格式，纸质票为空",
  invoiceCode: "发票代码",
  invoicePrintCode: "发票机打代码",
  invoiceNo: "发票号码",
  invoicePrintNo: "发票机打号码",
  invoiceDate: "开票日期",
  purchaserName: "购买方信息-名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  purchaserAddress: "购买方信息-地址、电话",
  purchaserBankAccount: "购买方信息-开户行及账号",
  invoiceFormName: "发票联次名称",
  invoiceItems: "发票详情",
  itemName: "发票详情--项目名称",
  itemModel: "发票详情--规格型号",
  itemUnit: "发票详情--单位",
  itemQuantity: "发票详情--数量",
  itemUnitPrice: "发票详情--单价",
  itemAmount: "发票详情--金额",
  itemTaxRate: "发票详情--税率",
  itemTaxAmount: "发票详情--税额",
  taxAmount: "税额合计",
  amountWithoutTax: "金额合计",
  amountWithTax: "价税合计（小写）",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  sellerAddress: "销售方信息-地址、电话",
  sellerBankAccount: "销售方信息-开户行及账号",
  remarks: "备注",
  specialSeal: "销售方（章）",
  isDaikai: "是否为税局代开",
}
// 增值税专用发票
const zzszyfp = {
  invoiceType: "发票类型",
  invoiceSubType: "发票子分类（通行费/成品油）",
  fileType: "票据文件格式，纸质票为空",
  invoiceCode: "发票代码",
  invoicePrintCode: "机打发票代码",
  invoiceNo: "发票号码",
  invoicePrintNo: "机打发票号码",
  invoiceDate: "开票日期",
  purchaserName: "购买方信息-名称",
  purchaserTaxNo: "购买方信息-纳税人识别号",
  purchaserAddress: "购买方信息-地址、电话",
  purchaserBankAccount: "购买方信息-开户行及账号",
  invoiceFormName: "发票联次名称",
  invoiceItems: "发票详情",
  itemName: "发票详情--项目名称",
  itemModel: "发票详情--规格型号",
  itemUnit: "发票详情--单位",
  itemQuantity: "发票详情--数量",
  itemUnitPrice: "发票详情--单价",
  itemAmount: "发票详情--金额",
  itemTaxRate: "发票详情--税率",
  itemTaxAmount: "发票详情--税额",
  taxAmount: "税额合计",
  amountWithoutTax: "金额合计",
  amountWithTax: "价税合计（小写）",
  sellerName: "销售方信息-名称",
  sellerTaxNo: "销售方信息-纳税人识别号",
  sellerAddress: "销售方信息-地址、电话",
  sellerBankAccount: "销售方信息-开户行及账号",
  remarks: "备注",
  specialSeal: "销售方（章）",
  isDaikai: "是否为税局代开",
}
