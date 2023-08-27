<template>
  <a-modal
    :title="title"
    :title-align="'start'"
    :visible="visible"
    :mask-closable="false"
    unmount-on-close
    render-to-body
    @ok="handleOk($parent)"
    @cancel="handleCancel($parent)"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-trigger="['change', 'input']"
      size="medium"
      auto-label-width
    >
      <a-form-item label="角色名称" name="name" field="name">
        <a-input v-model="form.name" placeholder="请输入角色名称"> </a-input>
      </a-form-item>
      <a-form-item label="角色编号" name="code" field="code">
        <a-input v-model="form.code" placeholder="请输入角色编号">
          <template #prepend>role_</template>
        </a-input>
      </a-form-item>
      <a-form-item label="描述" name="remarks" field="remarks">
        <a-textarea
          v-model="form.remarks"
          placeholder="角色描述"
          :auto-size="{ minRows: 3, maxRows: 5 }"
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
  import { Form } from '@arco-design/web-vue';

  const { proxy } = getCurrentInstance() as any;

  const roleId = ref('');
  const tenantId = ref('');
  const title = computed(() => (roleId.value ? '编辑角色' : '新增角色'));
  const visible = ref(false);
  const formRef = ref<InstanceType<typeof Form>>();

  const getInitForm = (): RoleRecord => ({
    id: undefined,
    name: undefined,
    code: undefined,
    remarks: undefined,
  });

  const data = reactive({
    // 表单数据
    form: getInitForm(),
    // 表单验证规则
    rules: {
      name: [
        { required: true, message: '请输入角色名' },
        {
          minLength: 2,
          maxLength: 12,
          message: '角色名必须长度在 2 - 12个字符',
        },
        { match: OnlyCh, message: '角色名称必须输入中文' },
      ],
      code: [
        { required: true, message: '请输入角色编码' },
        { min: 2, max: 12, message: '长度在 2 - 12 个字符' },
        { match: OnlyEn, message: '角色编码必须输入英文字母' },
      ],
    },
  });
  const { form, rules } = toRefs(data);

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
      debugger;
      if (!valid) {
        if (form.value.id) {
          updateRole(tenantId.value, form.value)
            .then((res) => {
              handleCancel($parent);
              proxy.$message.success(res.msg);
            })
            .catch((err) => {
              proxy.$message.success(err);
              return false;
            });
        } else {
          addRole(tenantId.value, form.value)
            .then((res) => {
              handleCancel($parent);
              proxy.$message.success(res.msg);
            })
            .catch((err) => {
              proxy.$message.success(err);
              return false;
            });
        }
        $parent.getList();
      }
    });
  };
  defineExpose({ add, edit });
</script>
