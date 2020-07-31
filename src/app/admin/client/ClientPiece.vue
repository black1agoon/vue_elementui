<template>
  <div>
    <eui-layout :regions="regions">
      <main-toolbar
          slot="north"
          :buttons="helper.getMainFilterButtons(buttons)"
          @click="onBtnClick">
      </main-toolbar>
      <eui-tree
          slot="west"
          :options="treeOptions">
      </eui-tree>
      <eui-table
          slot="center"
          ref="table"
          :options="tableOptions"
          @reloadTable="tableOptions.reload">
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
                v-for="(btn, index) in helper.getTableButtons(buttons)"
                size="mini"
                type="text"
                :key="index"
                @click="onBtnClick(btn.btnKey, scope.row)">
              <i :class="['btn-icon fa', btn.logo]"></i>{{btn.name}}
            </el-button>
          </template>
        </el-table-column>
      </eui-table>
    </eui-layout>
    <client-piece-window ref="window"
                         :input-options="inputOptions"
                         @reload="reload">
    </client-piece-window>
  </div>
</template>

<script>
  import api from '@/api'
  import TabPane from '@/components/views/TabPane'
  import helper from '@/app/app.helpers'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiTable from '@/components/common/form/EuiTable'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import EuiTree from '@/components/common/form/EuiTree'
  import {PIECE} from './client.config'
  import ClientPieceWindow from './window/ClientPieceWindow'
  export default {
    name: 'client-piece',
    _meta: {
      path: '/client/piece',
      title: '客户端分组'
    },
    mixins: [TabPane],
    components: {
      EuiTable,
      MainToolbar,
      EuiLayout,
      EuiTree,
      ClientPieceWindow
    },
    data() {
      return {
        helper,
        buttons: helper.getMainButtons(),
        regions: PIECE.REGIONS,
        query: {
          id: 0,
          page: 1,
          pageSize: 10
        },
        inputOptions: {
          pid: []
        },
        pid: 0,
        treeOptions: {
          data: [],
          expandOnClickNode: false,
          defaultExpandAll: true,
          nodeClick: (data, node, vnode) => {
            this.query.id = data.id
            this.pid = data.id
            this.getData()
          }
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'name', label: '名称', minWidth: 200},
            {prop: 'seq', label: '排序', minWidth: 100, sortable: true},
            {prop: 'pidName', label: '上级', minWidth: 200},
            {prop: 'memo', label: '备注', minWidth: 200}
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
          }
        }
      }
    },
    computed: {},
    methods: {
      getData() {
        api.clientPiece.paged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      getTreeData() {
        api.clientPiece.groupTree().then((data) => {
          this.treeOptions.data = this.inputOptions.pid = helper.getTreeData(data ? [data] : [], 'pieceList', 'name')
        })
      },
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.$refs.window.open({pid: this.pid})
          },
          btnEdit: (row) => {
            this.$refs.window.open(row)
          },
          btnDelete: (row) => {
            this.$confirm(`是否删除:${row.name}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.clientPiece.delete(row.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData()
                this.getTreeData()
              })
            }).catch(() => {
            })
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, row)
        }
      },
      reload() {
        this.getData()
        this.getTreeData()
      }
    },
    created() {
    },
    mounted() {
      this.getData()
      this.getTreeData()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .el-dialog__body
    padding: 0
    overflow: visible !important
</style>
