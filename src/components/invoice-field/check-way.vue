<template>
  <FormItem :label="fieldName" :label-width="labelWidth">
    <Select
      transfer
      v-model="fieldKeyValue"
      :disabled="isReadonly"
      @on-change="onInputEdit"
      v-bind:class="{ 'text-highlight': highlightsEdit }"
    >
      <Option
        v-for="item in sourceOptions"
        :value="item.key"
        v-bind:key="item.key"
        >{{ item.label }}</Option
      ></Select
    >
  </FormItem>
</template>

<script>
import mixin from "./mixin";
const sourceMap = {
  0: "OCR识别",
  1: "OCR+航信",
  2: "机打号码+航信",
  3: "二维码",
  4: "OCR+中间库",
};
const sourceOptions = Object.keys(sourceMap).map((key) => ({
  key: key,
  label: sourceMap[key],
}));
export default {
  mixins: [mixin],
  props: {},
  data() {
    return {
      sourceOptions: sourceOptions,
    };
  },
  mounted() {
  },
  methods: {},
};
</script>

<style>
</style>
