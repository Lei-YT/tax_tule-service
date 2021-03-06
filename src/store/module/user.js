import {
  login,
  logout,
  useraccess,
} from '@/api/user'
import { setPerms, setId, getId, setToken, getToken, setUserName, getUserName, savaPW } from '@/libs/util'
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
    messageContentStore: {},
    permission: [],
  },
  mutations: {
    setPermission(state, perms) {
      state.permission = perms;
      setPerms(perms);
    },
    saveAccount(state, account){
      savaPW(account);
    },
    setIsNewUser(state, isNew) {
      state.isNewUser = isNew;
    },
    setShowPWModify(state, ifShow) {
      state.showPWModify = ifShow;
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
    // ??????
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
            commit('setShowPWModify', Number(res.data.data.is_new) !== 0)
            if (Number(res.data.data.is_new) === 0) {
              commit('setToken', res.data.data.token)
              commit('setId', res.data.data.id)
              commit('setUserName', res.data.data.name)
              commit('setAvatar', res.data.data.imgUrl)
              commit('setAdminNo', res.data.data.adminNo)
              commit('setAccess', res.data.data.adminNo)
              commit('setStationName', res.data.data.stationName)
              if (remember) commit('saveAccount', {adminNo, password})
            }
            resolve(res.data.data)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // ????????????
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
    getUserPerms({ commit }, {id}) {
      const userid = id;
      return new Promise((resolve, reject) => {
        useraccess(
          userid
        ).then(res => {
          if (res.data.code != 0) {
            Notification({
              message: res.data.msg,
              type: 'warning',
              duration: 1300
            })
            return false
          } else {
            if (!res.data.hasOwnProperty('powerarr')) {
              resolve([]);
            }
            const powerarr = Object.values(res.data.powerarr);
            const powerUrl = powerarr.reduce((acc, val, ind) => {
              val.map((child) => {
                acc.push(child.url)
                acc = acc.concat(child.powerchilds.map((child2) => child2.url));
              })
              return acc;
            }, []);
            const uniqueP = [...new Set([...powerUrl])];
            commit('setPermission', uniqueP)
            resolve(uniqueP)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // ???????????????????????????????????????????????????????????????????????????????????????
    getUnreadMessageCount({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res
        commit('setMessageCount', data)
      })
    },
    // ????????????????????????????????????????????????????????????????????????
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
    // ??????????????????????????????id????????????
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
    // ????????????????????????????????????
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
    // ????????????????????????????????????
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
    // ??????????????????????????????????????????
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
