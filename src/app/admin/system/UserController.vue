<template>
  <div>
    <eui-layout :regions="REGIONS">
      <main-toolbar
        slot="north"
        :buttons="helper.getMainFilterButtons(buttons, tableButtons)"
        @click="onBtnClick">
        <div class="table-handle">
          <div class="chosen">
            已选{{tableRowsSelect.length}}位员工
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
              ref="search"
              v-model="query"
              :options="searchOptions"
              @search="superSearch"
              slot="right"
              style="margin-right: 35px;float: right">
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
        <el-table-column label="操作" width="200" align="center" fixed="right">
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
      <eui-window ref="window" :options="windowOptions" :handleClose="getHandleClose">
        <el-tabs type="card" v-model="windowTabOpen">
          <el-tab-pane label="基本信息" name="first">
            <el-form class="form clearfix" ref="form" :model="formdata" label-width="80px" :rules="rules">
              <el-col :sm="item.sm || 8" v-for="(item, index) in FORMDATA" :key="index">
                <el-form-item :label="item.name" :prop="item.value">
                  <div class="item">
                    <div class="explain"></div>
                    <div class="input">
                      <eui-input v-if="item.value === 'username'"
                                 :disabled="!!formdata.id"
                                 v-model="formdata[item.value]">
                      </eui-input>
                      <eui-input v-else-if="item.value === 'realname'"
                                 v-model="formdata[item.value]"
                                 @change="formOptions[item.value].change()">
                      </eui-input>
                      <div v-else-if="item.value === 'avatar'" style="width: 100%;padding-bottom: 100%">
                        <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :http-request="formOptions.avatar.uploadFile"
                            :before-upload="formOptions.avatar.beforeAvatarUpload">
                          <img v-if="helper.getImgUrl(formdata.avatar)" :src="helper.getImgUrl(formdata.avatar)"
                               class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </div>
                      <eui-input
                      v-else
                      v-model="formdata[item.value]"
                      :type="item.type"
                      :readonly="item.readonly"
                      :suffixIcon="item.suffixIcon"
                      :options="formOptions[item.value]"
                      :autosize="item.autosize">
                  </eui-input>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="角色信息" name="second">
            <el-checkbox-group v-model="role.checkedList">
              <el-checkbox
                v-for="(role, index) in role.list"
                :label="role.id"
                :key="index">{{role.role}}
              </el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
        <div slot="btns">
          <el-button type="primary" size="mini" @click="sure">确定</el-button>
          <el-button size="mini" @click="cancel">关闭</el-button>
        </div>
      </eui-window>
      <multiple-user-select-window ref="multiple">
      </multiple-user-select-window>
    </eui-layout>
  </div>
</template>

