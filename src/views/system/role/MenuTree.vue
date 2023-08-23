<template>
  <a-card title="资源分配" body-style="height=100%">
    <template #extra>
      <a-button type="primary">
        <template #icon>
          <icon-plus-circle />
        </template>
        <!-- Use the default slot to avoid extra spaces -->
        <template #default>保存</template>
      </a-button>
    </template>
    <a-scrollbar
      style="height: 100%; overflow: auto"
      outer-style="height: 100%"
    >
      <a-tree
        block-node
        :show-line="true"
        :check-strictly="false"
        :checkable="true"
        :field-names="{
          key: 'id',
          title: 'name',
          children: 'children',
        }"
        :data="treeData"
      />
    </a-scrollbar>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import listMenu from '@/api/system/menu';
  import handleTree from '@/utils/menu';

  const treeData = ref([]);

  const getList = async () => {
    const res = await listMenu();
    treeData.value = handleTree(res.data, 'id', 'pId');
    console.log(treeData.value);
  };

  getList();
</script>

<style scoped></style>
