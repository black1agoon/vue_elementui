<template>
  <eui-layout :regions="REGIONS">
    <main-toolbar
      slot="north"
      :buttons="helper.getMainFilterButtons(buttons)"
      @click="onBtnClick">
    </main-toolbar>
    <eui-table
      slot="center"
      ref="table"
      :options="tableOptions"
      @reloadTable="tableOptions.reload">
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="onBtnClick('btnPermission', scope.row)">
            <i class="btn-icon fa fa-gear"></i>配置权限</el-button>
          <el-button
              size="mini"
              type="text"
              @click="onBtnClick('btnRemoveAll', scope.row)">
            <i class="btn-icon fa fa-unlock"></i>解除全部关联</el-button>
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
    <eui-table
        slot="south"
        ref="table2"
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
    <eui-window ref="window"
                :options="windowOptions">
      <el-form class="form clearfix" ref="form" :model="formdata" label-width="100px" :rules="rules" style="padding: 20px">
        <el-col :sm="24" v-for="(item, index) in FORMDATA" :key="index">
          <el-form-item :label="item.name" :prop="item.value">
              <eui-input
                 v-model="formdata[item.value]"
                 :type="item.type"
                 :readonly="item.readonly"
                 :suffixIcon="item.suffixIcon"
                 :options="formOptions[item.value]"
                 :autosize="item.autosize">
              </eui-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="btns">
        <el-button type="primary" size="mini" @click="sure">确定</el-button>
        <el-button size="mini" @click="cancel">关闭</el-button>
      </div>
    </eui-window>
    <permission-window ref="permission">
    </permission-window>
  </eui-layout>
</template>

<script>
  import api from '@/api'
  import TabPane from '@/components/views/TabPane'
  import helper from '@/app/app.helpers'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiTable from '@/components/common/form/EuiTable'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiInput from '@/components/common/form/EuiInput'
  import PermissionWindow from './window/PermissionWindow'
  const REGIONS = {
    north: {},
    middle: {
      center: {
        style: {
          flex: 1
        }
      }
    },
    south: {
      style: {
        flex: 1
      }
    }
  }
  const FORMDATA = [
    {
      name: '角色名称',
      value: 'role'
    }, {
      name: '角色描述',
      value: 'description',
      type: 'textarea',
      autosize: {
        minRows: 6,
        maxRows: 6
      }
    }
  ]
  const INFO = {
    role: null,
    description: null,
    templateId: null
  }
  export default {
    name: 'role-controller',
    _meta: {
      path: 'role/controller',
      title: '角色管理'
    },
    mixins: [TabPane],
    components: {
      EuiTable,
      MainToolbar,
      EuiLayout,
      EuiWindow,
      EuiInput,
      PermissionWindow
    },
    data() {
      return {
        helper,
        buttons: helper.getMainButtons(),
        REGIONS,
        FORMDATA,
        formdata: {...INFO},
        formOptions: {},
        rules: {
          role: [{
            required: true, message: '请输入角色名称', trigger: ['blur', 'change']
          }]
        },
        query: {
          page: 1,
          pageSize: 10
        },
        query2: {
          page: 1,
          pageSize: 10,
          roleId: null
        },
        windowOptions: {
          title: '角色信息',
          width: '25%'
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'role', label: '角色名称', width: 400, fixed: true},
            {prop: 'description', label: '角色描述', width: 400, fixed: true}
          ],
          rowClick: (row, event, column) => {
            this.formdata = JSON.parse(JSON.stringify(row))
            this.query2.roleId = row.id
            this.getRoleUserData()
          },
          rowDblclick: (row, event) => {
            this.$refs.window.open()
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData(this.query)
          }
        },
        tableOptions2: {
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
            this.query2.page = name === 'page' ? val : this.query2.page
            this.query2.pageSize = name === 'pageSize' ? val : this.query2.pageSize
            this.getRoleUserData()
          }
        }
      }
    },
    methods: {
      getData() {
        api.role.getPaged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      getRoleUserData() {
        api.user.getPaged(this.query2).then(data => {
          this.tableOptions2.data = data.records
          this.tableOptions2.total = data.total
        })
      },
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.formdata = JSON.parse(JSON.stringify(INFO))
            this.$refs.window.open()
          },
          btnEdit: (row) => {
            this.formdata = JSON.parse(JSON.stringify(row))
            this.$refs.window.open()
          },
          btnDelete: (row) => {
            this.$confirm(`是否删除:${row.role}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.role.deleteRole(row.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData()
              })
            })
            .catch(() => {
            })
          },
          btnRemoveAll: () => {
            this.$confirm(`是否解除该角色下的所有用户关联？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.role.disassociationUserForRole({
                roleId: this.query2.roleId
              }).then(() => {
                this.$message({
                  message: '解除成功!',
                  type: 'success'
                })
                this.getRoleUserData()
              })
            }).catch(() => {
            })
          },
          btnRemove: () => {
            this.$confirm(`是否解除关联: ${row.username} ？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.role.disassociationUserForRole({
                roleId: this.query2.roleId,
                userIds: [row.id]
              }).then(() => {
                this.$message({
                  message: '解除成功!',
                  type: 'success'
                })
                this.getRoleUserData()
              })
            }).catch(() => {
            })
          },
          btnPermission: (row) => {
            this.$refs.permission.open(row.id)
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, row)
        }
      },
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formdata.id) {
              api.role.addRole(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.getData(this.query)
                this.$refs.window.cancel()
              })
            } else {
              api.role.updateRole(this.formdata).then(() => {
                this.$message({
                  message: '编辑成功!',
                  type: 'success'
                })
                this.getData(this.query)
                this.$refs.window.cancel()
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      cancel() {
        this.$refs.window.cancel()
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .west
    padding: 0 !important
  /deep/ .el-dialog__body
    padding: 0
  .el-tabs--border-card
    box-shadow: none
    border-right: none

</style>

