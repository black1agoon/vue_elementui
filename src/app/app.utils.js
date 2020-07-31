import Vue from 'vue'

export default {
  isChanged (obj, copyobj) {
    return Boolean(Object.keys(obj).find(k => {
      if (Array.isArray(obj[k]) && obj[k].sort().toString() === copyobj[k].sort().toString()) {
        return
      } else {
        return (copyobj[k] ? copyobj[k].toString() : null) !== (obj[k] ? obj[k].toString() : null)
      }
    }))
  },
  formatComboboxData (data) {
    return data.map(d => ({
      value: d.code,
      text: d.name,
    }))
  },
  confirm (msg, method) {
    return Vue.prototype.$confirm(msg, '提示', {
      iconClass: 'fa fa-question-circle',
    }).then(method)
      .catch(() => {
        // alert('cancel')
      })
  },
  getTreePathByKey (value, key, arr) {
    let temppath = []
    try {
      let getNodePath = (node) => {
        temppath.push(node[key])
        // 找到符合条件的节点，通过throw终止掉递归
        if (node[key] === value) {
          throw new Error('GOT IT!')
        }
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            getNodePath(node.children[i])
          }
          // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
          temppath.pop()
        } else {
          // 找不到叶子节点时，删除路径当中的该叶子节点
          temppath.pop()
        }
      }
      for (let i = 0; i < arr.length; i++) {
        getNodePath(arr[i])
      }
    } catch (e) {
      return temppath
    }
  },
}
