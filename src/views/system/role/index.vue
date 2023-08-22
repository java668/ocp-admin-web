<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.role']" />
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
            <a-form-item field="tenantId" label="所属应用">
              <a-select
                v-model="queryParams.tenantId"
                placeholder="请输入所属应用"
                :options="appOptions"
                :field-names="{ value: 'clientId', label: 'clientName' }"
                :loading="clientLoading"
                allow-search
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="name" label="角色名称">
              <a-input
                v-model="queryParams.name"
                placeholder="请输入角色名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-space>
              <a-button type="primary" status="success" @click="handleQuery">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button type="primary" status="warning" @click="resetQuery">
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
      <a-grid :cols="24" :col-gap="16" :row-gap="16">
        <a-grid-item :span="16">
          <a-card title="角色列表">
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
                    @click="onEdit(ids[0])"
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
                  <a-button title="刷新" @click="handleQuery">
                    <template #icon>
                      <icon-refresh size="20" />
                    </template>
                  </a-button>
                  <a-button
                    title="导出"
                    @click="$message.warning('功能尚在开发中')"
                  >
                    <template #icon>
                      <icon-import size="20" />
                    </template>
                  </a-button>
                  <a-button
                    title="导入"
                    @click="$message.warning('功能尚在开发中')"
                  >
                    <template #icon>
                      <icon-download size="20" />
                    </template>
                  </a-button>
                  <a-button
                    title="导入"
                    @click="$message.warning('功能尚在开发中')"
                  >
                    <template #icon>
                      <icon-line-height size="20" />
                    </template>
                  </a-button>
                  <a-button
                    title="导入"
                    @click="$message.warning('功能尚在开发中')"
                  >
                    <template #icon>
                      <icon-settings size="20" />
                    </template>
                  </a-button>
                </a-button-group>
              </a-col>
            </a-row>
            <a-table
              ref="tableRef"
              :data="roleList"
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
              @page-change="handlePageChange"
              @page-size-change="handlePageSizeChange"
              @select="handleSelectionChange"
            >
              <template #columns>
                <a-table-column title="ID" data-index="id" />
                <a-table-column title="角色名">
                  <template #cell="{ record }">
                    <a-link @click="onDetail(record.id)"
                      >{{ record.name }}
                    </a-link>
                  </template>
                </a-table-column>
                <a-table-column title="角色编码" data-index="code" />
                <a-table-column title="创建时间">
                  <template #cell="{ record }">
                    {{ record.createTime }}
                  </template>
                </a-table-column>
                <a-table-column title="操作" align="center" fixed="right">
                  <template #cell="{ record }">
                    <a-button
                      type="text"
                      size="small"
                      title="修改"
                      @click="onUpdate(record.id)"
                    >
                      <template #icon>
                        <icon-edit />
                      </template>
                    </a-button>
                    <a-popconfirm
                      content="确定要删除当前选中的数据吗？"
                      type="warning"
                      @ok="handleDelete([record.id])"
                    >
                      <a-button
                        type="text"
                        size="small"
                        title="删除"
                        :disabled="record.disabled"
                      >
                        <template #icon>
                          <icon-delete />
                        </template>
                      </a-button>
                    </a-popconfirm>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-card>
        </a-grid-item>
        <a-grid-item :span="8">
          <MenuTree ref="MenuTreeRef"></MenuTree>
        </a-grid-item>
      </a-grid>
    </a-card>
    <RoleModal ref="RoleModalRef"></RoleModal>
  </div>
</template>

<script lang="ts" setup>
  import type { Form } from '@arco-design/web-vue';
  import { ref, reactive, toRefs } from 'vue';
  import useLoading from '@/hooks/loading';
  import { RoleParam, RoleRecord } from '@/types/system/Role';
  import { ClientRecord } from '@/types/system/Client';
  import { page } from '@/api/system/role';
  import { listClient } from '@/api/system/client';
  import { toNumber } from 'lodash';
  import RoleModal from './RoleModal.vue';
  import MenuTree from './MenuTree.vue';

  // 列表 loading
  const { loading, setLoading } = useLoading(false);
  // 应用下拉框 loading
  const { loading: clientLoading, setLoading: setClientLoading } =
    useLoading(false);

  const roleList = ref<RoleRecord[]>([]);
  const total = ref(0);

  const ids = ref<string[]>([]);
  const single = ref(true);
  const multiple = ref(true);

  const appOptions = ref<ClientRecord[]>([]);
  const queryRef = ref<InstanceType<typeof Form>>();
  const RoleModalRef = ref<InstanceType<typeof RoleModal>>();

  const data = reactive({
    // 查询参数
    queryParams: {
      tenantId: undefined,
      name: undefined,
      page: 1,
      limit: 10,
    } as RoleParam,
  });

  const { queryParams } = toRefs(data);
  let clientId: string;
  /**
   * 应用下拉选项
   */
  const getAppOptions = async () => {
    setClientLoading(true);
    try {
      const res = await listClient();
      appOptions.value = res.data;
      if (res.data.length) {
        clientId = res.data[0].clientId;
        queryParams.value.tenantId = clientId as string;
      }
    } finally {
      setClientLoading(false);
    }
  };

  /**
   * 查询列表
   *
   * @param params 查询参数
   */
  const getList = async (params: RoleParam = { ...queryParams.value }) => {
    setLoading(true);
    try {
      const res = await page(params);
      roleList.value = res.data;
      total.value = toNumber(res.count);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 初始化
   */
  const init = () => {
    getAppOptions();
    getList();
  };

  /**
   * 初始化查询
   */
  init();

  const handleQuery = () => {
    getList();
  };

  /**
   * 重置表单
   */
  const resetQuery = () => {
    queryRef.value?.resetFields();
    queryParams.value.tenantId = clientId as string;
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

  const handleSelectionChange = (rowKeys: string[]) => {
    ids.value = rowKeys;
    single.value = rowKeys.length !== 1;
    multiple.value = !rowKeys.length;
  };

  const onAdd = () => {
    RoleModalRef.value?.add();
  };

  const onEdit = (userId: string) => {
    RoleModalRef.value?.edit(userId);
  };
  const onDetail = () => {};
  const onUpdate = () => {};
  const handleDelete = () => {};
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }

  .toolbar {
    align-items: center;
    margin-bottom: 10px;
  }
</style>
