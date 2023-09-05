<template>
  <!-- 表单区域 -->
  <a-modal
    :title="title"
    :visible="visible"
    :width="625"
    :mask-closable="false"
    :esc-to-close="false"
    unmount-on-close
    render-to-body
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      layout="inline"
      :label-col-style="{ width: '85px' }"
      size="large"
    >
      <a-form-item label="菜单类型" field="type" lab>
        <a-radio-group v-model="form.type" type="button">
          <a-radio :value="1" style="width: 57px">目录</a-radio>
          <a-radio :value="2" style="width: 57px">菜单</a-radio>
          <a-radio :value="3" style="width: 57px">按钮</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="form.type !== 3" label="菜单图标" field="icon">
        <a-popover
          v-model:popup-visible="showChooseIcon"
          position="bottom"
          trigger="click"
        >
          <a-input
            v-model="form.icon"
            placeholder="点击选择菜单图标"
            readonly
            allow-clear
            style="width: 473px"
          >
            <template #prefix>
              <svg-icon
                v-if="form.icon"
                :icon-class="form.icon"
                style="height: 32px; width: 16px"
              />
              <icon-search v-else />
            </template>
          </a-input>
          <template #content>
            <icon-select ref="iconSelectRef" @selected="selected" />
          </template>
        </a-popover>
      </a-form-item>
      <a-form-item label="菜单标题" field="title">
        <a-input
          v-model="form.title"
          placeholder="请输入菜单标题"
          style="width: 182px"
        />
      </a-form-item>
      <a-form-item label="菜单排序" field="sort">
        <a-input-number
          v-model="form.sort"
          placeholder="请输入菜单排序"
          :min="1"
          mode="button"
          style="width: 182px"
        />
      </a-form-item>
      <a-form-item v-if="form.type !== 1" label="权限标识" field="permission">
        <a-input
          v-model="form.permission"
          placeholder="请输入权限标识"
          style="width: 182px"
        />
      </a-form-item>
      <a-form-item v-if="form.type !== 3" label="路由地址" field="path">
        <a-input
          v-model="form.path"
          placeholder="请输入路由地址"
          style="width: 473px"
        />
      </a-form-item>
      <a-form-item
        v-if="!form.isExternal && form.type === 2"
        label="组件名称"
        field="name"
      >
        <a-input
          v-model="form.name"
          placeholder="请输入组件名称"
          style="width: 182px"
        />
      </a-form-item>
      <a-form-item
        v-if="!form.isExternal && form.type === 2"
        label="组件路径"
        field="component"
      >
        <a-input
          v-model="form.component"
          placeholder="请输入组件路径"
          style="width: 182px"
        />
      </a-form-item>
      <br />
      <a-form-item v-if="form.type !== 3" label="是否外链" field="isExternal">
        <a-radio-group v-model="form.isExternal" type="button">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="form.type === 2" label="是否缓存" field="isCache">
        <a-radio-group v-model="form.isCache" type="button">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="form.type !== 3" label="是否隐藏" field="isHidden">
        <a-radio-group v-model="form.isHidden" type="button">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="上级菜单" field="parentId">
        <a-tree-select
          v-model="form.parentId"
          :data="treeData"
          placeholder="请选择上级菜单"
          allow-clear
          allow-search
          :filter-tree-node="filterMenuTree"
          :fallback-option="false"
          style="width: 473px"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, getCurrentInstance, reactive, ref, toRefs } from 'vue';
  import { addRole, updateRole, getRole } from '@/api/system/role';
  import { OnlyCh, OnlyEn } from '@/utils/regexp';
  import { RoleRecord } from '@/types/system/Role';
  import { Form, TreeNodeData } from '@arco-design/web-vue';

  const { proxy } = getCurrentInstance() as any;

  const roleId = ref('');
  const tenantId = ref('');
  const title = computed(() => (roleId.value ? '编辑角色' : '新增角色'));
  const visible = ref(false);
  const showChooseIcon = ref(false);
  const formRef = ref<InstanceType<typeof Form>>();
  const treeData = ref<TreeNodeData[]>();

  const getInitForm = (): RoleRecord => ({
    id: undefined,
    name: undefined,
    code: undefined,
    remarks: undefined,
  });

  const data = reactive({
    // 查询参数
    queryParams: {
      title: undefined,
      status: undefined,
      sort: ['parentId,asc', 'sort,asc', 'createTime,desc'],
    },
    // 表单数据
    form: {},
    // 表单验证规则
    rules: {
      title: [{ required: true, message: '请输入菜单标题' }],
      path: [{ required: true, message: '请输入路由地址' }],
      name: [{ required: true, message: '请输入组件名称' }],
      component: [{ required: true, message: '请输入组件路径' }],
      permission: [{ required: true, message: '请输入权限标识' }],
      sort: [{ required: true, message: '请输入菜单排序' }],
    },
  });
  const { queryParams, form, rules } = toRefs(data);

  const add = (clientId: string) => {
    roleId.value = '';
    tenantId.value = clientId;
    visible.value = true;
  };

  const edit = async (id: string, clientId: string) => {
    roleId.value = id;
    tenantId.value = clientId;
    try {
      const res = await getRole(id);
      form.value = res.data;
    } catch (err) {
      // error
    }
    visible.value = true;
  };

  const handleCancel = ($parent: any) => {
    form.value = getInitForm();
    visible.value = false;
    $parent.getList();
  };

  const handleOk = ($parent: any) => {
    formRef.value?.validate((valid: any) => {
      if (!valid) {
        // if (form.value.id) {
        //   updateRole(tenantId.value, form.value)
        //     .then((res) => {
        //       handleCancel($parent);
        //       proxy.$message.success(res.msg);
        //     })
        //     .catch((err) => {
        //       proxy.$message.success(err);
        //       return false;
        //     });
        // } else {
        //   addRole(tenantId.value, form.value)
        //     .then((res) => {
        //       handleCancel($parent);
        //       proxy.$message.success(res.msg);
        //     })
        //     .catch((err) => {
        //       proxy.$message.success(err);
        //       return false;
        //     });
        // }
        // $parent.getList();
      }
    });
  };
  /**
   * 选择图标
   *
   * @param name 图标名称
   */
  const selected = (name: string) => {
    // form.value.icon = name;
    // showChooseIcon.value = false;
  };

  /**
   * 过滤菜单树
   *
   * @param searchValue 搜索值
   * @param nodeData 节点值
   */
  const filterMenuTree = (searchValue: string, nodeData: TreeNodeData) => {
    if (nodeData.title) {
      return (
        nodeData.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      );
    }
    return false;
  };
  defineExpose({ add, edit });
</script>
