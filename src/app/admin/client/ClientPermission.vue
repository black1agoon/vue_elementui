<template>
  <eui-layout :regions="region">
    <main-toolbar slot="north"
                  :buttons="helper.getMainFilterButtons(buttons)"
                  @click="onBtnClick">
    </main-toolbar>
    <eui-tree  slot="west" :options="treeOptions">
    </eui-tree>
    <div  class="center-wrapper" slot="center">
      <eui-table
          class="table1"
          ref="table"
          :showIndex="false"
          :showPagination="false"
          :highlight-current-row="true"
          :options="tableOptions">
        <el-table-column label="操作" minWidth="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="onBtnClick('btnRemoveAll', scope.row)">
              <i class="btn-icon fa fa-unlock"></i>解除全部关联</el-button>
            <el-button
                v-for="(btn, index) in helper.getTableButtons(buttons, tableButtons)"
                size="mini"
                type="text"
                :key="index"
                @click="onBtnClick(btn.btnKey, scope.row)">
              <i :class="['btn-icon fa', btn.logo]"></i>{{btn.name}}
            </el-button>
          </template>
        </el-table-column>
      </eui-table>
      <div class="talbe-title">关联角色:</div>
      <eui-table
          class="table2"
          ref="table"
          :showIndex="false"
          :showPagination="false"
          :highlight-current-row="true"
          :options="tableOptions2">
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="onBtnClick('btnRemove', scope.row)">
              <i class="btn-icon fa fa-unlock"></i>解除关联</el-button>
          </template>
        </el-table-column>
      </eui-table>
    </div>
    <client-permission-window ref="window"
                 :pid="treeClickNode.id"
                 :input-options="formOptions"
                 @reload="getData">
    </client-permission-window>
  </eui-layout>
</template>

