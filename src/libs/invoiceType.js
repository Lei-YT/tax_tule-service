export default [
  {
    label: '通用附件', value: '通用附件',
    children: [
      {
        label: '发票', value: '发票',
        children: [
          { label: '专用发票', value: '专用发票' },
          { label: '普通发票', value: '普通发票' },
          { label: '通行费增值税电子普通发票', value: '通行费增值税电子普通发票' },
          { label: '国内旅客运输服务电子增值税普通发票', value: '国内旅客运输服务电子增值税普通发票' },
          { label: '航空运输电子客票行程单', value: '航空运输电子客票行程单' },
          { label: '铁路车票', value: '铁路车票' },
          { label: '其他实名制客票', value: '其他实名制客票' },
          { label: '其他可抵扣票据', value: '其他可抵扣票据' },
          { label: '通用机打发票', value: '通用机打发票' },
          { label: '通用（电子）发票', value: '通用（电子）发票' },
          { label: '定额发票', value: '定额发票' },
          { label: '财政票据', value: '财政票据' },
          { label: '简易发票', value: '简易发票' },
        ]
      },
      {
        label: '银行回单', value: '银行回单',
        children: [
          { label: '中国银行', value: '中国银行', children: [] },
          { label: '中国农业银行', value: '中国农业银行', children: [] },
          { label: '中国工商银行', value: '中国工商银行', children: [] },
          { label: '中国建设银行', value: '中国建设银行', children: [] },
          { label: '中国交通银行', value: '中国交通银行', children: [] },
          {
            label: '中信银行', value: '中信银行', children: [
              { label: '中信银行1', value: '中信银行1', children: [] },
              { label: '中信银行2', value: '中信银行2', children: [] },]
          },
          { label: '兴业银行', value: '兴业银行', children: [] },
          {
            label: '招商银行', value: '招商银行', children: [
              { label: '招商银行1', value: '招商银行1', children: [] },
              { label: '招商银行2', value: '招商银行2', children: [] },]
          },
        ]
      },
      {
        label: '承兑汇票', value: '承兑汇票', children: [
          { label: '商业承兑汇票', value: '商业承兑汇票' },
          { label: '银行承兑汇票', value: '银行承兑汇票' },]
      },
      { label: '完税证明', value: '完税证明', children: [] },
      { label: '税收缴款书', value: '税收缴款书', children: [] },
    ]
  },
  {
    label: '自制单据', value: '自制单据',
    children: [
      {
        label: '结算单', value: '结算单',
        children: [
          { label: '委外工程验工结算表', value: '委外工程验工结算表' },
          { label: '机械设备租赁费结算单', value: '机械设备租赁费结算单' },]
      },
      {
        label: '备用金单据', value: '备用金单据',
        children: [
          { label: '借款单', value: '借款单' },
          { label: '交款单', value: '交款单' },
          { label: '领款单', value: '领款单' },]
      },
      {
        label: '摊销表', value: '摊销表',
        children: [
          { label: '低值易耗品摊销表', value: '低值易耗品摊销表' },
          { label: '周转材料摊销表', value: '周转材料摊销表' },
          { label: '临时设施摊销计算表', value: '临时设施摊销计算表' },]
      },
      {
        label: '业务招待情况表', value: '业务招待情况表',
        children: []
      },
      {
        label: '内部往来通知书', value: '内部往来通知书',
        children: []
      },
      {
        label: '资金支付审批单', value: '资金支付审批单',
        children: [
          { label: '资金支付审批单1', value: '资金支付审批单1' },
          { label: '资金支付审批单2', value: '资金支付审批单2' },
          { label: '资金支付审批单3', value: '资金支付审批单3' },
          { label: '资金支付审批单4', value: '资金支付审批单4' },]
      },
      {
        label: '材料动态报表封面', value: '材料动态报表封面',
        children: []
      },
      {
        label: '内部食堂就餐审批单', value: '内部食堂就餐审批单',
        children: []
      },
      {
        label: '中铁财务公司回单', value: '中铁财务公司回单',
        children: []
      },
      {
        label: '增值税进项税额汇总清单', value: '增值税进项税额汇总清单',
        children: []
      },
      {
        label: '税金及附加计提表', value: '税金及附加计提表',
        children: []
      },
      {
        label: '出库单', value: '出库单',
        children: []
      },
      {
        label: '低值易耗品', value: '低值易耗品',
        children: [
          { label: '低值易耗品点收单', value: '低值易耗品点收单' },
          { label: '低值易耗品领用单', value: '低值易耗品领用单' },]
      },
      {
        label: '出库扫描件', value: '出库扫描件',
        children: []
      },
    ]
  },
];
