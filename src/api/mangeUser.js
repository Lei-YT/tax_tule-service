import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const getUserList = (params) => {
  return axios.request({
    url: `/api/user/list`, //?pagesize=${params.pagesize}&pageindex=${params.pageindex}&name=${params.name}&stationName=${params.stationName}`,
    data: {
      pagesize: params.pagesize,
      pageindex: params.pageindex,
      name: params.name,
    },
    method: 'POST'
  })
}

// 添加导入用户查询接口
export const getAddlist = (params) => {
  return axios.request({
    url: `/api/user/addlist`,
    data: {
      userName: params.userName,
    },
    method: 'POST'
  })
}
// 账号启用/禁用
export const enableUser = (params) => {
  return axios.request({
    url: `/api/user/enable`,
    data: params,
    method: 'POST'
  })
}
// 账号删除
export const delUsers = (id) => {
  return axios.request({
    url: `/api/user/del`,
    data: id,
    method: 'POST'
  })
}

// 账号新增
export const addUser = (params) => {
  return axios.request({
    url: `/api/user/add`, //?stationName=${params.stationName}&name=${params.name}&adminNo=${params.adminNo}&password=${params.password}`,
    data: params,
    method: 'POST'
  })
}

// 导入添加
export const importAddUser = (params) => {
  return axios.request({
    url: `/api/user/adduser`, //?stationName=${params.stationName}&name=${params.name}&adminNo=${params.adminNo}&password=${params.password}`,
    data: params,
    method: 'POST'
  })
}
// 机构用户列表
export const getOrganUserList = (params) => {
  return axios.request({
    url: `/api/user/userlist`,
    data: params,
    method: 'POST'
  })
}
// 机构列表
export const getOrganList = (params) => {
  return axios.request({
    url: `/api/user/organlist`,
    data: params,
    method: 'POST'
  })
}
// 机构子级列表
export const getOrganChildren = (params) => {
  return axios.request({
    url: `/api/user/organchilds`,
    data: params,
    method: 'POST'
  })
}
// 岗位列表
export const getStation = (params) => {
  return axios.request({
    url: `/api/user/station`,
    data: params,
    method: 'POST'
  })
}
// 权限列表
export const getPower = (params) => {
  return axios.request({
    url: `/api/user/powerlist`,
    data: params,
    method: 'POST'
  })
}
// 岗位权限列表
export const getStationPower = (params) => {
  return axios.request({
    url: `/api/user/stationpower`,
    data: params,
    method: 'POST'
  })
}
// 删除岗位权限
export const deleteStationPower = (params) => {
  return axios.request({
    url: `/api/user/delstation`,
    data: params,
    method: 'POST'
  })
}
// 删除岗位
export const deleteStation = (params) => {
  return axios.request({
    url: `/api/user/delstation`,
    data: params,
    method: 'POST'
  })
}
// 修改岗位权限
export const editStation = (params) => {
  return axios.request({
    url: `/api/user/editstation`,
    data: params,
    method: 'POST'
  })
}
// +岗位
export const addStation = (params) => {
  return axios.request({
    url: `/api/user/addstation`,
    data: params,
    method: 'POST'
  })
}
// +机构
export const addOrgan = (params) => {
  return axios.request({
    url: `/api/user/addorgan`,
    data: params,
    method: 'POST'
  })
}
// 用户的机构>岗位
export const userOrgan = (params) => {
  return axios.request({
    url: `/api/user/useroslist`,
    data: params,
    method: 'POST'
  })
}
// 删除用户的机构>岗位
export const deleteUserOrgan = (params) => {
  return axios.request({
    url: `/api/user/userosdel`,
    data: params,
    method: 'POST'
  })
}
// 机构>岗位
export const organStation = (params) => {
  return axios.request({
    url: `/api/user/organstationlist`,
    data: params,
    method: 'POST'
  })
}
// 用户+机构
export const userAddOrgan = (params) => {
  return axios.request({
    url: `/api/user/userosadd`,
    data: params,
    method: 'POST'
  })
}
// 用户 绑定 机构
export const userWithOrgan = (params) => {
  return axios.request({
    url: `/api/user/userwithorgan`,
    data: params,
    method: 'POST'
  })
}
// todo:
// ? 机构-岗位绑定，组成机构+岗映射关系 这个操作在哪
// ? 用户-机构绑定，组成机构+岗映射关系 这个操作在哪; 原型是用户直接绑定机构的岗位
