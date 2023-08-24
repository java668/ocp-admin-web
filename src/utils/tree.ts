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
  children?: any
) {
  type configType = { id: string; parentId: string; childrenList: string };
  const config: configType = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  };

  const childrenListMap: any = {};
  const nodeIds: any = {};
  const tree: any[] = [];

  data.forEach((d) => {
    const pid = d[config.parentId];
    if (childrenListMap[pid] == null) {
      childrenListMap[pid] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[pid].push(d);
  });

  data.forEach((d) => {
    const pid = d[config.parentId];
    if (nodeIds[pid] == null) {
      tree.push(d);
    }
  });

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      o[config.childrenList].forEach((c: any) => {
        adaptToChildrenList(c);
      });
    }
  }

  tree.forEach((t) => {
    adaptToChildrenList(t);
  });

  return tree;
}
