<template>
  <eui-layout :regions="REGIONS">
    <main-toolbar
      slot="north"
      :buttons="buttons"
      @click="onBtnClick">
    </main-toolbar>
    <eui-tree
      slot="west"
      :options="treeOptions">
    </eui-tree>
    <div slot="center" class="center">
      <el-form class="form" ref="form" :model="formdata" label-width="80px" :rules="rules">
        <el-col :sm="6" style="clear: both" v-for="(item, index) in FORMDATA" :key="index">
          <el-form-item :label="item.name" :prop="item.value">
            <eui-input v-model="formdata[item.value]"
                       :type="item.type"
                       :disabled="!editflag"
                       :readonly="item.readonly"
                       :suffixIcon="item.suffixIcon"
                       :options="formOptions[item.value]">
            </eui-input>
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
  const FORMDATA = [
    {
      name: '名称',
      value: 'name'
    }, {
      name: '备注',
      value: 'memo'
    }, {
      name: '排序',
      value: 'seq'
    }, {
      name: '上级菜单',
      value: 'pid',
      type: 'treeselect'
    }
  ]
  const INFO = {
    name: null, // 名称
    memo: null, // 备注
    seq: null, // 排序
    pid: null // 上级菜单
  }
  const REGIONS = {
    north: {},
    middle: {
      west: {},
      center: {}
    }
  }
  export default {
    name: 'department-controller',
    _meta: {
      path: 'department/controller',
      title: '部门管理'
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
        buttons: helper.getMainButtons(),
        REGIONS,
        FORMDATA,
        editflag: false,
        treeOptions: {
          data: [],
          defaultExpandAll: true,
          nodeClick: (data, node, vnode) => {
            if (this.editflag) {
              this.$confirm('是否放弃编辑？')
                .then(() => {
                  this.cancelForm()
                })
                .catch(() => {
                })
            } else {
              api.department.getDepartment(data.id).then(data => {
                this.formdata = {...data}
              })
            }
          }
        },
        formdata: {...INFO},
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
          }],
          channel: [{
            value: '0',
            label: 'PC端'
          }, {
            value: '1',
            label: 'APP端'
          }],
          pid: []
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          pid: [
            {required: true, message: '请选择父级', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      getData() {
        api.department.getTree().then((data) => {
          console.log(data)
          this.treeOptions.data = helper.getTreeData(data, 'childDepartmentDtoList', 'name')
          this.formOptions.pid = helper.getTreeData(data, 'childDepartmentDtoList', 'name')
        })
      },
      getTreeNoOwn(info) {
        api.department.getTreeNoOwn(info).then(data => {
          this.formOptions.pid = helper.getTreeData(data, 'childDepartmentDtoList', 'name')
        })
      },
      onBtnClick(btnKey) {
        let btnHandlers = {
          btnAdd: () => {
            this.editflag = true
            let pid = this.formdata.id ? this.formdata.pid : null
            this.formdata = Object.assign({}, INFO, {pid})
            this.getTreeNoOwn({})
          },
          btnEdit: () => {
            if (this.formdata.id) {
              this.editflag = true
              this.getTreeNoOwn({
                id: this.formdata.id
              })
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
                  api.department.deleteDepartment(this.formdata.id).then(() => {
                    this.$message({
                      message: '删除成功!',
                      type: 'success'
                    })
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
              api.department.addDepartment(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.cancelForm()
                this.getData()
              })
            } else {
              api.department.updateDepartment(this.formdata).then(() => {
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
      resetForm(formName) {
        this.$refs.form.resetFields()
      },
      cancelForm() {
        this.$refs.form.resetFields()
        this.editflag = false
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
    padding-top: 50px
  .center
    box-sizing: border-box
    padding: 20px
    height: 100%
</style>



