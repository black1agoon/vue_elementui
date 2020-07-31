<template>
  <div>
    <eui-layout :regions="regions">
      <main-toolbar
          slot="north"
          :buttons="helper.getMainFilterButtons(buttons, tableButtons)"
          @click="onBtnClick">
        <div class="table-handle">
          <div class="chosen">
            已选{{tableRowsSelect.length}}位用户
          </div>
          <el-dropdown class="batch-operation">
            <el-button type="primary" size="mini" round :disabled="tableRowsSelect.length === 0">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="batchDelete">批量删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <super-search
              :options="searchOptions"
              slot="right"
              v-model="query"
              @search="superSearch"
              style="flex: 1;margin-right: 35px">
          </super-search>
        </div>
      </main-toolbar>
      <eui-tree
          slot="west"
          :options="treeOptions">
      </eui-tree>
      <eui-table
          slot="center"
          ref="table"
          :showIndex="false"
          :showSelection="true"
          :options="tableOptions">
        <el-table-column label="是否启用" align="center" fixed="right">
          <template slot-scope="scope">
            <!--<el-switch v-model="scope.row.enabled">-->
            <!--</el-switch>-->
            <el-switch :value="Boolean(scope.row.enabled)"
                       @change="changeAble(scope.$index,scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center" fixed="right">
          <template slot-scope="scope">
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
      <client-window ref="window"
                     :input-options="inputOptions"
                     :group-list="groupList" @reload="getData">
      </client-window>
    </eui-layout>
  </div>
</template>

<script>
  import api from '@/api'
  import TabPane from '@/components/views/TabPane'
  import helper from '@/app/app.helpers'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiTable from '@/components/common/form/EuiTable'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import SuperSearch from '@/components/common/tools/SuperSearch'
  import {CLIENT} from './client.config'
  import ClientWindow from './window/ClientWindow'
  import EuiTree from '@/components/common/form/EuiTree'

  export default {
    name: 'client-controller',
    _meta: {
      path: '/client/controller',
      title: '客户端'
    },
    mixins: [TabPane],
    components: {
      EuiTable,
      MainToolbar,
      EuiLayout,
      SuperSearch,
      ClientWindow,
      EuiTree
    },
    data() {
      return {
        helper,
        buttons: helper.getMainButtons(),
        tableButtons: ['btnResetPwd', 'btnCopy'],
        regions: CLIENT.REGIONS,
        tableRowsSelect: [],
        searchOptions: {
          width: 500,
          fieldSearch: {
            username: {
              placeholder: '客户端ID',
              sm: 8
            },
            name: {
              placeholder: '客户端名称',
              sm: 8
            },
            mobile: {
              placeholder: '手机号码',
              sm: 8
            }
          },
          conditionSearch: {
            groupId: {
              placeholder: '请选择角色',
              type: 'select',
              options: [],
              sm: 8
            },
            clientPieceId: {
              placeholder: '请选择分组',
              type: 'treeselect',
              options: [],
              sm: 8
            }
          }
        },
        query: {
          page: 1,
          pageSize: 10,
          mobile: null,
          username: null,
          groupId: null,
          name: null,
          clientPieceId: null
        },
        groupList: [],
        windowOptions: {
          title: '用户信息'
        },
        treeOptions: {
          data: [],
          expandOnClickNode: false,
          defaultExpandAll: true,
          nodeClick: (data, node, vnode) => {
            this.query.clientPieceId = data.id
            this.getData()
          }
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'name', label: '客户端名称', minWidth: 100, fixed: true},
            {prop: 'username', label: '客户端ID', minWidth: 100},
            {prop: 'password', label: '秘钥', minWidth: 200},
            {prop: 'email', label: '邮箱', minWidth: 100},
            {prop: 'mobile', label: '手机号', minWidth: 100},
            {prop: 'memo', label: '备注', minWidth: 100},
            {prop: 'createTime', label: '创建时间', minWidth: 100}
          ],
          rowClick: (row, event, column) => {
          },
          rowDblclick: (row, event) => {
            this.$refs.window.open(row)
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData()
          },
          handleSelectionChange: val => {
            this.tableRowsSelect = val.map(v => v.id)
          }
        },
        inputOptions: {
          clientPieceId: []
        }
      }
    },
    methods: {
      changeAble(index, row) {
        if (row.enabled === 1) {
          api.client.disable({
            idList: [row.id]
          }).then(() => {
            row.enabled = 0
            this.$notify({
              title: '',
              message: '禁用成功',
              type: 'success'
            })
          })
        } else {
          api.client.enable({
            idList: [row.id]
          }).then(() => {
            row.enabled = 1
            this.$notify({
              title: '',
              message: '启用成功',
              type: 'success'
            })
          })
        }
      },
      getData() {
        api.client.paged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.$refs.window.open()
          },
          btnEdit: (row) => {
            this.$refs.window.open(row)
          },
          btnDelete: (row) => {
            this.$confirm(`是否删除:${row.username}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.client.delete(row.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData()
              })
            }).catch(() => {
            })
          },
          btnResetPwd: (row) => {
            this.$confirm(`是否重置:${row.username}的秘钥？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.client.updatePassword(row.id).then(() => {
                this.$message({
                  message: '重置成功!',
                  type: 'success'
                })
              })
            }).catch(() => {
            })
          },
          btnCopy: (row) => {
            let inputTest = document.createElement('input')
            inputTest.value = `${row.username}//${row.password}`
            document.body.appendChild(inputTest)
            inputTest.select()
            try {
              //进行复制到剪切板
              if (document.execCommand('Copy', 'false', null)) {
                //如果复制成功
                this.$message({
                  message: '复制成功!',
                  type: 'success'
                })
              } else {
                //如果复制失败
                this.$message({
                  message: '复制失败!',
                  type: 'error'
                })
              }
            } catch (err) {
              //如果报错
              this.$message({
                message: '复制失败!',
                type: 'error'
              })
            }
            inputTest.remove()
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, row)
        }
      },
      batchDelete() {
        this.$confirm(`是否批量删除选中项？`, '提示', {
          iconClass: 'fa fa-question-circle'
        }).then(() => {
          api.client.delete(this.tableRowsSelect).then(() => {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.getData()
          })
        }).catch(() => {
        })
      },
      getGroupData() {
        api.clientGroup.paged({
          page: 1,
          pageSize: 999
        }).then(data => {
          this.groupList = data.records
          this.searchOptions.conditionSearch.groupId.options = data.records.map(d => ({
            label: d.name,
            value: d.id
          }))
        })
      },
      getTreeData() {
        api.clientPiece.groupTree().then((data) => {
          this.treeOptions.data = this.inputOptions.clientPieceId = this.searchOptions.conditionSearch.clientPieceId.options = helper.getTreeData(data ? [data] : [], 'pieceList', 'name')
        })
      },
      superSearch(searchinfo) {
        this.query = {...searchinfo}
        this.getData()
      }
    }
    ,
    mounted() {
      this.getData()
      this.getGroupData()
      this.getTreeData()
    }
    ,
    watch: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .el-dialog__body
    padding: 0
    overflow: hidden

  /deep/ .el-tabs__header
    margin: 0

  /deep/ .el-tabs__content
    padding: 20px

  .el-checkbox
    line-height: 28px
    width: 150px
    &:first-child
      margin-left: 30px

  .table-handle
    position: absolute
    right: 0
    top: 0
    display: flex
    .chosen
      width: 100px
      font-size: 12px
      color: #555555
    .chosen, .batch-operation
      flex: 1
      margin-right: 35px
</style>
<style>
</style>
