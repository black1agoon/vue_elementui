<template>
  <eui-window ref="window" :options="windowOptions">
    <eui-table
      ref="table"
      :options="tableOptions">
    </eui-table>
  </eui-window>
</template>

<script>
  import api from '@/api'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiTable from '@/components/common/form/EuiTable'
  export default {
    name: 'role-user-window',
    components: {
      EuiWindow,
      EuiTable
    },
    data() {
      return {
        query: {
          page: 1,
          pageSize: 10,
          roleId: null
        },
        checkedNode: {},
        windowOptions: {
          title: '关联人员名单'
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'username', label: '工号', width: 150, fixed: true},
            {prop: 'realname', label: '姓名', width: 150, fixed: true},
            {prop: 'departmentName', label: '部门', width: 150},
            {prop: 'sexName', label: '性别', width: 100},
            {prop: 'graduate', label: '职称', width: 150},
            {prop: 'idCard', label: '身份证', minWidth: 150},
            {prop: 'birthday', label: '生日', width: 150},
            {prop: 'email', label: '邮箱', width: 150},
            {prop: 'mobile', label: '手机号', minWidth: 150}
          ],
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData(this.query)
          }
        }
      }
    },
    methods: {
      getData(query) {
        api.user.getPaged(query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      open(roleId) {
        this.$refs.window.open()
        this.query.roleId = roleId
        this.getData(this.query)
      }
    },
    mounted() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .el-dialog
    height: 600px

  /deep/ .el-dialog__body
    padding: 0 20px
    height: calc(100% - 45px)
    overflow-y: auto
</style>
