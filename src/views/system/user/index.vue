<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <a-card>
      <a-form
        ref="queryRef"
        label-align="right"
        auto-label-width
        :model="queryParams"
        class="form"
      >
        <a-row :gutter="16" wrap>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="username" label="账号">
              <a-input
                v-model="queryParams.username"
                placeholder="请输入账号"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="nickname" label="用户名">
              <a-input
                v-model="queryParams.nickname"
                placeholder="请输入用户名"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="mobile" label="手机号码">
              <a-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号码"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-space>
              <a-button type="primary" status="success" @click="handleQuery">
                <template #icon>
                  <icon-search />
                </template>
                <template #default>查询</template>
              </a-button>
              <a-button type="primary" status="warning" @click="resetQuery">
                <template #icon>
                  <icon-refresh />
                </template>
                <template #default>重置</template>
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
      <a-divider style="margin-top: 0; margin-bottom: 10px" />
      <a-row class="toolbar">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="onAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增
            </a-button>
            <a-button
              type="primary"
              status="success"
              :disabled="single"
              @click="onEdit"
            >
              <template #icon>
                <icon-edit />
              </template>
              修改
            </a-button>
            <a-button
              type="primary"
              status="danger"
              :disabled="multiple"
              @click="$message.warning('功能尚在开发中')"
            >
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button-group>
            <a-button @click="handleQuery">
              <template #icon><icon-refresh size="18" /></template>
            </a-button>
            <a-button @click="$message.warning('功能尚在开发中')">
              <template #icon><icon-import size="18" /></template>
            </a-button>
            <a-button @click="$message.warning('功能尚在开发中')">
              <template #icon><icon-download size="18" /></template>
            </a-button>
            <a-button @click="$message.warning('功能尚在开发中')">
              <template #icon><icon-line-height size="18" /></template>
            </a-button>
            <a-button @click="$message.warning('功能尚在开发中')">
              <template #icon><icon-settings size="18" /></template>
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
      <a-table
        ref="tableRef"
        :data="userList"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: false,
        }"
        :pagination="{
          showTotal: true,
          showPageSize: true,
          total: total,
          current: queryParams.page,
        }"
        row-key="id"
        :bordered="false"
        :stripe="true"
        :loading="loading"
        size="large"
        :scroll="{ y: '100%' }"
        :columns="columns"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #avatar="{ record }">
          <a-avatar :size="30" :style="{ backgroundColor: record.color }">{{
            record.username[0]
          }}</a-avatar>
        </template>
        <template #sex="{ record }">
          <a-tag v-if="record.sex === 0" color="arcoblue">男</a-tag>
          <a-tag v-else color="red">女</a-tag>
        </template>
        <template #enabled="{ record }">
          <a-tag v-if="record.enabled" color="arcoblue">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button status="success" size="mini" @click="onEdit(record)"
              >修改</a-button
            >
            <a-popconfirm
              content="确定要删除当前选中的数据吗？"
              type="warning"
              position="tr"
              @ok="handleDelete(record.id)"
            >
              <a-button status="danger" size="mini" title="删除">
                <template #icon><icon-delete /></template>
                <template #default>删除</template>
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <UserModal ref="UserModalRef"></UserModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRefs, getCurrentInstance } from 'vue';
  import { UserRecord, UserParam } from '@/types/system/User';
  import { deleteUser, page } from '@/api/system/user';
  import useLoading from '@/hooks/loading';
  import { Modal } from '@arco-design/web-vue';
  import UserModal from './UserModal.vue';

  const { proxy } = getCurrentInstance() as any;
  const { loading, setLoading } = useLoading(false);

  /**
   * 列表
   */
  const userList = ref<UserRecord[]>([]);
  const total = ref(0);

  const single = ref(true);
  const multiple = ref(true);
  const ids = ref<string[]>([]);

  const UserModalRef = ref<InstanceType<typeof UserModal>>();

  const data = reactive({
    // 查询参数
    queryParams: {
      username: undefined,
      nickname: undefined,
      mobile: undefined,
      page: 1,
      limit: 10,
    },
  });
  const { queryParams } = toRefs(data);

  const columns = [
    {
      title: '用户编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '账号',
      dataIndex: 'username',
      width: 80,
    },
    {
      title: '头像',
      slotName: 'avatar',
      align: 'center',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'nickname',
      ellipsis: true,
      tooltip: true,
      width: 80,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      slotName: 'sex',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      slotName: 'enabled',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
    },
  ];

  /**
   * 查询列表
   *
   * @param params 查询参数
   */
  const getList = async (params: UserParam = { ...queryParams.value }) => {
    setLoading(true);
    const res = await page(params);
    try {
      userList.value = res.data;
      total.value = res.count;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 查询
   */
  getList();

  /**
   * 查询
   */
  const handleQuery = () => {
    getList();
  };

  /**
   * 重置
   */
  const resetQuery = () => {
    proxy.$refs.queryRef.resetFields();
    handleQuery();
  };

  /**
   * 切换页码
   *
   * @param current 页码
   */
  const handlePageChange = (current: number) => {
    queryParams.value.page = current;
    getList();
  };

  /**
   * 切换每页条数
   *
   * @param pageSize 每页条数
   */
  const handlePageSizeChange = (pageSize: number) => {
    queryParams.value.limit = pageSize;
    getList();
  };

  /**
   * 已选择的数据行发生改变时触发
   *
   * @param rowKeys ID 列表
   */
  const handleSelectionChange = (rowKeys: string[]) => {
    ids.value = rowKeys;
    single.value = rowKeys.length !== 1;
    multiple.value = !rowKeys.length;
  };

  const onAdd = () => {
    UserModalRef.value?.add();
  };

  const onEdit = (item: UserRecord) => {
    UserModalRef.value?.edit(item);
  };

  /**
   * 批量删除
   */
  const handleBatchDelete = () => {
    if (ids.value.length === 0) {
      proxy.$message.info('请选择要删除的数据');
    } else {
      Modal.warning({
        title: '警告',
        titleAlign: 'start',
        content: '确定要删除当前选中的数据吗？',
        hideCancel: false,
        onOk: () => {
          // handleDelete(ids.value);
        },
      });
    }
  };

  /**
   * 删除
   *
   * @param id ID 列表
   */
  const handleDelete = (id: number) => {
    deleteUser(id).then((res) => {
      proxy.$message.success(res.datas.msg);
      getList();
    });
  };

  defineExpose({
    getList,
  });
</script>

<style scoped>
  .container {
    padding: 0 20px 20px;
  }

  .toolbar {
    align-items: center;
    margin-bottom: 10px;
  }
</style>
