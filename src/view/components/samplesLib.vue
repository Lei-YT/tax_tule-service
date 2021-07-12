<template>
  <div class="wraps">
    <div class="searchWarp">
      <Input placeholder="请输入关键字查询" style="width: 200px;" />
      <Button type="primary" icon="ios-search" style="margin-left: 15px"
        >查询</Button
      >
    </div>
    <Table border stripe
      ref="samplesLib"
      :columns="column"
      no-data-text="暂无数据"
    />
  </div>
</template>

<script>
export default {
  data(){
    return {
      column: [
        { title: '序号', type: 'index' },
        { title: '影像类型', key: 'invoiceType', align: 'center' },
        { title: '影像总数量', key: 'invoiceNum', align: 'center' },
        { title: '已复核数量', key: 'checkedNum', align: 'center' },
        { title: '未复核数量', key: 'pendingNum', align: 'center' },
        { title: '操作', slot: 'action', align: 'left' },
      ],
    }
  },
};
</script>

<style lang="less" scoped>
.searchWarp {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
}
</style>
