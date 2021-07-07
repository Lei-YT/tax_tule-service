import {
  login,
  logout,
} from '@/api/user'
import { setId, getId, setToken, getToken, setUserName, getUserName, savaPW } from '@/libs/util'
import { Notification } from 'element-ui'

export default {
  state: {
    userName: getUserName(),
    isNewUser: 0,
    showPWModify: false,
    id: getId(),
    avatarImgPath: '',
    token: getToken(),
    adminNo: '',
    access: '',
    stationName: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    saveAccount(state, account){
      savaPW(account);
    },
    setIsNewUser(state, isNew) {
      state.isNewUser = isNew;
    },
    setShowPWModify(state, ifShow){
      state.showPWModify =  ifShow;
    },
    setAvatar(state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setId(state, id) {
      state.id = id
      setId(id)
    },
    setUserName(state, name) {
      state.userName = name
      setUserName(name)
    },
    setAdminNo(state, adminNo) {
      state.adminNo = adminNo
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setAccess(state, access) {
      state.access = access
    },
    setStationName(state, stationName) {
      state.stationName = stationName
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setMessageCount(state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList(state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList(state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore(state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg(state, { from, to, msg_id }) {
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
    handleLogin({ commit }, { adminNo, password, remember }) {
      adminNo = adminNo.trim()
      return new Promise((resolve, reject) => {
        login({
          adminNo,
          password
        }).then(res => {
          if (res.data.code != 0) {
            Notification({
              message: res.data.msg,
              type: 'warning',
              duration: 1300
            })
            return false
          } else {
            commit('setIsNewUser', Number(res.data.data.is_new))
            commit('setShowPWModify', Number(res.data.data.is_new)!==0)
            if (Number(res.data.data.is_new)===0) {
              commit('setToken', res.data.data.token)
              commit('setId', res.data.data.id)
              commit('setUserName', res.data.data.name)
              commit('setAvatar', res.data.data.imgUrl)
              commit('setAdminNo', res.data.data.adminNo)
              commit('setAccess', res.data.data.adminNo)
              commit('setStationName', res.data.data.stationName)
              if (remember) commit('saveAccount', {adminNo, password})
            }
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then((res) => {
          if (res.data.code == 0) {
            Notification({
              message: res.data.msg,
              type: 'success',
            })
            commit('setId', '')
            commit('setToken', '')
            commit('setUserName', '')
            commit('setAvatar', '')
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res
        commit('setMessageCount', data)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList({ state, commit }) {
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
    getContentByMsgId({ state, commit }, { msg_id }) {
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
    hasRead({ state, commit }, { msg_id }) {
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
    removeReaded({ commit }, { msg_id }) {
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
    restoreTrash({ commit }, { msg_id }) {
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
