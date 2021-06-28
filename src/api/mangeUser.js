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
export const getAddlist = (params) => {
    return axios.request({
        url: `/api/user/addlist`, //?pagesize=${params.pagesize}&pageindex=${params.pageindex}&name=${params.name}&stationName=${params.stationName}`,
        data: {
            account: params.account,
            name: params.name,
        },
        method: 'POST'
    })
}
// 账号启用/禁用
export const enableUser = (params) => {
    return axios.request({
        url: `/api/user/enable`, //?id=${id}&token=${t}&isEnable=${status}`,
        data: {
            id: params.id,
            isEnable: params.isEnable
        },
        method: 'POST'
    })
}
// 账号删除
export const delUsers = (id) => {
    return axios.request({
        url: `/api/user/del`, //?id=${id}`,
        data: { id },
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
        url: `/api/user/add`, //?stationName=${params.stationName}&name=${params.name}&adminNo=${params.adminNo}&password=${params.password}`,
        data: params,
        method: 'POST'
    })
}