/* global PREV */
import {request} from '../common'
let prev = PREV
export default {
  clientGroup: {
    add(info) {
      return request('post', prev + '/base/clientGroup/add', info)
    },
    update(info) {
      return request('post', prev + '/base/clientGroup/update', info)
    },
    delete(id) {
      return request('post', prev + '/base/clientGroup/del', {id})
    },
    paged(query) {
      return request('post', prev + '/base/clientGroup/paged', query)
    },
    setClientGroupPermission(query) {
      return request('post', prev + '/base/clientGroup/setClientGroupPermission', query)
    },
    setclientGroup(info) {
      return request('post', prev + '/base/clientGroup/setclientGroup', info)
    },
    disassociationClientsForGroup(info) {
      return request('post', prev + '/api/clientRelClientGroup/disassociationClientsForGroup', info)
    }
  },
  clientPermission: {
    add(info) {
      return request('post', prev + '/base/clientPermission/add', info)
    },
    delete(idList) {
      return request('get', prev + '/base/clientPermission/del', {idList: idList.toString()})
    },
    update(info) {
      return request('post', prev + '/base/clientPermission/update', info)
    },
    get(id) {
      return request('post', prev + '/base/clientPermission/get', {id})
    },
    getRoleListByPermissionId(id) {
      return request('get', prev + '/base/clientPermission/getGroupListByPermissionId', {id})
    },
    newpermission() {
      return request('get', prev + '/base/clientPermission/newpermission')
    },
    delGroupRelPermission(params) {
      return request('post', prev + '/base/clientPermission/delGroupRelPermission', params)
    },
    groupTree(id) {   // 用于显示角色对应的树状权限列表,获取子系统下所有的权限
      return request('post', prev + '/base/clientPermission/groupTree', {id})
    }
  },
  client: {
    add(info) {
      return request('post', prev + '/base/client/add', info)
    },
    update(info) {
      return request('post', prev + '/base/client/update', info)
    },
    delete(id) {
      return request('post', prev + '/base/client/del', {id})
    },
    get(id) {
      return request('post', prev + '/base/client/get', {id})
    },
    paged(query) {
      return request('post', prev + '/base/client/paged', query)
    },
    enable(info) {
      return request('post', prev + '/base/client/enable', info)
    },
    disable(info) {
      return request('post', prev + '/base/client/disable', info)
    },
    updatePassword(id) {
      return request('post', prev + '/base/client/updatePassword', {id})
    }
  },
  clientPiece: {
    add(info) {
      return request('post', prev + '/base/clientPiece/add', info)
    },
    update(info) {
      return request('post', prev + '/base/clientPiece/update', info)
    },
    delete(idList) {
      return request('get', prev + '/base/clientPiece/del', {idList: idList.toString()})
    },
    get(id) {
      return request('post', prev + '/base/clientPiece/get', {id})
    },
    groupTree() {
      return request('post', prev + '/base/clientPiece/groupTree', {id: 0})
    },
    paged(query) {
      return request('post', prev + '/base/clientPiece/paged', query)
    }
  }
}