<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <a-card>
      <a-form label-align="right" auto-label-width :model="form" class="form">
        <a-row :gutter="16" wrap>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="value1" label="账号">
              <a-input v-model="form.value1" placeholder="请输入账号" />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="value2" label="用户名">
              <a-input v-model="form.value2" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="value2" label="手机号码">
              <a-input v-model="form.value2" placeholder="请输入手机号码" />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-space>
              <a-button type="primary" status="success">
                <template #icon>
                  <icon-search />
                </template>
                <template #default>查询</template>
              </a-button>
              <a-button type="primary" status="warning">
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
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-button type="primary" status="success">
              <template #icon>
                <icon-edit />
              </template>
              修改
            </a-button>
            <a-button type="primary" status="danger">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.download') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button-group>
            <a-button>
              <template #icon><icon-refresh size="18" /></template>
            </a-button>
            <a-button>
              <template #icon><icon-line-height size="18" /></template>
            </a-button>
            <a-button>
              <template #icon><icon-settings size="18" /></template>
            </a-button>
          </a-button-group>
          <!--          <a-tooltip :content="$t('searchTable.actions.refresh')">-->
          <!--            <div class="action-icon" @click="search"-->
          <!--              ><icon-refresh size="18"-->
          <!--            /></div>-->
          <!--          </a-tooltip>-->
          <!--          <a-dropdown @select="handleSelectDensity">-->
          <!--            <a-tooltip :content="$t('searchTable.actions.density')">-->
          <!--              <div class="action-icon"><icon-line-height size="18" /></div>-->
          <!--            </a-tooltip>-->
          <!--            <template #content>-->
          <!--              &lt;!&ndash;              <a-doption&ndash;&gt;-->
          <!--              &lt;!&ndash;                v-for="item in densityList"&ndash;&gt;-->
          <!--              &lt;!&ndash;                :key="item.value"&ndash;&gt;-->
          <!--              &lt;!&ndash;                :value="item.value"&ndash;&gt;-->
          <!--              &lt;!&ndash;                :class="{ active: item.value === size }"&ndash;&gt;-->
          <!--              &lt;!&ndash;              >&ndash;&gt;-->
          <!--              &lt;!&ndash;                <span>{{ item.name }}</span>&ndash;&gt;-->
          <!--              &lt;!&ndash;              </a-doption>&ndash;&gt;-->
          <!--            </template>-->
          <!--          </a-dropdown>-->
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :loading="loading"
        :data="userList"
        :bordered="false"
        :scroll="{ y: '100%' }"
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
      >
        <template #operations>
          <a-space>
            <a-button status="success" size="mini">查看</a-button>
            <a-button status="warning" size="mini">修改</a-button>
            <a-button status="danger" size="mini">删除</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRefs } from 'vue';
  import { UserRecord, UserPage, UserParam } from '@/types/system/User';
  import { page } from '@/api/system/user';

  const userList = ref<UserPage[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const data = reactive({
    // 查询参数
    queryParams: {
      username: undefined,
      nickname: undefined,
      mobile: undefined,
      page: 1,
      limit: 10,
    },
    // 表单数据
    form: {} as UserRecord,
    // 表单验证规则
    rules: {
      username: [{ required: true, message: '请输入用户名' }],
      nickname: [{ required: true, message: '请输入昵称' }],
      deptId: [{ required: true, message: '请选择所属部门' }],
      roleIds: [{ required: true, message: '请选择所属角色' }],
    },
  });
  const { queryParams, form, rules } = toRefs(data);

  const columns = [
    {
      title: '用户编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '账号',
      dataIndex: 'nickname',
      width: 100,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      ellipsis: true,
      tooltip: true,
      width: 100,
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
    loading.value = true;
    const res = await page(params);
    try {
      userList.value = res.data;
      total.value = res.count;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  getList();

  const search = () => {};
  const handleSelectDensity = () => {};
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
