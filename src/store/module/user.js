import {
  login,
  logout
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { Notification } from 'element-ui'

export default {
  state: {
    userName: '',
    id: '',
    avatarImgPath: '',
    token: getToken(),
    adminNo: '',
    stationName: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setId (state, id) {
      state.id = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAdminNo (state, adminNo) {
      state.adminNo = adminNo
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setStationName (state, stationName) {
      state.stationName = stationName
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { adminNo, password }) {
      adminNo = adminNo.trim()
      return new Promise((resolve, reject) => {
        const tmpJson = {
          'code': 0,
          'msg': '操作成功.',
          'data': {
            'id': 1,
            'stationName': 'admin',
            'name': '超级管理员',
            'imgUrl': 'http://pic.58pic.com/58pic/14/86/98/88X58PICz9T_1024.jpg',
            'adminNo': 'admin',
            'isEnable': 0,
            'created_at': '2020-12-18 15:56:39',
            'updated_at': '2020-08-22 14:21:11',
            'deleted_at': null,
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6Ly8xMC43LjEuNjgvYXBpL2xvZ2luL2xvZ2luIiwiaWF0IjoxNjE5Njk4ODAzLCJleHAiOjE2MjIyOTA4MDMsIm5iZiI6MTYxOTY5ODgwMywianRpIjoiU1BrRGk4dVpLWm1yd1hGcSJ9.9T46DIJ2x7FNhofr78LFtQGbS8hUif55btM3UV_fNZQ'
          }
        }
        commit('setToken', tmpJson.data.token)
        commit('setId', tmpJson.data.id)
        commit('setUserName', tmpJson.data.name)
        commit('setAvatar', tmpJson.data.imgUrl)
        commit('setAdminNo', tmpJson.data.adminNo)
        commit('setStationName', tmpJson.data.stationName)
        resolve(tmpJson)
        // login({
        //   adminNo,
        //   password
        // }).then(res => {
        //   console.log(res,'res111111111111');
        //   if (res.data.code != 0) {
        //     Notification({
        //       message: res.data.msg,
        //       type: 'warning',
        //       duration: 1300
        //     })
        //     return false
        //   } else {
        //     commit('setToken', res.data.data.token)
        //     commit('setId', res.data.data.id)
        //     commit('setUserName', res.data.data.name)
        //     commit('setAvatar', res.data.data.imgUrl)
        //     commit('setAdminNo', res.data.data.adminNo)
        //     commit('setStationName', res.data.data.stationName)
        //     resolve(res.data)
        //   }
        // }).catch(err => {
        //     reject(err)
        // })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setUserName', '')
          commit('setAvatar', '')
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res
        commit('setMessageCount', data)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
