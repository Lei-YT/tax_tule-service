<template>
  <FormItem :label="fieldName" :label-width="labelWidth">
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
      placeholder="请选择或输入搜索"
      @on-change="handlePickInvoiceType"
      :data="invoiceTypeData"
      v-model="selectedInvoiceType"
      transfer
      filterable
      change-on-select
      :clearable="false"
      :render-format="invoiceTypeFormatter"
    ></Cascader>
      <!-- trigger="hover" -->
    <!-- <el-cascader
      v-else
      placeholder="请选择"
      @change="handlePickInvoiceType"
      v-model="selectedInvoiceType"
      transfer
      :clearable="true"
      :filterable="true"
      :show-all-levels="false"
      :options="invoiceTypeData"
      :props="{ expandTrigger: 'hover' }"
    ></el-cascader> -->
  </FormItem>
</template>

<script>
import invoiceTypeData from "@/libs/invoiceType";
import mixin from "./mixin";
const findIndexArray = (data, id, indexArray) => {
  let arr = Array.from(indexArray);
  for (let i = 0, len = data.length; i < len; i++) {
    arr.push(data[i].value);
    if (data[i].value === id) {
      return arr;
    }
    let children = data[i].children;
    if (children && children.length) {
      let result = findIndexArray(children, id, arr);
      if (result) return result;
    }
    arr.pop();
  }
  return false;
};

export default {
  mixins: [mixin],
  props: {},
  computed: {
  },
  data() {
    return {
      invoiceTypeData: invoiceTypeData,
      selectedInvoiceType: findIndexArray(
        invoiceTypeData,
        this.defaultKeyValue,
        []
      ) || [],
    };
  },
  methods: {
    invoiceTypeFormatter(label) {
      return label.slice(-1)[0];
    },
    handlePickInvoiceType(value, selectedData) {
      console.log("handlePickInvoiceType", value, selectedData);
      this.selectedInvoiceType = value;
      const invoiceTypeValue = value.slice(-1)[0];
      this.fieldKeyValue = invoiceTypeValue;
      this.$emit("on-select-type", invoiceTypeValue);
    },
  },
};
</script>

<style>
</style>
