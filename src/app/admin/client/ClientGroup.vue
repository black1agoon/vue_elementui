<template>
  <eui-layout :regions="REGIONS">
    <main-toolbar
        slot="north"
        :buttons="helper.getMainFilterButtons(buttons, tableButtons)"
        @click="onBtnClick">
    </main-toolbar>
    <eui-table
        slot="center"
        ref="table"
        :highlight-current-row="false"
        :options="tableOptions">
      <el-table-column label="操作" align="center" minWidth="200" fixed="right">
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
    <div class="table-box" slot="south">
      <div class="table-title">
        关联客户端:
      </div>
      <eui-table
          class="table"
          :highlight-current-row="false"
          :options="subTableOptions">
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

    <client-group-window
        ref="window"
        @reload="tableOptions.reload">
    </client-group-window>
    <permission-window ref="permissionWindow">
    </permission-window>
  </eui-layout>
</template>

<script>
  import api from '@/api'
  import {GROUP} from './client.config'
  import helper from '@/app/app.helpers'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import EuiTable from '@/components/common/form/EuiTable'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import ClientGroupWindow from './window/ClientGroupWindow'
  import PermissionWindow from './window/PermissionWindow'
  export default {
    name: 'client-group',
    _meta: {
      path: '/client/group',
      title: '客户端角色'
    },
    components: {
      ClientGroupWindow,
      PermissionWindow,
      EuiLayout,
      EuiTable,
      MainToolbar
    },
    data() {
      return {
        helper,
        REGIONS: GROUP.REGIONS,
        buttons: helper.getMainButtons(),
        tableButtons: ['btnSetPermission'],
        query: {
          page: 1,
          pageSize: 10
        },
        subQuery: {
          groupId: null,
          page: 1,
          pageSize: 10
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'name', label: '角色名称', minWidth: 150},
            {prop: 'description', label: '角色描述', minWidth: 100},
            {prop: 'createTime', label: '创建时间', minWidth: 150}
          ],
          rowClick: (row, event, column) => {
            // this.formdata = {...row}
            this.subQuery.groupId = row.id
            this.subQuery.page = 1
            this.getSubData()
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData(this.query)
          }
        },
        subTableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'username', label: '用户名', minWidth: 100, fixed: true},
            {prop: 'name', label: '姓名', minWidth: 100},
            {prop: 'email', label: '邮箱', minWidth: 100},
            {prop: 'mobile', label: '手机号', minWidth: 100},
            {prop: 'memo', label: '备注', minWidth: 100},
            {prop: 'createTime', label: '创建时间', minWidth: 100}
          ],
          reload: (name, val) => {
            this.subQuery.page = name === 'page' ? val : this.subQuery.page
            this.subQuery.pageSize = name === 'pageSize' ? val : this.subQuery.pageSize
            this.getSubData(this.subQuery)
          }
        }
      }
    },
    methods: {
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.$refs.window.open()
          },
          btnEdit: (row) => {
            this.$refs.window.open(row)
          },
          btnDelete: (row) => {
            this.$confirm(`是否删除:角色 ${row.name}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.clientGroup.delete(row.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData()
              })
            }).catch(() => {
            })
          },
          btnSetPermission: (row) => {
            this.$refs.permissionWindow.open(row.id)
          },
          btnRemoveAll: () => {
            this.$confirm(`是否解除该角色下的所有客户端关联？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.clientGroup.disassociationClientsForGroup({
                groupId: this.subQuery.groupId
              }).then(() => {
                this.$message({
                  message: '解除成功!',
                  type: 'success'
                })
                this.getSubData()
              })
            }).catch(() => {
            })
          },
          btnRemove: () => {
            this.$confirm(`是否解除关联: ${row.username} ？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.clientGroup.disassociationClientsForGroup({
                groupId: this.subQuery.groupId,
                clientIds: [row.id]
              }).then(() => {
                this.$message({
                  message: '解除成功!',
                  type: 'success'
                })
                this.getSubData()
              })
            }).catch(() => {
            })
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, row)
        }
      },
      getData() {
        api.clientGroup.paged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      getSubData() {
        api.client.paged(this.subQuery).then(data => {
          this.subTableOptions.data = data.records
          this.subTableOptions.total = data.total
        })
      }
    },
    mounted() {
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getData()
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-box
  height: 100%
  display: flex
  flex-direction: column
  .table-title
    font-size: 15px
    padding: 10px 0 10px 20px
</style>

