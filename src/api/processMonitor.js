import axios from '@/libs/api.request'

// 机器人操作日志接口
export const getLogslist = (params) => {
  return axios.request({
    url: `/api/scene/logslist`, //?pageindex=${params.pageindex}&pagesize=${params.pagesize}&endTime=${params.endTime}&beginTime=${params.beginTime}&operate=${params.operate}&sceneName=${params.sceneName}&sceneId=${params.sceneId}`,
    data: params,
    method: 'POST'
  })
}

// 机器人信息管理列表接口
export const getScenelist = (params) => {
  return axios.request({
    url: `/api/scene/scenelist`, //?pageindex=${params.pageindex}&pagesize=${params.pagesize}&name=${params.name}`,
    data: params,
    method: 'POST'
  })
}

// 添加机器人接口
export const addscene = (params) => {
  return axios.request({
    url: `/api/scene/addscene`, //?name=${params.name}&label=${params.label}&describe=${params.describe}&ip=${params.ip}`,
    data: params,
    method: 'POST'
  })
}

// 编辑机器人接口
export const editscene = (params) => {
  return axios.request({
    url: `/api/scene/editscene`, //?name=${params.name}&id=${params.id}&label=${params.label}&describe=${params.describe}&ip=${params.ip}`,
    data: params,
    method: 'POST'
  })
}

// 删除机器人接口
export const deletescene = (params) => {
  return axios.request({
    url: `/api/scene/deletescene`, //?id=${params}`,
    data: { id: params },
    method: 'POST'
  })
}

// 单量设置
export const setbill = (params) => {
  return axios.request({
    url: `/api/scene/setbill`, //?id=${params.id}&getbill=${params.getbill}&backbill=${params.backbill}`,
    data: params,
    method: 'POST'
  })
}

export const getFormProcess = (params) => {
  return axios.request({
    url: `/api/bill/getrobotformflow`,
    data: params,
    method: 'POST'
  })
}

export const deleteFormProcess = (params) => {
  return axios.request({
    url: `/api/bill/delflow`,
    data: params,
    method: 'POST'
  })
}

export const updateFormProcess = (params) => {
  return axios.request({
    url: `/api/bill/updateFlowStatus`,
    data: params,
    method: 'POST'
  })
}
