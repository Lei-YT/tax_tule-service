export default {
  state: {
    editFields: [],
    currentInvoiceErrorFields: [],
  },
  mutations: {
    setEditFields(state, value) {
      state.editFields = value;
    },
    setCurrentInvoiceErrorFields(state, value) {
      state.currentInvoiceErrorFields = value;
    },
  }
}
