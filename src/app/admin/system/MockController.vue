<template>
  <eui-layout :regions="regions">
    <div class="button-wrapper" slot="north">
      <el-button type="primary" size="mini" @click="clickHandler('btnAdd')">新增</el-button>
    </div>
    <eui-table
        slot="center"
        ref="table"
        :highlight-current-row="true"
        :options="tableOptions">
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <template v-for="(btn, index) in tableButtons">
            <el-button
                size="mini"
                type="text"
                :key="index"
                @click="clickHandler(btn.btnKey, scope.row)">
              <i :class="['btn-icon fa', btn.icon]"></i>{{btn.name}}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </eui-table>
    <mock-window ref="window" @reload="getUserList">
    </mock-window>
  </eui-layout>
</template>

<script>
  import EuiTable from '@/components/common/form/EuiTable'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import {MOCK} from './system.config'
  import MockWindow from './window/MockWindow'
  import api from '@/api'
  export default {
    name: 'mock-controller',
    _meta: {
      path: '/mock',
      title: 'Mock test'
    },
    components: {
      EuiTable,
      EuiLayout,
      MockWindow
    },
    data() {
      return {
        regions: MOCK.regions,
        query: {
          page: 1,
          pageSize: 10
        },
        tableButtons: [
          {
            btnKey: 'btnEdit',
            name: '编辑',
            icon: 'fa-pencil'
          }, {
            btnKey: 'btnDelete',
            name: '删除',
            icon: 'fa-trash'
          }
        ],
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'name', label: '姓名', minWidth: 100},
            {prop: 'education', label: '学历', minWidth: 100},
            {prop: 'phone', label: '手机', minWidth: 100},
            {prop: 'profession', label: '职业', minWidth: 100},
            {prop: 'graduationschool', label: '毕业学校', minWidth: 100},
            {prop: 'email', label: '邮箱', minWidth: 100}
          ],
          rowClick: (row, event, column) => {
            this.formdata = JSON.parse(JSON.stringify(row))
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getUserList(this.query)
          }
        }
      }
    },
    methods: {
      getUserList() {
        api.mock.paged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      clickHandler(btnKey, data) {
        switch (btnKey) {
          case 'btnAdd':
            this.$refs.window.open()
            break
          case 'btnEdit':
            this.$refs.window.open(data)
            break
          case 'btnDelete':
            this.$confirm(`是否删除:${data.name}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.mock.deleteUser(data.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getUserList()
              })
            })
            break
        }
      }
    },
    mounted() {
      this.getUserList()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .button-wrapper
    padding: 0 10px
    line-height: 40px
</style>