<script>
  import api from '@/api'
  import helper from '@/app/app.helpers'
  import TabPane from '@/components/views/TabPane'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiTree from '@/components/common/form/EuiTree'
  import EuiTable from '@/components/common/form/EuiTable'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import {PERMISSION} from './client.config'
  import ClientPermissionWindow from './window/ClientPermissionWindow'
  export default {
    name: 'client-permission',
    _meta: {
      path: '/client/permission',
      title: '客户端权限'
    },
    mixins: [TabPane],
    components: {
      MainToolbar,
      EuiTree,
      EuiLayout,
      EuiTable,
      ClientPermissionWindow
    },
    data() {
      return {
        region: PERMISSION.REGIONS,
        helper,
        buttons: helper.getMainButtons(),
        tableButtons: [],
        formOptions: {
          pid: []
        },
        query: {
          permissionId: null,
          permissionRow: {}
        },
        permissionList: [], // 所有权限保存的列表
        treeClickNode: {}, // 点击树 保存的节点
        copyRowId: null,
        treeOptions: {
          data: [],
          // defaultExpandAll: true,
          defaultExpandedKeys: [],
          expandOnClickNode: false,
          nodeClick: (data, node, vnode) => {
            // if (this.editflag) {
            //   utils.confirm('是否放弃编辑?', this.cancelForm)
            // } else {
            //   this.treeOptions.defaultExpandedKeys = [data.id]
            //   api.permission.getPermission(data.id).then(data => {
            //     this.formdata = JSON.parse(JSON.stringify(data))
            //   })
            // }
            this.treeClickNode = data
            this.copyRowId = data.id
            this.getTableData()
          }
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'name', label: '名称', minWidth: 150, align: 'left'},
            {prop: 'permission', label: '权限', minWidth: 150, align: 'left'},
            {prop: 'resourceTypeStr', label: '类型', minWidth: 100},
            {prop: 'seq', label: '排序', minWidth: 80},
            {prop: 'btnKey', label: '键名', minWidth: 100},
            {prop: 'logo', label: '图标', minWidth: 100},
            {prop: 'pName', label: '上级菜单', minWidth: 100},
            {prop: 'url', label: 'URL', minWidth: 100},
            {prop: 'channelStr', label: '终端', minWidth: 100},
            {prop: 'memo', label: '备注', minWidth: 100}
          ],
          rowClick: (row, event, column) => {
            this.query.permissionId = row.id
            this.query.permissionRow = row
            this.copyRowId = row.id
            this.getMenuBindRole(row.id)
          },
          rowDblclick: (row, event) => {
            this.$refs.window.open(row)
          }
        },
        tableOptions2: {
          data: [],
          total: 0,
          columns: [
            {prop: 'name', label: '角色名称', width: 400, fixed: true},
            {prop: 'description', label: '角色描述', width: 400, fixed: true}
          ]
        }
      }
    },
    methods: {
      getData() {
        api.clientPermission.newpermission().then((data) => {
          this.permissionList = data['permissionList']
          this.treeOptions.data = helper.getTreeData(data['permissionList'], 'childUserPermission', 'name')
          this.treeOptions.defaultExpandedKeys = this.getDefaultExpandedKeys(this.treeOptions.data)
          if (this.treeClickNode.id) {
            this.treeOptions.defaultExpandedKeys.push(this.treeClickNode.id)
            this.getTableData()
          }
          // this.formOptions.pid = [{
          //   id: '0',
          //   label: '根目录',
          //   children: helper.getTreeData(data['permissionList'], 'childUserPermission', 'name')
          // }]
          this.formOptions.pid = helper.getTreeData(data['permissionList'], 'childUserPermission', 'name')
        })
      },
      getTableData() {
        let list = []
        let pNode = helper.getTreeNode(this.permissionList, this.treeClickNode.id, 'childUserPermission')
        if (pNode) {
          list = pNode['childUserPermission'].slice()
          list.unshift(pNode)
          this.tableOptions.data = list
        } else {
          this.tableOptions.data = []
        }
      },
      getMenuBindRole() {  // 获取 权限关联的角色(下方表格数据)
        api.clientPermission.getRoleListByPermissionId(this.query.permissionId).then(data => {
          this.tableOptions2.data = data ? data : []
        })
      },
      getIdListByRow(row) {
        let idList = []
        let traverse = list => {
          list.forEach(i => {
            idList.push(i.id)
            i['childUserPermission'] && traverse(i['childUserPermission'])
          })
        }
        traverse([row])
        return idList
      },
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.$refs.window.open()
          },
          btnEdit: (row) => {
            this.$refs.window.open(row)
            // api.permission.getPermission(row.id).then(data => {
            //   this.$refs.window.open(data)
            // })
          },
          btnDelete: (row) => {
            this.$confirm(`是否删除:${row.name}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.clientPermission.delete(this.getIdListByRow(row)).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData()
              })
            }).catch(() => {
            })
          },
          btnCopy: () => {
            api.clientPermission.get(this.copyRowId).then(data => {
              console.log(data)
              let copy = {...data}
              delete copy['id']
              this.$refs.window.open(copy)
            })
          },
          btnRemove: (row) => {
            this.$confirm(`是否解除关联: ${row.name} ？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.clientPermission.delGroupRelPermission({
                permissionIdList: this.getIdListByRow(this.query.permissionRow),
                groupId: row.id
              }).then(() => {
                this.$message({
                  message: '解除成功!',
                  type: 'success'
                })
                this.getMenuBindRole()
              })
            }).catch(() => {
            })
          },
          btnRemoveAll: (row) => {
            this.$confirm(`是否解除该权限下所有角色关联？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.clientPermission.delGroupRelPermission({
                permissionIdList: this.getIdListByRow(row)
              }).then(() => {
                this.$message({
                  message: '解除成功!',
                  type: 'success'
                })
                this.getMenuBindRole()
              })
            }).catch(() => {
            })
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, row)
        }
      },
      getDefaultExpandedKeys(treedata) { // 展开树状图第一级
        treedata.forEach(t => {
          if (!this.treeOptions.defaultExpandedKeys.includes(t.id)) {
            this.treeOptions.defaultExpandedKeys.push(t.id)
          }
        })
        return this.treeOptions.defaultExpandedKeys
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .center-wrapper
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    .table1
      flex: 1
    .table2
      flex: 0 0 250px
    .talbe-title
      padding: 10px 0 10px 20px
      font-size: 15px
</style>

