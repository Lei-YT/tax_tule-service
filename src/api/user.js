import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'

// 登录
export const login = ({ adminNo, password }) => {
  return axios.request({
    url: `/api/login/login?adminNo=${adminNo}&password=${password}`,
    method: 'GET'
  })
}
// 退出登录
export const logout = () => {
  return axios.request({
    url: `/api/login/logout`,
    method: 'GET'
  })
}
// 机器人流程监控列表接口
export const homelist = ({ secneName, id }) => {
  return axios.request({
    url: `/api/scene/homelist?secneName=${secneName}&id=${id}`,
    method: 'GET'
  })
}

// 机器人流程监控页启停服务操作接口
export const changeStatus = ({ sceneId, status }) => {
  return axios.request({
    url: `/api/scene/infostatus?id=${sceneId}&status=${status}`,
    method: 'GET'
  })
}
// 机器人流程监控页启停服务操作接口: 重启
export const reboot = ({ sceneId }) => {
  return axios.request({
    url: `/api/scene/initiastatus?id=${sceneId}`,
    method: 'GET'
  })
}

// 帐号列表接口
export const getUserList = (params) => {
  return axios.request({
    url: `/api/user/list?pagesize=${params.pagesize}&pageindex=${params.pageindex}&name=${params.name}&stationName=${params.stationName}`,
    method: 'GET'
  })
}

// 账号新增
export const addUser = (params) => {
  return axios.request({
    url: `/api/user/add?stationName=${params.stationName}&name=${params.name}&adminNo=${params.adminNo}&password=${params.password}`,
    method: 'GET'
  })
}

// 账号编辑
export const editUser = (params) => {
  return axios.request({
    url: `/api/user/edit?id=${params.id}&stationName=${params.stationName}&name=${params.name}&adminNo=${params.adminNo}&password=${params.password}`,
    method: 'GET'
  })
}

// 账号删除
export const delUser = (id) => {
  return axios.request({
    url: `/api/user/del?id=${id}`,
    method: 'GET'
  })
}
// 账号启用/禁用
export const enableUser = (id, status) => {
  const t = getToken();
  return axios.request({
    url: `/api/user/enable?id=${id}&token=${t}&isEnable=${status}`,
    method: 'GET'
  })
}

// 审单日志
// export const auditLogList = (id) => {
//   return axios.request({
//     url: `/api/user/del?id=${id}`,
//     method: 'POST'
//   })
// }
