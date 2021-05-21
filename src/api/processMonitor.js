import axios from '@/libs/api.request'

// 机器人操作日志接口
export const getLogslist = (params) => {
    return axios.request({
        url: `/api/scene/logslist?pageindex=${params.pageindex}&pagesize=${params.pagesize}&endTime=${params.endTime}&beginTime=${params.beginTime}&operate=${params.operate}&sceneName=${params.sceneName}&sceneId=${params.sceneId}`,
        method: 'GET'
    })
}

// 机器人信息管理列表接口
export const getScenelist = (params) => {
    return axios.request({
        url: `/api/scene/scenelist?pageindex=${params.pageindex}&pagesize=${params.pagesize}&name=${params.name}`,
        method: 'GET'
    })
}

// 添加机器人接口
export const addscene = (params) => {
    return axios.request({
        url: `/api/scene/addscene?name=${params.name}&label=${params.label}&describe=${params.describe}`,
        method: 'GET'
    })
}

// 编辑机器人接口
export const editscene = (params) => {
    return axios.request({
        url: `/api/scene/editscene?name=${params.name}&id=${params.id}&label=${params.label}&describe=${params.describe}`,
        method: 'GET'
    })
}

// 删除机器人接口
export const deletescene = (params) => {
    return axios.request({
        url: `/api/scene/deletescene?id=${params.id}`,
        method: 'GET'
    })
}