/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export default function handleTree(
  data: any[],
  id?: any,
  parentId?: any,
  children?: any[]
) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  };

  const childrenListMap = {};
  const nodeIds = {};
  const tree = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const d of data) {
    const pid = d[config.parentId];
    // @ts-ignore
    if (childrenListMap[pid] == null) {
      // @ts-ignore
      childrenListMap[pid] = [];
    }
    // @ts-ignore
    nodeIds[d[config.id]] = d;
    // @ts-ignore
    childrenListMap[pid].push(d);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const d of data) {
    const pid = d[config.parentId];
    // @ts-ignore
    if (nodeIds[pid] == null) {
      tree.push(d);
    }
  }

  function adaptToChildrenList(o) {
    // @ts-ignore
    if (childrenListMap[o[config.id]] !== null) {
      // @ts-ignore
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    // @ts-ignore
    if (o[config.childrenList]) {
      // eslint-disable-next-line no-restricted-syntax
      // @ts-ignore
      // eslint-disable-next-line no-restricted-syntax
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const t of tree) {
    adaptToChildrenList(t);
  }

  return tree;
}
