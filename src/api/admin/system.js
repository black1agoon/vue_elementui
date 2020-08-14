/* global PREV */

import {request} from '../common'
let prev = PREV
export default {
  public: {
    login(user) {
      return request('post', prev + '/public/login', user)
    },
    logout() {
      return request('post', prev + '/public/logout')
    },
    uploadAvatar(file) {
      let data = new FormData()
      data.append('file', file)
      // let headers = {'Content-Type': 'multipart/form-data'}
      return request('post', prev + '/admin/upload/uploadAvatar', data)
    },
    uploadDoc(file) {
      let data = new FormData()
      data.append('file', file)
      // let headers = {'Content-Type': 'multipart/form-data'}
      return request('post', prev + '/upload/uploadDoc', data)
    },
    uploadPic(file) {
      let data = new FormData()
      data.append('file', file)
      // let headers = {'Content-Type': 'multipart/form-data'}
      return request('post', prev + '/upload/uploadPic', data)
    },
    uploadVideo(file) {
      let data = new FormData()
      data.append('file', file)
      // let headers = {'Content-Type': 'multipart/form-data'}
      return request('post', prev + '/upload/uploadVideo', data)
    },
    getRegionProv() {
      return request('get', prev + '/region/prov')
    },
    getRegionCities(prov) {
      return request('get', prev + '/region/cities', {prov})
    },
    getRegionDistrict(city) {
      return request('get', prev + '/region/district', {city})
    },
    getRegionById(id) {
      return request('get', prev + '/region/getRegionById', {id})
    },
    updateCache() {
      return request('post', prev + '/public/updateCache')
    }
  },
  permission: {
    getAllPermissionTree() {
      return request('get', prev + '/admin/permission/newpermission')
    },
    get(id) {
      return request('post', prev + '/admin/permission/get', {id})
    },
    addPermission(info) {
      return request('post', prev + '/admin/permission/add', info)
    },
    updatePermission(info) {
      return request('post', prev + '/admin/permission/update', info)
    },
    delete(idList) {
      return request('get', prev + '/admin/permission/del', {idList: idList.toString()})
    },
    getPermissRoleTree(query) {   // 用于显示角色对应的树状权限列表,获取子系统下所有的权限
      return request('post', prev + '/admin/permission/roletree', query)
    },
    getMenuBindRole(id) {
      return request('get', prev + '/admin/permission/getRoleListByPermissionId', {id})
    },
    removeRel(params) {
      return request('post', prev + '/admin/permission/delRoleRelPermission', params)
    }
  },
  dictionary: {
    addAttrCode(info) {
      return request('post', prev + '/attrCode/add', info)
    },
    updateAttrCode(info) {
      return request('post', prev + '/attrCode/update', info)
    },
    deleteAttrCode(id) {
      return request('get', prev + '/attrCode/del', {id})
    },
    getAttrCodeById(id) {
      return request('get', prev + '/attrCode/get', {id})
    },
    getPaged(query) {
      return request('post', prev + '/attrCode/paged', query)
    },
    addAttrValue(info) {
      return request('post', prev + '/admin/attrValue/add', info)
    },
    updateAttrValue(info) {
      return request('post', prev + '/admin/attrValue/update', info)
    },
    deleteAttrValue(id) {
      return request('get', prev + '/admin/attrValue/del', {id})
    },
    getAttrValueById(id) {
      return request('get', prev + '/admin/attrValue/get', {id})
    },
    getValuePaged(query) {
      return request('post', prev + '/admin/attrValue/getPagedByAttrCode', query)
    }
  },
  department: {
    getTree() {
      return request('get', prev + '/admin/department/tree')
    },
    getDepartment(id) {
      return request('get', prev + '/admin/department/get', {id})
    },
    addDepartment(info) {
      return request('post', prev + '/admin/department/add', info)
    },
    updateDepartment(info) {
      return request('post', prev + '/admin/department/update', info)
    },
    deleteDepartment(id) {
      return request('get', prev + '/admin/department/del', {id})
    },
    getTreeNoOwn(info) {
      return request('post', prev + '/admin/department/treeNoOwn', info)
    }
  },
  user: {
    getPaged(query) {
      return request('post', prev + '/admin/user/paged', query)
    },
    addUser(info) {
      return request('post', prev + '/admin/user/add', info)
    },
    updateUser(info) {
      return request('post', prev + '/admin/user/update', info)
    },
    delete(id) {
      return request('post', prev + '/admin/user/del', {id})
    },
    getUser(id) {
      return request('post', prev + '/admin/user/get', {id})
    },
    updateUserPwd(info) {
      return request('post', prev + '/admin/user/updatePassword', info)
    },
    enableUser(info) {
      return request('post', prev + '/admin/user/enable', info)
    },
    disableUser(info) {
      return request('post', prev + '/admin/user/disable', info)
    },
    getNoUsedPaged(query) {
      return request('post', prev + '/admin/user/pagedNoUsed', query)
    },
    resetPassword(id) {
      return request('post', prev + '/admin/user/resetPassword', {id})
    }
  },
  role: {
    getPaged(query) {
      return request('post', prev + '/admin/role/paged', query)
    },
    addRole(info) {
      return request('post', prev + '/admin/role/add', info)
    },
    updateRole(info) {
      return request('post', prev + '/admin/role/update', info)
    },
    deleteRole(id) {
      return request('post', prev + '/admin/role/del', {id})
    },
    getRole(id) {
      return request('post', prev + '/admin/role/get', {id})
    },
    setRolePermission(query) {
      return request('post', prev + '/admin/role/setRolePermission', query)
    },
    setUserRoles(info) {
      return request('post', prev + '/admin/role/setUserRole', info)
    },
    disassociationUserForRole(query) {
      return request('post', prev + '/admin/userRelRole/disassociationUsersForRole', query)
    }
  },
  params: {
    add(info) {
      return request('post', prev + '/admin/parameters/add', info)
    },
    update(info) {
      return request('post', prev + '/admin/parameters/update', info)
    },
    delete(id) {
      return request('get', prev + '/admin/parameters/del', {id})
    },
    get(id) {
      return request('get', prev + '/admin/parameters/get', {id})
    },
    getAll() {
      return request('get', prev + '/admin/parameters/get')
    },
    paged(query) {
      return request('post', prev + '/admin/parameters/paged', query)
    }
  },
  serialNumber: {
    add(info) {
      return request('post', prev + '/admin/serialNumber/add', info)
    },
    update(info) {
      return request('post', prev + '/admin/serialNumber/update', info)
    },
    delete(id) {
      return request('get', prev + '/admin/serialNumber/del', {id})
    },
    get(id) {
      return request('get', prev + '/admin/serialNumber/get', {id})
    },
    paged(query) {
      return request('post', prev + '/admin/serialNumber/paged', query)
    }
  },
  mock: {
    paged(query) {
      return request('post', prev + '/mock/paged', query)
    },
    addUser(info) {
      return request('post', prev + '/mock/adduser', info)
    },
    updateUser(info) {
      return request('post', prev + '/mock/updateuser', info)
    },
    deleteUser(id) {
      return request('get', prev + '/mock/deleteuser', {id})
    },
    get(id) {
      return request('get', prev + '/mock/getuser', {id})
    }
  }
}
