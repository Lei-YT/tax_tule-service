<template>
  <FormItem :label="fieldName">
    <template v-if="isReadonly">
      <Input
        v-model="fieldKeyValue"
        :readonly="isReadonly"
        icon="ios-alert-outline"
        v-bind:class="{ 'text-highlight': highlightsEdit }"
        v-bind:style="inputCommonStyle"
        @on-click="onIconClick"
        @on-change="onInputEdit"
        v-if="isErrorField"
      ></Input>
      <Input
        v-else
        v-model="fieldKeyValue"
        :readonly="isReadonly"
        @on-change="onInputEdit"
        v-bind:class="{ 'text-highlight': highlightsEdit }"
      ></Input>
    </template>
    <Cascader
      v-else
      @on-change="handlePickInvoiceType"
      :data="invoiceTypeData"
      v-model="selectedInvoiceType"
      transfer
      trigger="hover"
      filterable
      :render-format="invoiceTypeFormatter"
    ></Cascader>
  </FormItem>
</template>

<script>
import invoiceTypeData from "@/libs/invoiceType";
import mixin from "./mixin";
export default {
  mixins: [mixin],
  props: {},
  data() {
    return {
      invoiceTypeData: invoiceTypeData,
      selectedInvoiceType: [],
    };
  },
  methods: {
    invoiceTypeFormatter(label) {
      return label.slice(-1)[0];
    },
    handlePickInvoiceType(value, selectedData) {
      console.log('handlePickInvoiceType', value, selectedData)
      this.selectedInvoiceType = value;
      const invoiceTypeValue = value.slice(-1)[0];
      this.$emit("on-select-type", invoiceTypeValue);
    },
  },
};
</script>

<style>
</style>
