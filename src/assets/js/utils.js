/**
 * 解析url参数
 * @example  ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse(url) {
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);

  // ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}

/**
 *
 * @param treedata  树型数据 list结构
 * @param key   child 键值
 */
export function treeExpand(treedata, key) {
  let list = []
  let expand = tdata => {
    tdata.forEach(data => {
      list.push(data)
      data[key] && expand(data[key])
    })
  }
  expand(treedata)
  return list
}