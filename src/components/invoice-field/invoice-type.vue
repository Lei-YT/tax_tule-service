<template>
  <FormItem :label="fieldName">
    <Input
      v-model="vo.invoiceType"
      :readonly="isReadonly"
      icon="ios-alert-outline"
      @on-change="handleCorrectField('invoiceType', fieldName)"
      v-bind:style="inputCommonStyle"
      v-bind:class="{ 'text-highlight': editFields.includes('invoiceType') }"
      @click.native="getFieldError(vo, 'invoiceType', vo.invoiceType)"
      v-if="currentInvoiceErrorFields.includes('invoiceType')"
    ></Input>
    <Input
      v-else
      v-model="vo.invoiceType"
      :readonly="isReadonly"
      @on-change="handleCorrectField('invoiceType', fieldName)"
      v-bind:style="inputCommonStyle"
      v-bind:class="{ 'text-highlight': editFields.includes('invoiceType') }"
    ></Input>
  </FormItem>
</template>

<script>
export default {
  props: {
    fieldName: {
      type: String,
      default: '发票类型'
    },
    fieldKeyValue: {
      type: String,
      default: ''
    },
    isReadonly: {
      type: Boolean,
      default: true
    },
    handleCorrectField: {
      type: Object,
      default: function () {}
    }
  },
  data(){
    return {
      inputCommonStyle: {
        // backgroundColor: '#FFFA99',
        width: '100%',
      },
    }
  }
};
</script>

<style>
</style>
