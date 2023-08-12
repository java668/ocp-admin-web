<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :title-align="'start'"
    :mask-closable="false"
    :width="640"
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
      <a-row wrap>
        <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12">
          <a-form-item label="账号" field="username">
            <a-input v-model="form.username" placeholder="请输入账号"></a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12">
          <a-form-item label="用户名" field="nickname">
            <a-input
              v-model="form.nickname"
              placeholder="请输入用户名"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12">
          <a-form-item label="手机号码" field="mobile">
            <a-input
              v-model="form.mobile"
              placeholder="请输入手机号码"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="24" :lg="12" :xl="12" :xxl="12">
          <a-form-item label="性别" field="sex">
            <a-radio-group v-model="form.sex">
              <a-radio :value="0">男</a-radio>
              <a-radio :value="1">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="24" :lg="24" :xl="24" :xxl="24">
          <a-form-item label="所属角色" field="roleIds">
            <a-select
              v-model="form.roleId"
              :options="roleOptions"
              :field-names="{ value: 'id', label: 'name' }"
              placeholder="请选择所属角色"
              :loading="roleLoading"
              multiple
              allow-clear
              :allow-search="{ retainInputValue: true }"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, toRefs, getCurrentInstance } from 'vue';
  import { UserRecord } from '@/types/system/User';
  import { RoleRecord } from '@/types/system/Role';
  import useLoading from '@/hooks/loading';
  import { addUser, updateUser } from '@/api/system/user';
  import { listRole } from '@/api/system/role';

  const { proxy } = getCurrentInstance() as any;

  const data = reactive({
    // 表单数据
    form: {
      id: undefined,
      username: undefined,
      nickname: undefined,
      mobile: undefined,
      roleId: undefined,
    } as UserRecord,
    // 表单验证规则
    rules: {
      username: [
        { required: true, message: '请输入用户名' },
        { min: 2, max: 4, message: '长度在 2 - 4个字符' },
      ],
      nickname: [
        { required: true, message: '请输入用户名' },
        { min: 2, max: 4, message: '长度在 2 - 4个字符' },
      ],
      mobile: [{ required: true, message: '请输入手机号码' }],
      roleId: [{ required: true, message: '请选择所属角色' }],
    },
  });
  const { form, rules } = toRefs(data);
  const visible = ref(false);
  const roleOptions = ref<RoleRecord[]>([]);
  const { loading: roleLoading, setLoading } = useLoading(false);

  const title = computed(() => (form.value.id ? '编辑用户' : '新增用户'));

  const getRoleOptions = () => {
    setLoading(true);
    listRole()
      .then((res) => {
        roleOptions.value = res.datas;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const add = () => {
    getRoleOptions();
    form.value = {
      id: undefined,
      username: undefined,
      nickname: undefined,
      mobile: undefined,
      roleId: undefined,
    };

    visible.value = true;
  };
  const edit = (item: UserRecord) => {
    getRoleOptions();
    form.value = item;
    visible.value = true;
  };

  const handleCancel = ($parent: any) => {
    visible.value = false;
    proxy.$refs.formRef?.resetFields();
    $parent.getList();
  };

  const handleOk = ($parent: any) => {
    proxy.$refs.formRef.validate((valid: any) => {
      if (!valid) {
        if (form.value.id) {
          updateUser(form.value).then((res) => {
            handleCancel($parent);
            proxy.$message.success(res.msg);
          });
        } else {
          addUser(form.value).then((res) => {
            handleCancel($parent);
            proxy.$message.success(res.msg);
          });
        }
        $parent.getList();
      }
    });
  };

  defineExpose({ add, edit });
</script>
