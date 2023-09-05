<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />
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
                @change="handleQuery"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-form-item field="username" label="菜单标题">
              <a-input
                v-model="queryParams.title"
                placeholder="输入菜单标题搜索"
                allow-clear
                @press-enter="handleQuery"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="12" :md="12" :lg="8" :xl="6" :xxl="6">
            <a-space style="margin-bottom: 20px">
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

      <a-row class="toolbar">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="toAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增
            </a-button>
            <a-button type="primary" status="success" :disabled="single">
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
            <a-tooltip content="刷新" :mini="true">
              <a-button @click="handleQuery">
                <template #icon><icon-refresh size="20" /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="导出" :mini="true">
              <a-button @click="$message.warning('功能尚在开发中')">
                <template #icon><icon-import size="20" /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="导入" :mini="true">
              <a-button @click="$message.warning('功能尚在开发中')">
                <template #icon><icon-download size="20" /></template>
              </a-button>
            </a-tooltip>
          </a-button-group>
        </a-col>
      </a-row>

      <!-- 列表区域 -->
      <a-table
        ref="tableRef"
        row-key="id"
        :data="dataList"
        :loading="loading"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: false,
        }"
        :pagination="false"
        :bordered="false"
        :default-expand-all-rows="true"
        :hide-expand-button-on-empty="true"
        column-resizable
        stripe
        size="large"
        @select="handleSelect"
        @selection-change="handleSelectionChange"
      >
        <template #columns>
          <a-table-column title="菜单标题" data-index="title" />
          <a-table-column title="图标" align="center">
            <template #cell="{ record }">
              <svg-icon :icon-class="record.icon ? record.icon : ''" />
            </template>
          </a-table-column>
          <a-table-column title="排序" align="center" data-index="sort" />
          <a-table-column title="权限标识" data-index="permission" />
          <a-table-column title="组件路径" data-index="component" />
          <a-table-column title="状态" align="center">
            <template #cell="{ record }">
              <a-switch
                v-model="record.status"
                :checked-value="1"
                :unchecked-value="2"
                @change="handleChangeStatus(record)"
              />
            </template>
          </a-table-column>
          <a-table-column title="外链" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isExternal" color="arcoblue">是</a-tag>
              <a-tag v-else color="red">否</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="缓存" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isCache" color="arcoblue">是</a-tag>
              <a-tag v-else color="red">否</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="隐藏" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isHidden" color="arcoblue">是</a-tag>
              <a-tag v-else color="red">否</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" align="center">
            <template #cell="{ record }">
              <a-button
                v-permission="['system:menu:update']"
                type="text"
                size="small"
                title="修改"
                @click="toUpdate(record.id)"
              >
                <template #icon><icon-edit /></template>修改
              </a-button>
              <a-popconfirm
                content="确定要删除当前选中的数据吗？如果存在下级菜单则一并删除，此操作不能撤销！"
                type="warning"
                @ok="handleDelete([record.id])"
              >
                <a-button
                  v-permission="['system:menu:delete']"
                  type="text"
                  size="small"
                  title="删除"
                >
                  <template #icon><icon-delete /></template>删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <MenuModal ref="MenuModalRef"></MenuModal>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, toRefs, reactive } from 'vue';
  import { TreeNodeData, TableData } from '@arco-design/web-vue';
  import { ClientRecord } from '@/types/system/Client';
  import useLoading from '@/hooks/loading';
  import { listClient } from '@/api/system/client';
  import MenuModal from './MenuModal.vue';

  const { proxy } = getCurrentInstance() as any;

  const dataList = ref<[]>([]);
  const ids = ref<Array<string>>([]);
  const title = ref('');
  const single = ref(true);
  const multiple = ref(true);
  const showQuery = ref(true);
  const loading = ref(false);
  const exportLoading = ref(false);
  const expandAll = ref(false);
  const visible = ref(false);
  const showChooseIcon = ref(false);
  const treeData = ref<TreeNodeData[]>();
  const appOptions = ref<ClientRecord[]>([]);
  // 应用下拉框 loading
  const { loading: clientLoading, setLoading: setClientLoading } =
    useLoading(false);
  const MenuModalRef = ref<InstanceType<typeof MenuModal>>();

  const data = reactive({
    // 查询参数
    queryParams: {
      tenantId: '',
      title: undefined,
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

  /**
   * 查询列表
   *
   * @param params 查询参数
   */
  const getList = (params = { ...queryParams.value }) => {
    // loading.value = true;
    // list(params)
    //   .then((res) => {
    //     dataList.value = res.data;
    //   })
    //   .finally(() => {
    //     loading.value = false;
    //   });
  };
  getList();

  /**
   * 打开新增对话框
   */
  const toAdd = () => {
    MenuModalRef.value.add();
    // reset();
    // listMenuTree({}).then((res) => {
    //   treeData.value = res.data;
    // });
    // title.value = '新增菜单';
    // visible.value = true;
  };

  /**
   * 打开修改对话框
   *
   * @param id ID
   */
  const toUpdate = (id: string) => {
    // reset();
    // listMenuTree({}).then((res) => {
    //   treeData.value = res.data;
    // });
    //
    // get(id).then((res) => {
    //   form.value = res.data;
    //   title.value = '修改菜单';
    //   visible.value = true;
    // });
  };

  /**
   * 重置表单
   */
  const reset = () => {
    form.value = {
      id: undefined,
      title: '',
      parentId: undefined,
      type: 1,
      path: undefined,
      name: undefined,
      component: undefined,
      icon: undefined,
      isExternal: false,
      isCache: false,
      isHidden: false,
      permission: undefined,
      sort: 999,
      status: 1,
    };
    proxy.$refs.formRef?.resetFields();
  };

  /**
   * 取消
   */
  const handleCancel = () => {
    visible.value = false;
    proxy.$refs.formRef.resetFields();
  };

  /**
   * 确定
   */
  const handleOk = () => {
    // proxy.$refs.formRef.validate((valid: any) => {
    //   if (!valid) {
    //     if (form.value.id !== undefined) {
    //       update(form.value, form.value.id).then((res) => {
    //         handleCancel();
    //         getList();
    //         proxy.$message.success(res.msg);
    //       });
    //     } else {
    //       add(form.value).then((res) => {
    //         handleCancel();
    //         getList();
    //         proxy.$message.success(res.msg);
    //       });
    //     }
    //   }
    // });
  };

  /**
   * 批量删除
   */
  const handleBatchDelete = () => {
    if (ids.value.length === 0) {
      proxy.$message.info('请选择要删除的数据');
    } else {
      proxy.$modal.warning({
        title: '警告',
        titleAlign: 'start',
        content:
          '确定要删除当前选中的数据吗？如果存在下级菜单则一并删除，此操作不能撤销！',
        hideCancel: false,
        onOk: () => {
          handleDelete(ids.value);
        },
      });
    }
  };

  /**
   * 删除
   *
   * @param ids ID 列表
   */
  const handleDelete = (ids: Array<string>) => {
    // del(ids).then((res) => {
    //   proxy.$message.success(res.msg);
    //   getList();
    // });
  };

  /**
   * 点击行选择器
   */
  const handleSelect = (rowKeys: any, rowKey: any, record: TableData) => {
    if (rowKeys.find((key: any) => key === rowKey)) {
      if (record.children) {
        record.children.forEach((r) => {
          proxy.$refs.tableRef.select(r.id);
          rowKeys.push(r.id);
          if (r.children) {
            handleSelect(rowKeys, rowKey, r);
          }
        });
      }
    } else if (record.children) {
      record.children.forEach((r) => {
        rowKeys.splice(
          rowKeys.findIndex((key: number | undefined) => key === r.id),
          1
        );
        proxy.$refs.tableRef.select(r.id, false);
        if (r.children) {
          handleSelect(rowKeys, rowKey, r);
        }
      });
    }
  };

  /**
   * 已选择的数据行发生改变
   *
   * @param rowKeys ID 列表
   */
  const handleSelectionChange = (rowKeys: Array<any>) => {
    ids.value = rowKeys;
    single.value = rowKeys.length !== 1;
    multiple.value = !rowKeys.length;
  };

  /**
   * 导出
   */
  const handleExport = () => {
    if (exportLoading.value) return;
    exportLoading.value = true;
    proxy
      .download('/system/menu/export', { ...queryParams.value }, '菜单数据')
      .finally(() => {
        exportLoading.value = false;
      });
  };

  /**
   * 展开/折叠
   */
  const handleExpandAll = () => {
    expandAll.value = !expandAll.value;
    proxy.$refs.tableRef.expandAll(expandAll.value);
  };

  /**
   * 修改状态
   *
   * @param record 记录信息
   */
  const handleChangeStatus = (record) => {
    // if (record.id) {
    //   const tip = record.status === 1 ? '启用' : '禁用';
    //   update(record, record.id)
    //     .then(() => {
    //       proxy.$message.success(`${tip}成功`);
    //     })
    //     .catch(() => {
    //       record.status = record.status === 1 ? 2 : 1;
    //     });
    // }
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

  /**
   * 展示下拉图标
   */
  const showSelectIcon = () => {
    proxy.$refs.iconSelectRef.reset();
    showChooseIcon.value = true;
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

  const hideSelectIcon = () => {
    showChooseIcon.value = false;
  };

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

  let clientId: string;
  const getAppOptions = async () => {
    setClientLoading(true);
    try {
      const res = await listClient();
      appOptions.value = res.data;
      if (res.data.length) {
        clientId = res.data[0].clientId;
        queryParams.value.tenantId = clientId;
      }
    } finally {
      setClientLoading(false);
    }
  };
  getAppOptions();
</script>

<script lang="ts">
  export default {
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'Menu',
  };
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
