<template>
  <FormItem :label="fieldName">
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
  </FormItem>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  props: {
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style>
</style>
