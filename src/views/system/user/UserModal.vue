<template>
  <a-modal
    :title="title"
    :title-align="'start'"
    :visible="visible"
    :mask-closable="false"
    unmount-on-close
    render-to-body
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
          <a-form-item label="所属角色" field="roleId">
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
  import { getUser, addUser, updateUser } from '@/api/system/user';
  import { listRole } from '@/api/system/role';
  import { Phone, UsernameRegex } from '@/utils/regexp';

  const { proxy } = getCurrentInstance() as any;

  /**
   * 初始化表单
   */
  const getInitForm = () => ({
    id: undefined,
    username: undefined,
    nickname: undefined,
    mobile: undefined,
    sex: 0,
    roleId: undefined,
  });

  const data = reactive({
    // 表单数据
    form: getInitForm() as UserRecord,
    // 表单验证规则
    rules: {
      username: [
        { required: true, message: '请输入账号' },
        {
          minLength: 2,
          maxLength: 12,
          message: '账号必须长度在 2 - 12个字符',
        },
        { match: UsernameRegex, message: '账号必须由字母、数字或下划线组成' },
      ],
      nickname: [
        { required: true, message: '请输入用户名' },
        { min: 2, max: 4, message: '长度在 2 - 4个字符' },
      ],
      mobile: [
        { required: true, message: '请输入手机号码' },
        { match: Phone, message: '手机号格式不正确' },
      ],
      roleId: [{ required: true, message: '请选择所属角色' }],
    },
  });
  const { form, rules } = toRefs(data);
  const visible = ref(false);
  const roleOptions = ref<RoleRecord[]>([]);
  const { loading: roleLoading, setLoading } = useLoading(false);

  const title = computed(() => (form.value.id ? '编辑用户' : '新增用户'));

  const getRoleOptions = async () => {
    setLoading(true);
    try {
      const res = await listRole();
      roleOptions.value = res.data;
    } finally {
      setLoading(false);
    }
  };
  const getUserData = async (userId: string) => {
    const res = await getUser(userId);
    Object.assign(form.value, res.data);
    form.value.roleId = res.data.roles?.map((role) => {
      return role.id;
    });
  };

  const add = () => {
    getRoleOptions();
    visible.value = true;
  };

  const edit = async (userId: string) => {
    await Promise.all([getRoleOptions(), getUserData(userId)]);
    visible.value = true;
  };

  const handleCancel = ($parent: any) => {
    form.value = getInitForm();
    visible.value = false;
    $parent.getList();
  };

  const handleOk = ($parent: any) => {
    proxy.$refs.formRef.validate((valid: any) => {
      if (!valid) {
        form.value.roleId = form.value.roleId.toString();
        if (form.value.id) {
          updateUser(form.value)
            .then((res) => {
              handleCancel($parent);
              proxy.$message.success(res.msg);
            })
            .catch((err) => {
              proxy.$message.success(err);
              return false;
            });
        } else {
          addUser(form.value)
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
