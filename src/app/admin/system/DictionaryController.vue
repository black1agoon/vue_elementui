<template>
  <eui-layout :regions="REGIONS">
    <div slot="north" class="flex-content">
      <main-toolbar
        :buttons="helper.getMainFilterButtons(buttons, tableButtons)"
        @click="onBtnClick">
      </main-toolbar>
      <eui-table
        ref="table"
        :options="tableOptions"
        :highlight-current-row="true"
        @reloadTable="tableOptions.reload">
        <el-table-column label="备注" align="center" minWidth="200" prop="memo">
        </el-table-column>
        <el-table-column label="操作" align="center" width="330" fixed="right">
          <template slot-scope="scope">
            <template v-for="(btn, index) in helper.getTableButtons(buttons, tableButtons)">
              <el-button
                size="mini"
                type="text"
                :key="index"
                @click="onBtnClick(btn.btnKey, scope.row)">
                <i :class="['btn-icon fa', btn.logo]"></i>{{btn.name}}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </eui-table>
    </div>
    <div slot="center" class="flex-content">
      <main-toolbar
        :buttons="helper.getMainFilterButtons(sub_buttons, sub_tableButtons)"
        @click="onBtnClick">
      </main-toolbar>
      <eui-table
        :options="tableOptions2"
        :highlight-current-row="true"
        @reloadTable="tableOptions2.reload">
        <el-table-column label="操作" align="center" width="330" fixed="right">
          <template slot-scope="scope">
            <template v-for="(btn, index) in helper.getTableButtons(sub_buttons, sub_tableButtons)">
              <el-button
                size="mini"
                type="text"
                :key="index"
                @click="onBtnClick(btn.btnKey, scope.row)">
                <i :class="['btn-icon fa', btn.logo]"></i>{{btn.name}}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </eui-table>
    </div>
    <eui-window ref="window"
                :options="windowOptions">
      <el-form class="form clearfix" ref="form" :model="formdata" label-width="50px" :rules="rules" style="padding: 20px">
        <el-col :sm="24" v-for="(item, index) in FORMDATA" :key="index">
          <el-form-item :label="item.name" :prop="item.value">
            <div class="item">
              <eui-input class="input"
                 v-model="formdata[item.value]"
                 :type="item.type"
                 :readonly="item.readonly"
                 :suffixIcon="item.suffixIcon"
                 :options="formOptions[item.value]"
                 :autosize="item.autosize">
              </eui-input>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="btns">
        <el-button type="primary" size="mini" @click="sure">确定</el-button>
        <el-button size="mini" @click="cancel">关闭</el-button>
      </div>
    </eui-window>
    <eui-window ref="subwindow"
                :options="subWindowOptions">
      <el-form class="form clearfix" ref="subform" :model="subformdata" label-width="50px" :rules="rules"
               style="padding: 20px">
        <el-col :sm="24" v-for="(item, index) in FORMDATA" :key="index">
          <el-form-item  :label="item.name" :prop="item.value">
            <div class="item">
              <eui-input class="input"
                 v-model="subformdata[item.value]"
                 :type="item.type"
                 :readonly="item.readonly"
                 :suffixIcon="item.suffixIcon"
                 :options="formOptions[item.value]"
                 :autosize="item.autosize">
              </eui-input>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="btns">
        <el-button type="primary" size="mini" @click="subSure">确定</el-button>
        <el-button size="mini" @click="subCancel">关闭</el-button>
      </div>
    </eui-window>
  </eui-layout>
</template>