<script>
  import api from '@/api'
  import utils from '@/app/app.utils'
  import TabPane from '@/components/views/TabPane'
  import helper from '@/app/app.helpers'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiTable from '@/components/common/form/EuiTable'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import EuiTree from '@/components/common/form/EuiTree'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiInput from '@/components/common/form/EuiInput'
  import {getZwToPy} from '@/assets/plugins/zw-to-py.js'
  import SuperSearch from '@/components/common/tools/SuperSearch'
  import MultipleUserSelectWindow from './window/MultipleUserSelectWindow'
  const REGIONS = {
    north: {},
    middle: {
      center: {
        style: {
          flex: 1
        }
      },
      west: {}
    }
  }
  const FORMDATA = [
    {
      name: '工号',
      value: 'username'
    }, {
      name: '姓名',
      value: 'realname'
    }, {
      name: '拼音码',
      value: 'hotkey'
    }, {
      name: '头像',
      value: 'avatar'
    }, {
      name: '部门',
      value: 'depId',
      type: 'treeselect'
    }, {
      name: '性别',
      value: 'sex',
      type: 'select'
    }, {
      name: '手机号码',
      value: 'mobile',
      type: 'number'
    }, {
      name: '联系电话',
      value: 'contactTel',
      type: 'number'
    }, {
      name: '生日',
      value: 'birthday',
      type: 'date'
    }, {
      name: '身份证',
      value: 'idCard'
    }, {
      name: '入职时间',
      value: 'entryTime',
      type: 'datetime'
    }, {
      name: '邮箱',
      value: 'email'
    }, {
      name: '职称',
      value: 'graduate'
    }, {
      name: '地址',
      value: 'address',
      sm: 16,
      type: 'textarea'
    }, {
      name: '备注',
      value: 'memo',
      sm: 24,
      type: 'textarea'
    }
  ]
  const INFO = {
    avatar: null,
    username: null,  // 用户名
    hotkey: null, //
    realname: null, // 真实姓名
    depId: null, // 所属部门
    departmentName: null,
    sex: null, // 性别
    mobile: null, // 手机号码
    contactTel: null, // 联系电话
    birthday: null, // 生日
    entryTime: null, // 入职时间
    email: null, // 邮箱
    graduate: null, // 学位
    enabled: 1, // 是否1：启动，0：禁用
    idCard: null, // 身份证号码
    memo: null, // 备注
    address: null // 地址
  }
  export default {
    name: 'user-controller',
    _meta: {
      path: 'user/controller',
      title: '用户管理'
    },
    mixins: [TabPane],
    components: {
      EuiTable,
      MainToolbar,
      EuiLayout,
      EuiTree,
      EuiWindow,
      EuiInput,
      SuperSearch,
      MultipleUserSelectWindow
    },
    data() {
      return {
        helper,
        buttons: helper.getMainButtons(),
        tableButtons: ['btnResetPwd'],
        REGIONS,
        FORMDATA,
        tableRowsSelect: [],
        tags: [],
        windowTabOpen: 'first',
        formdata: JSON.parse(JSON.stringify(INFO)),
        formdataCopy: JSON.parse(JSON.stringify(INFO)),
        formOptions: {
          sex: [],
          depId: [],
          realname: {
            change: () => {
              this.formdata.hotkey = getZwToPy(this.formdata.realname)[0]  // 有多音字 取第一个
            }
          },
          avatar: {
            uploadFile: (params) => {
              api.public.uploadAvatar(params.file).then(data => {
                this.formdata.avatar = data.path
              })
            },
            beforeAvatarUpload: (file) => {
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
              }
              return isLt2M
            }
          }
        },
        searchOptions: {
          width: 500,
          fieldSearch: {
            username: {
              placeholder: '工号',
              sm: 8
            },
            realname: {
              placeholder: '真实姓名',
              sm: 8
            },
            mobile: {
              placeholder: '手机号码',
              sm: 8
            }
          },
          conditionSearch: {
            depId: {
              placeholder: '请选择部门',
              type: 'treeselect',
              options: [],
              sm: 8
            },
            sex: {
              placeholder: '请选择性别',
              type: 'select',
              options: [],
              sm: 8
            },
            roleId: {
              placeholder: '请选择角色',
              type: 'select',
              options: [],
              sm: 8
            }
          }
        },
        rules: {
          username: [{
            required: true, message: '请输入工号', trigger: ['blur', 'change']
          }, {
            min: 4, message: '工号长度至少为4位', trigger: ['blur', 'change']
          }],
          realname: [{
            required: true, message: '请输入姓名', trigger: ['blur', 'change']
          }],
          departmentName: [{
            required: true, message: '请选择部门', trigger: 'change'
          }],
          email: [
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          mobile: [
            {required: true, message: '请输入手机号码', trigger: ['blur', 'change']},
            {
              validator: (rule, value, callback) => {
                if (/^1[34578]\d{9}$/.test(value) === false && value) {
                  callback(new Error('请输入正确的手机号'))
                } else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            }],
          idCard: [{
            validator: (rule, value, callback) => {
              if (/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(value) === false && value) {
                callback(new Error('请输入正确的身份证号码'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'change']
          }]
        },
        query: {
          page: 1,
          pageSize: 10,
          mobile: null,
          realname: null,
          sex: null,
          username: null,
          depId: null,
          roleId: null
        },
        role: {
          list: [],
          checkedList: [],
          checkedCopyList: []
        },
        windowOptions: {
          title: '用户信息'
        },
        treeOptions: {
          data: [],
          defaultExpandAll: true,
          nodeClick: (data, node, vnode) => {
            this.query.page = 1
            this.query.depId = data.id
            this.query.departmentName = data.label
            this.getData(this.query)
          }
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
          rowClick: (row, event, column) => {
          },
          rowDblclick: (row, event) => {
            api.user.getUser(row.id).then(data => {
              this.$refs.window.open()
              this.$nextTick(() => {
                this.initForm('btnEdit', data)
              })
            })
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData(this.query)
          },
          handleSelectionChange: val => {
            this.tableRowsSelect = val.map(v => v.id)
          }
        }
      }
    },
    computed: {
      getHandleClose() {
        // console.log(this.formdata)
        // console.log(this.formdataCopy)
        return utils.isChanged(this.formdata, this.formdataCopy)
      }
    },
    methods: {
      changeAble(index, row) {
        if (row.enabled === 1) {
          api.user.disableUser({
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
          api.user.enableUser({
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
        api.user.getPaged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      getTreeData() {
        api.department.getTree().then((data) => {
          this.treeOptions.data = this.formOptions.depId = this.searchOptions.conditionSearch.depId.options = helper.getTreeData(data, 'childDepartmentDtoList', 'name')
        })
      },
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.$refs.window.open()
            this.$nextTick(() => {
              this.initForm(btnKey)
            })
            // this.$refs.multiple.open()
          },
          btnEdit: (row) => {
            this.formdata = JSON.parse(JSON.stringify(row))
            api.user.getUser(this.formdata.id).then(data => {
              this.$refs.window.open()
              this.$nextTick(() => {
                this.initForm(btnKey, data)
              })
            })
          },
          btnDelete: (row) => {
            this.formdata = JSON.parse(JSON.stringify(row))
            this.$confirm(`是否删除:${this.formdata.username}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.user.delete(this.formdata.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData(this.query)
              })
            }).catch(() => {
            })
          },
          btnResetPwd: (row) => {
            this.$confirm(`是否重置:${row.username}的密码？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.user.resetPassword(row.id).then(() => {
                this.$message({
                  message: '重置成功!',
                  type: 'success'
                })
                // this.getData(this.query)
              })
            }).catch(() => {
            })
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
          api.user.delete(this.tableRowsSelect).then(() => {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.getData(this.query)
          })
        }).catch(() => {
        })
      },
      thendoing(msg) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.getData(this.query)
        this.$refs.window.cancel()
      },
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.formdataCopy = JSON.parse(JSON.stringify(this.formdata))
            if (!this.formdata.id) {
              api.user.addUser(this.formdata).then((data) => {
                if (this.role.checkedList.sort().toString() !== this.role.checkedCopyList.sort().toString()) {
                  api.role.setUserRoles({
                    roleIdList: this.role.checkedList,
                    userId: data.userId
                  }).then(() => {
                    this.thendoing('新增成功!')
                  })
                } else {
                  this.thendoing('新增成功!')
                }
              })
            } else {
              api.user.updateUser(this.formdata).then(() => {
                if (this.role.checkedList.sort().toString() !== this.role.checkedCopyList.sort().toString()) {
                  api.role.setUserRoles({
                    roleIdList: this.role.checkedList,
                    userId: this.formdata.id
                  }).then(() => {
                    this.thendoing('编辑成功!')
                  })
                } else {
                  this.thendoing('编辑成功!')
                }
              })
            }
          } else {
            this.$message({
              type: 'warning',
              message: '请将信息填写完整!'
            })
            return false
          }
        })
      },
      cancel() {
        this.$refs.window.cancel()
      },
      initForm(key, data) {
        this.windowTabOpen = 'first'
        this.$refs.form.resetFields()
        if (key === 'btnAdd') {
          this.formdata = {...INFO}
          this.formdataCopy = {...INFO}
          this.formdata.depId = this.query.depId
          this.formdataCopy.depId = this.query.depId
          this.role.checkedList = []
          this.role.checkedCopyList = []
        } else if (key === 'btnEdit') {
          this.formdata = JSON.parse(JSON.stringify(data.user))
          this.formdataCopy = JSON.parse(JSON.stringify(data.user))
          this.role.checkedList = JSON.parse(JSON.stringify(data.roleList.map(r => r.id)))
          this.role.checkedCopyList = JSON.parse(JSON.stringify(data.roleList.map(r => r.id)))
        }
      },
      getRolesData() {
        api.role.getPaged({
          page: 1,
          pageSize: 999
        }).then(data => {
          this.role.list = data.records
          this.searchOptions.conditionSearch.roleId.options = data.records.map(d => ({
            label: d.role,
            value: d.id
          }))
        })
      },
      getInputData() {
        api.dictionary.getValuePaged({
          attrCode: '0001',
          page: 1,
          pageSize: 999
        }).then(data => {
          this.formOptions.sex = this.searchOptions.conditionSearch.sex.options = data.records.map(d => ({
            label: d.name,
            value: d.code
          }))
        })
      },
      superSearch(searchinfo) {
        this.query.page = 1
        for (let key in searchinfo) {
          this.query[key] = searchinfo[key]
        }
        this.getData()
      }
    },
    mounted() {
      this.getData()
      this.getTreeData()
      this.getInputData()
      this.getRolesData()
    },
    watch: {
    }
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

  .avatar-uploader
    width: 100%
    height: 100%
    position: absolute
    /deep/ .el-upload
      width: 100%
      height: 100%
      .avatar-uploader-icon
        width: 100%
        height: 100%
        line-height: 0
      .el-icon-plus:before
        position: absolute
        top: 50%
        left: 50%
        transform: translateX(-50%) translateY(-50%)

  .avatar
    width: 100%
    height: 100%

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
