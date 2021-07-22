export default {
  props: {
    fieldKey: {
      type: String,
      default: "",
    },
    fieldName: {
      type: String,
      default: "",
    },
    defaultKeyValue: {
      type: [String, Object, Array, Number],
      default: "",
    },
    labelWidth: {
      type: Number,
      default: 70,
    },
    invoiceData: {
      type: Object,
    },
    isReadonly: {
      type: Boolean,
      default: true,
    },
    isRaw: {
      type: Boolean,
      default: true,
    },
  },
  computed:{
    isErrorField(){
      return this.$store.state.invoice.currentInvoiceErrorFields.includes(this.fieldKey);
    },
    highlightsEdit(){
      return this.$store.state.invoice.editFields.includes(this.fieldKey) && this.isRaw===false;
    },
  },
  data(){
    return {
      fieldKeyValue: this.defaultKeyValue ,
      inputCommonStyle: {
        // backgroundColor: '#FFFA99',
        width: "100%",
      },
    }
  },
  methods: {
    onInputEdit(){
      this.invoiceData[this.fieldKey] = this.fieldKeyValue;
      this.$emit('on-input-change', this.fieldKey, this.fieldName, this.invoiceData);
    },
    onIconClick(){
      this.$emit('on-icon-click', this.invoiceData, this.fieldKey, this.fieldKeyValue);
    },
  },
}
