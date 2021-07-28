import {
  getRobots,getForms,
} from '@/api/processMonitor'
export default {
  state: {
    editFields: [],
    editFieldsItems: [],
    currentInvoiceErrorFields: [],
    robotList: [],
    formList: [],
  },
  mutations: {
    setEditFields(state, value) {
      state.editFields = value;
    },
    setEditFieldsItems(state, value) {
      state.editFieldsItems = value;
    },
    setCurrentInvoiceErrorFields(state, value) {
      state.currentInvoiceErrorFields = value;
    },
    setRobotList(state, value) {
      state.robotList = value;
    },
    setFormList(state, value) {
      state.formList = value;
    },
  },
  actions: {
    getRobotList({ state, commit }) {
      if (state.robotList.length > 0) {
        return false;
      }
      getRobots().then((resp) => {
        let data = resp.data;
        if (data.code === 0) {
          // _this.robotOption = data.data;
          commit('setRobotList', data.data)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    getFormList({ state, commit }) {
      if (state.formList.length > 0) {
        return false;
      }
      getForms().then((resp) => {
        let data = resp.data;
        if (data.code === 20000) {
          commit('setFormList', data.data.data)
        }
      }).catch(err => {
        console.log(err);
      })
    },
  }
}
