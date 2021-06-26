export default {
  state: {
    editFields: [],
    editFieldsItems: [],
    currentInvoiceErrorFields: [],
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
  }
}
