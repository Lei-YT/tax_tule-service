<template>
  <table style="width: 100%; text-align: center" class="rule-table td-nowrap">
    <thead>
      <tr style="text-align: center">
        <th width="60" v-if="showIndex">序号</th>
        <template v-for="fieldL in itemFields">
          <th :width="fieldL.width" :key="fieldL.key">
            <Tooltip
              :content="fieldL.label"
              :max-width="200"
              transfer
              >
              {{fieldL.label}}
              <Icon
                type="ios-alert-outline"
                class="icon-danger"
                @click.native="onItemIconClick(fieldL.key)"
                v-if="$store.state.invoice.currentInvoiceErrorFields.includes(fieldL.key)"
              />
            </Tooltip>
          </th>
        </template>
        <!-- <th width="180">
          <Tooltip
            placement="top-start"
            content="货物或应税劳务、服务名称"
            :max-width="200"
            transfer
            >货物或应税劳务、服务名称
            <Icon
              type="ios-alert-outline"
              class="icon-danger"
              @click.native="getFieldError(vo, 'itemName', '')"
              v-if="currentInvoiceErrorFields.includes('itemName')"
            />
          </Tooltip>
        </th>
        <th width="60">
          单位
          <Icon
            type="ios-alert-outline"
            class="icon-danger"
            @click.native="getFieldError(vo, 'itemUnit', '')"
            v-if="currentInvoiceErrorFields.includes('itemUnit')"
          />
        </th>
        <th width="60">
          数量
          <Icon
            type="ios-alert-outline"
            class="icon-danger"
            @click.native="getFieldError(vo, 'itemQuantity', '')"
            v-if="currentInvoiceErrorFields.includes('itemQuantity')"
          />
        </th>
        <th width="60">
          单价
          <Icon
            type="ios-alert-outline"
            class="icon-danger"
            @click.native="getFieldError(vo, 'itemUnitPrice', '')"
            v-if="currentInvoiceErrorFields.includes('itemUnitPrice')"
          />
        </th>
        <th width="120">
          <Tooltip
            placement="top-start"
            content="金额"
            :max-width="200"
            transfer
            >金额
            <Icon
              type="ios-alert-outline"
              class="icon-danger"
              @click.native="getFieldError(vo, 'itemAmount', '')"
              v-if="currentInvoiceErrorFields.includes('itemAmount')"
            />
          </Tooltip>
        </th>
        <th width="60">
          <Tooltip
            placement="top-start"
            content="税率"
            :max-width="200"
            transfer
            >税率
            <Icon
              type="ios-alert-outline"
              class="icon-danger"
              @click.native="getFieldError(vo, 'itemTaxRate', '')"
              v-if="currentInvoiceErrorFields.includes('itemTaxRate')"
            />
          </Tooltip>
        </th>
        <th width="60">
          税额
          <Icon
            type="ios-alert-outline"
            class="icon-danger"
            @click.native="getFieldError(vo, 'itemTaxAmount', '')"
            v-if="currentInvoiceErrorFields.includes('itemTaxAmount')"
          />
        </th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(n, i) in itemData" v-bind:key="'itemtr' + i">
        <td style="text-align: center" v-if="showIndex">{{ i + 1 }}</td>
        <td v-for="fieldL in itemFields" :key="fieldL.key + 'val' + i"
          v-bind:class="{
            'text-highlight':
              $store.state.invoice.editFieldsItems[i + 1] && isRaw===false &&
              $store.state.invoice.editFieldsItems[i + 1].includes(fieldL.key),
          }"
        >
          <Tooltip
            :content="n[fieldL.key]"
            :max-width="200"
            transfer
          >
            <template v-if="isReadonly">
              {{ n[fieldL.key] }}
            </template>
            <template v-else>
              <Input
                v-model="n[fieldL.key]"
                v-bind:style="inputCommonStyle"
                @on-change="
                  handleCorrectItemField(
                    i,
                    fieldL.key,
                    fieldL.label,
                    fieldKey
                  )
                "
              ></Input>
            </template>
          </Tooltip>
        </td>
      </tr>
      <template v-if="showSummary">
      <tr>
        <td style="font-weight: 700">合计</td>
        <td colspan="4"></td>
        <td>
          <template v-if="isReadonly">
            {{ invoiceData.amountWithoutTax }}
          </template>
          <template v-else>
            <Input
              v-model="invoiceData.amountWithoutTax"
              @on-change="onInvoiceInputEdit('amountWithoutTax', '合计')"
            ></Input>
          </template>
        </td>
        <td>
          <template>
            {{ invoiceData.taxRate }}
          </template>
        </td>
        <td>
          <template v-if="isReadonly">
            {{ invoiceData.taxAmount }}
          </template>
          <template v-else>
            <Input
              v-model="invoiceData.taxAmount"
              @on-change="onInvoiceInputEdit('taxAmount', '税额')"
            ></Input>
          </template>
        </td>
      </tr>
      <tr>
        <td style="font-weight: 700">价税合计</td>
        <td>
          <template v-if="isReadonly">
            {{ invoiceData.amountWithTax }}
          </template>
          <template v-else>
            <Input
              v-model="invoiceData.amountWithTax"
              @on-change="onInvoiceInputEdit('amountWithTax', '价税合计')"
            ></Input>
          </template>
        </td>
        <td colspan="6"></td>
      </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  props: {
    itemData: {
      type: Array,
    },
    itemFields: {
      type: Array,
    },
    showSummary: {
      type: Boolean,
      default: true,
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    highlightsItemEdit() {
      return this.$store.state.invoice.editFields.includes(this.fieldKey);
    },
  },
  methods: {
    onItemIconClick(itemKey){
      this.$emit('on-icon-click', this.invoiceData, itemKey, '');
    },
    handleCorrectItemField(i, field, fieldName, p){
      this.$emit('on-item-change', i, field, fieldName, p);
    },
    onInvoiceInputEdit(key, name){
      this.$emit('on-input-change', key, name);
    },
  },
};
</script>

