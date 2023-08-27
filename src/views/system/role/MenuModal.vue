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
      ref="menuRef"
      block-node
      checkable
      :show-line="true"
      :check-strictly="false"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
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
  import { ref, getCurrentInstance } from 'vue';
  import listMenu from '@/api/system/menu';
  import { granted } from '@/api/system/role';
  import handleTree from '@/utils/tree';
  import { RoleGranted } from '@/types/system/Role';

  const { proxy } = getCurrentInstance() as any;
  const visible = ref(false);
  const treeData = ref<any[]>([]);
  const checkedKeys = ref<string[]>([]);
  const tenantId = ref<string>('');
  const roleId = ref<string>('');

  const add = async (id: string, clientId: string) => {
    roleId.value = id;
    tenantId.value = clientId;
    const res = await listMenu(id, clientId);
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

  const handleCancel = ($parent: any) => {
    visible.value = false;
    $parent.getList();
  };

  /**
   * 获取所有选中的菜单
   */
  const getMenuAllCheckedKeys = (): string[] => {
    // 获取目前被选中的菜单
    const checkedNodes = proxy.$refs.menuRef.getCheckedNodes();
    const currentCheckedKeys = checkedNodes.map((item: any) => item.id);

    // 获取半选中的菜单
    const halfCheckedNodes = proxy.$refs.menuRef.getHalfCheckedNodes();
    const halfCheckedKeys = halfCheckedNodes.map((item: any) => item.id);
    return [...currentCheckedKeys, ...halfCheckedKeys];
  };

  const handleOk = async ($parent: any) => {
    const menuIds = getMenuAllCheckedKeys();
    const data = { menuIds, roleId: roleId.value } as RoleGranted;
    try {
      const res = await granted(data, tenantId.value);
      proxy.$message.success(res.msg);
      visible.value = false;
      $parent.getList();
    } catch (err) {
      proxy.$message.error(err);
      return false;
    }
    return true;
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