<script>
  import api from '@/api'
  import helper from '@/app/app.helpers'
  import TabPane from '@/components/views/TabPane'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiTable from '@/components/common/form/EuiTable'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiInput from '@/components/common/form/EuiInput'

  const REGIONS = {
    north: {
      style: {
        flex: 1
      }
    },
    middle: {
      style: {
        flex: 1
      },
      center: {
        style: {
          flex: 1
        }
      }
    }
  }
  const FORMDATA = [
    {
      name: '名称',
      value: 'name'
    }, {
      name: '备注',
      value: 'memo',
      type: 'textarea',
      autosize: {
        minRows: 6,
        maxRows: 6
      }
    }
  ]
  const INFO = {
    name: null,
    memo: null
  }
  const SUBINFO = {
    name: null,
    pid: null,
    memo: null
  }
  export default {
    name: 'dictionary-controller',
    _meta: {
      path: '/dictionary/controller',
      title: '数据字典'
    },
    mixins: [TabPane],
    components: {
      EuiTable,
      MainToolbar,
      EuiLayout,
      EuiWindow,
      EuiInput
    },
    data() {
      return {
        helper,
        buttons: [],
        sub_buttons: [],
        REGIONS,
        FORMDATA,
        formdata: {...INFO},
        subformdata: {...SUBINFO},
        tableButtons: ['btnEdit', 'btnDelete'],
        sub_tableButtons: ['btnSubEdit', 'btnSubDelete'],
        formOptions: {
        },
        windowOptions: {
          title: '字典定义',
          width: '20%'
        },
        subWindowOptions: {
          title: '字典值',
          width: '20%'
        },
        rules: {
          name: [{
            required: true, message: '请输入名称', trigger: ['blur', 'change']
          }]
        },
        query: {
          page: 1,
          pageSize: 10
        },
        valueQuery: {
          attrCode: null,
          page: 1,
          pageSize: 10
        },
        tableOptions: {
          data: [],
          total: null,
          columns: [
            {label: '编号', width: 400, prop: 'code'},
            {label: '名称', width: 400, prop: 'name'}
          ],
          rowClick: (row, event, column) => {
            this.valueQuery.attrCode = row.code
            this.getValueData()
            this.formdata = {...row}
          },
          rowDblclick: (row, event) => {
            this.$refs.window.open()
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData(this.query)
            this.formdata = {...INFO}
          }
        },
        tableOptions2: {
          data: [],
          total: null,
          columns: [
            {label: '编号', width: 400, prop: 'code'},
            {label: '名称', width: 400, prop: 'name'},
            {label: '备注', prop: 'memo', minWidth: 400}
          ],
          rowClick: (row, event, column) => {
            this.subformdata = {...row}
          },
          rowDblclick: (row, event) => {
            this.$refs.subwindow.open()
          },
          reload: (name, val) => {
            this.valueQuery.page = name === 'page' ? val : this.valueQuery.page
            this.valueQuery.pageSize = name === 'pageSize' ? val : this.valueQuery.pageSize
            this.getValueData()
            this.subformdata = {...SUBINFO}
          }
        }
      }
    },
    methods: {
      getData() {
        api.dictionary.getPaged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      getValueData() {
        api.dictionary.getValuePaged(this.valueQuery).then(data => {
          this.tableOptions2.data = data.records
          this.tableOptions2.total = data.total
        })
      },
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.formdata = { ...INFO }
            this.$refs.window.open()
          },
          btnEdit: () => {
            this.$refs.window.open()
          },
          btnDelete: () => {
            this.$confirm(`是否删除:${row.name}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.dictionary.deleteAttrCode(row.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData()
              }).catch(() => {
              })
            })
          },
          btnSubAdd: () => {
            if (this.formdata.id) {
              this.subformdata = {...INFO}
              this.subformdata.pid = this.formdata.id
              this.$refs.subwindow.open()
            } else {
              this.$message({
                message: '请先选择字典定义，再添加值!',
                type: 'warning'
              })
            }
          },
          btnSubEdit: () => {
            this.$refs.subwindow.open()
          },
          btnSubDelete: () => {
            this.$confirm(`是否删除:${row.name}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.dictionary.deleteAttrValue(row.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getValueData()
              })
            })
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this)
        }
      },
      getButtons() {
        let buttons = helper.getMainButtons()
        this.buttons = buttons.filter(btn => {
          return !btn.btnKey.startsWith('btnSub')
        })
        this.sub_buttons = buttons.filter(btn => {
          return btn.btnKey.startsWith('btnSub')
        })
      },
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formdata.id) {
              api.dictionary.addAttrCode(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.getData()
                this.$refs.window.cancel()
              })
            } else {
              api.dictionary.updateAttrCode(this.formdata).then(() => {
                this.$message({
                  message: '编辑成功!',
                  type: 'success'
                })
                this.getData()
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
      },
      subSure() {
        this.$refs.subform.validate((valid) => {
          if (valid) {
            if (!this.subformdata.id) {
              api.dictionary.addAttrValue(this.subformdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.getValueData()
                this.$refs.subwindow.cancel()
              })
            } else {
              api.dictionary.updateAttrValue(this.subformdata).then(() => {
                this.$message({
                  message: '编辑成功!',
                  type: 'success'
                })
                this.getValueData()
                this.$refs.subwindow.cancel()
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      subCancel() {
        this.$refs.subwindow.cancel()
      }
    },
    mounted() {
      this.getData()
      this.getButtons()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .flex-content
    display: flex
    flex-direction: column
    width: 100%
    height: 100%
  /deep/ .el-table
    .cell
      line-height: 30px !important

</style>