<style lang="less" scoped>
.rule-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eeeeee;
  &.td-nowrap{
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  thead {
    background-color: #eeeeee;
  }
  tr {
    border: 1px solid #eeeeee;
  }
  td {
    max-width: 130px;
    padding: 10px 0;
    text-align: center;
  }
  th {
    max-width: 130px;
    padding: 10px 0;
    text-align: center;
  }
  .ivu-tooltip{
    width: 100%;
    text-align: center;
    display: inline-block;
    vertical-align: text-top;
  }
  .ivu-tooltip-rel{
    // max-width: 130px;
    width: 100%;
    text-align: center;
  }
}
/deep/.ivu-form-item {
  margin-bottom: 0.5rem;
}
/deep/.ivu-form-label-left .ivu-form-item-label {
  text-align: justify;
}
/deep/.ivu-form-label-left .ivu-form-item-label::after {
  content: "";
  display: inline-block;
  padding-left: 100%;
}
/deep/.ivu-tooltip,
/deep/.ivu-tooltip-rel {
  display: inherit;
}
/deep/.text-highlight,
/deep/.text-highlight .ivu-input{
  background-color: #FFFA99;
}
/deep/.hover-primary:hover{
  cursor: pointer;
  background-color: #ecf5ff;
  // #b3d8ff
}
/deep/.ivu-input-icon, /deep/.icon-danger{
  color: #FE3D3D;
  font-weight: 700;
  cursor: pointer;
  font-size: 18px;
  vertical-align: text-bottom;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover>td.text-highlight{
  background-color: #FFFA99;
}
/deep/.rule-table .ivu-tooltip-rel{
  max-width: 130px;
  text-overflow: ellipsis;
  overflow: hidden;
}

</style>
