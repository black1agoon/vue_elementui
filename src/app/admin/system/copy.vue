<template>
  <eui-layout :regions="REGIONS">
    <main-toolbar slot="north"
                  :buttons="buttons"
                  @click="onBtnClick">
    </main-toolbar>
    <eui-tree  slot="west" :options="treeOptions">
    </eui-tree>
    <div slot="center" class="center">
      <el-form class="form" ref="form" :model="formdata" label-width="80px" :rules="rules">
        <el-col :sm="6" v-for="(item, index) in FORMDATA" :key="index">
          <el-form-item :label="item.name" :prop="item.value">
            <div class="item">
              <eui-input v-model="formdata[item.value]"
                         :type="item.type"
                         :disabled="!editflag"
                         :multiple="item.multiple"
                         :placeholder="item.placeholder"
                         :readonly="item.readonly"
                         :suffixIcon="item.suffixIcon"
                         :options="formOptions[item.value]">
              </eui-input>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="form-btns" v-show="editflag">
        <el-button type="primary" size="mini" @click="submitForm">保存</el-button>
        <el-button type="danger" @click="cancelForm" size="mini">放弃</el-button>
        <el-button @click="resetForm" size="mini">重置</el-button>
      </div>
    </div>
  </eui-layout>
</template>

<script>
  import api from '@/api'
  import helper from '@/app/app.helpers'
  import TabPane from '@/components/views/TabPane'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiInput from '@/components/common/form/EuiInput'
  import EuiTree from '@/components/common/form/EuiTree'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import utils from '@/app/app.utils'
  const FORMDATA = [
    {
      name: '名称',
      value: 'name'
    }, {
      name: '备注',
      value: 'memo'
    }, {
      name: '排序',
      value: 'seq',
      type: 'number'
    }, {
      name: '类型',
      value: 'resourceType',
      type: 'select'
    }, {
      name: '权限',
      value: 'permission'
    }, {
      name: '上级菜单',
      value: 'pid',
      type: 'treeselect'
    }, {
      name: 'URL',
      value: 'url'
    }, {
      name: '终端',
      value: 'channel',
      type: 'select'
    }, {
      name: '键名',
      value: 'btnKey'
    }, {
      name: '图标',
      value: 'logo'
    }
  ]
  const INFO = {
    name: null, // 名称
    memo: null, // 备注
    url: null, // URL
    seq: null, // 排序
    pid: null, // 上级菜单
    resourceType: null, // 类型
    logo: null, // 图标
    btnKey: null, // 键名
    channel: 0, // 使用渠道
    permission: null // 权限
  }
  const REGIONS = {
    north: {},
    middle: {
      west: {
        style: {
          width: '250px'
        }
      },
      center: {}
    }
  }
  export default {
    name: 'menu-controller',
    _meta: {
      path: 'menu/controller',
      title: '菜单管理'
    },
    mixins: [TabPane],
    components: {
      EuiInput,
      MainToolbar,
      EuiTree,
      EuiLayout
    },
    data() {
      return {
        REGIONS,
        buttons: helper.getMainButtons(),
        FORMDATA,
        editflag: false,
        treeOptions: {
          data: [],
          // defaultExpandAll: true,
          defaultExpandedKeys: [],
          expandOnClickNode: false,
          nodeClick: (data, node, vnode) => {
            if (this.editflag) {
              utils.confirm('是否放弃编辑?', this.cancelForm)
            } else {
              this.treeOptions.defaultExpandedKeys = [data.id]
              api.permission.getPermission(data.id).then(data => {
                this.formdata = JSON.parse(JSON.stringify(data))
              })
            }
          }
        },
        formdata: JSON.parse(JSON.stringify(INFO)),
        formOptions: {
          resourceType: [{
            value: '0',
            label: '文件夹'
          }, {
            value: '1',
            label: '页面'
          }, {
            value: '2',
            label: '按钮'
          }, {
            value: '3',
            label: '权限'
          }, {
            value: '9',
            label: '子系统'
          }],
          channel: [{
            value: 0,
            label: 'PC端'
          }, {
            value: 1,
            label: 'APP端'
          }],
          pid: []
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          resourceType: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],
          permission: [
            {required: true, message: '请输入权限', trigger: 'blur'}
          ],
          pid: [
            {required: true, message: '请选择父级', trigger: 'change'}
          ],
          url: [
            {required: true, message: '请输入URL', trigger: 'blur'}
          ],
          channel: [
            {required: true, message: '请选择终端', trigger: 'change'}
          ],
          btnKey: [
            {required: true, message: '请输入键名', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getData() {
        api.permission.getAllPermissionTree().then((data) => {
          this.treeOptions.data = helper.getTreeData(data['permissionList'], 'childUserPermission', 'name')
          this.treeOptions.defaultExpandedKeys = this.getDefaultExpandedKeys(this.treeOptions.data)
          this.formOptions.pid = [{
            id: '0',
            label: '根目录',
            children: helper.getTreeData(data['permissionList'], 'childUserPermission', 'name')
          }]
        })
      },
      onBtnClick(btnKey) {
        let btnHandlers = {
          btnAdd: () => {
            this.editflag = true
            let pid = ['0', '1', '9'].some(v => v === this.formdata.resourceType) ? this.formdata.id || '0' : this.formdata.pid
            this.formdata = Object.assign({}, INFO, {pid})
          },
          btnEdit: () => {
            if (this.formdata.id) {
              this.editflag = true
            } else {
              this.$message({
                message: '请先选择要编辑的菜单!',
                type: 'warning'
              })
            }
          },
          btnDelete: () => {
            if (this.formdata.id) {
              this.$confirm(`是否删除:${this.formdata.name}？`, '提示', {
                iconClass: 'fa fa-question-circle'
              })
                .then(() => {
                  api.permission.deletePermission(this.formdata.id).then(() => {
                    this.$message({
                      message: '删除成功!',
                      type: 'success'
                    })
                    let fullpath = utils.getTreePathByKey(this.formdata.id, 'id', this.treeOptions.data)
                    this.treeOptions.defaultExpandedKeys = [fullpath[fullpath.length - 2]]
                    this.getData()
                  })
                })
                .catch(() => {
                })
            } else {
              this.$message({
                message: '请先选择要删除的菜单!',
                type: 'warning'
              })
            }
          },
          btnCopy: () => {
            this.editflag = true
            let _currentMenuCopy = JSON.parse(JSON.stringify(this.formdata))
            if (_currentMenuCopy.hasOwnProperty('id')) {
              delete _currentMenuCopy.id
            }
            this.formdata = JSON.parse(JSON.stringify(_currentMenuCopy))
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this)
        }
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formdata.id) {
              api.permission.addPermission(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.cancelForm()
                this.getData()
              })
            } else {
              api.permission.updatePermission(this.formdata).then(() => {
                this.$message({
                  message: '编辑成功!',
                  type: 'success'
                })
                this.cancelForm()
                this.getData()
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm() {
        this.$refs.form.resetFields()
      },
      cancelForm() {
        this.editflag = false
        this.formdata = JSON.parse(JSON.stringify(INFO))
        this.$refs.form.resetFields()
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
  .form-btns
    display: block
    clear: both
    text-align: center

  .center
    box-sizing: border-box
    height: 100%
    padding: 20px
</style>

