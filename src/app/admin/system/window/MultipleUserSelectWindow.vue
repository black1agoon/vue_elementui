<template>
  <eui-window ref="window"
              :options="windowOptions">
    <eui-layout :regions="regions">
      <eui-table class="table"
                 slot="center"
                 ref="table"
                 :showSelection="true"
                 :showIndex="false"
                 :highlight-current-row="false"
                 :options="tableOptions">
      </eui-table>
      <div slot="east" class="users">
        <div class="title">已选择员工{{multipleSelectionAll.length}}位</div>
        <div class="user"
             v-for="(user, index) in multipleSelectionAll"
             :key="index">
          {{user.realname}}
          <span class="close fa fa-close" @click="deleteUser(user.id)"></span>
        </div>
      </div>
    </eui-layout>
    <div slot="btns">
      <el-button type="primary" size="mini" @click="sure">确定</el-button>
      <el-button size="mini" @click="cancel">关闭</el-button>
    </div>
  </eui-window>
</template>

<script>
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiTable from '@/components/common/form/EuiTable'
  import api from '@/api'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  export default {
    name: 'multiple-user-select-window',
    components: {
      EuiWindow,
      EuiTable,
      EuiLayout
    },
    computed: {
    },
    data() {
      return {
        regions: {
          middle: {
            center: {},
            east: {
              style: {
                width: 200
              }
            }
          }
        },
        windowOptions: {
          title: '新增员工',
          width: '50%'
        },
        query: {
          page: 1,
          pageSize: 10
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'username', label: '工号', width: 100, fixed: true},
            {prop: 'realname', label: '姓名', width: 100, fixed: true},
            {prop: 'departmentName', label: '部门', width: 100},
            {prop: 'entryTime', label: '入职时间', width: 150},
            {prop: 'sexName', label: '性别', width: 100},
            {prop: 'graduate', label: '职称', width: 100},
            {prop: 'idCard', label: '身份证', minWidth: 100},
            {prop: 'birthday', label: '生日', width: 150},
            {prop: 'email', label: '邮箱', width: 100},
            {prop: 'mobile', label: '手机号', minWidth: 100}
          ],
          rowClassName: ({row, rowIndex}) => {
          },
          rowClick: (row, event, column) => {
            this.$refs.table.callByName('toggleRowSelection', row)
          },
          handleSelectionChange: val => {
            this.multipleSelection = val
            this.$nextTick(() => {
              this.changePageCoreRecordData()
            })
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData(this.query).then(() => {
              this.setSelectRow()
            })
          }
        },
        multipleSelectionAll: [],   // 所有选中的数据包含跨页数据
        multipleSelection: [],
      }
    },
    methods: {
      open() {
        this.getData().then(() => {
          this.$refs.window.open()
        })
      },
      sure() {
      },
      cancel() {
        this.$refs.window.cancel()
      },
      getData() {
        return api.user.getPaged(this.query).then(data => {
          if (data.records && data.records.length > 0) {
            this.tableOptions.data = data.records
            this.tableOptions.total = data.total
          } else {
            this.tableOptions.data = []
            this.tableOptions.total = data.total
          }
        })
      },
      changePageCoreRecordData() {
        let selectAllIds = []
        let selectIds = []
        let noSelectIds = []

        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row.id)      // ----------->获取<上一次><所有选中>的id,selectAllIds
        })

        this.multipleSelection.forEach(row => {
          selectIds.push(row.id)         // ----------->  所有<当前页选中>的id
          if (selectAllIds.indexOf(row.id) < 0) {    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
            this.multipleSelectionAll.push(row)
          }
        })

        this.tableOptions.data.forEach(row => {
          if (selectIds.indexOf(row.id) < 0) {
            noSelectIds.push(row.id)      // ------------>当前页所有table数据中 没选中的id
          }
        })
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < this.multipleSelectionAll.length; i++) {
              if (this.multipleSelectionAll[i].id === id) {   //  --------> 如果总选择中有未被选中的，那么就删除这条
                this.multipleSelectionAll.splice(i, 1)
                break
              }
            }
          }
        })
      },
      setSelectRow() {
        // if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        //   return
        // }
        let selectAllIds = []
        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row.id)
        })
        this.$refs.table.callByName('clearSelection')
        for (let i = 0; i < this.tableOptions.data.length; i++) {
          if (selectAllIds.indexOf(this.tableOptions.data[i].id) >= 0) {
            this.$refs.table.callByName('toggleRowSelection', this.tableOptions.data[i], true)
          }
        }
      },
      deleteUser(userid) {
        this.multipleSelectionAll = this.multipleSelectionAll.filter(user => user.id !== userid)
        this.setSelectRow()
      }
    },
    mounted() {
    },
    watch: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table
  height: 500px
.users
  width: 100%
  height: 100%
  border-left: 1px solid #eee
  padding: 10px
  box-sizing: border-box
  .title
    font-weight: bold
    border-bottom: 1px solid #eee
    padding-bottom: 5px
  .user
    margin: 5px 0
    .close
      cursor: pointer
      display: none
    &:hover
      .close
        display: inline-block
</style>