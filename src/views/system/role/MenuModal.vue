<template>
  <a-modal
    title="资源分配"
    :title-align="'start'"
    :visible="visible"
    :mask-closable="false"
    unmount-on-close
    render-to-body
    body-class="dialog-body"
    @ok="handleOk($parent)"
    @cancel="handleCancel($parent)"
  >
    <a-tree
      block-node
      checkable
      :show-line="true"
      :check-strictly="false"
      :default-expand-all="true"
      :checked-keys="checkedKeys"
      :data="treeData"
      :field-names="{
        key: 'id',
        title: 'name',
        children: 'children',
      }"
    />
  </a-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import listMenu from '@/api/system/menu';
  import handleTree from '@/utils/tree';

  const visible = ref(false);
  const treeData = ref<any[]>([]);
  const checkedKeys = ref<string[]>([]);

  const getList = async (id: string, appId: string) => {
    const res = await listMenu(id, appId);
    const { data } = res;
    treeData.value = handleTree(data, 'id', 'pId');
    checkedKeys.value = data
      .filter((item) => {
        return item.checked;
      })
      .map((item) => {
        return item.id;
      });
    visible.value = true;
  };

  const add = (id: string, clientId: string) => {
    getList(id, clientId);
  };

  const handleCancel = ($parent: any) => {
    visible.value = false;
    $parent.getList();
  };

  const handleOk = ($parent: any) => {
    visible.value = false;
    $parent.getList();
  };
  defineExpose({ add });
</script>

<style lang="less">
  .dialog-body {
    max-height: calc(90vh - 80px) !important;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
