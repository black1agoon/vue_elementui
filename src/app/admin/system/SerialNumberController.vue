<template>
  <eui-layout :regions="REGIONS">
    <main-toolbar
      slot="north"
      :buttons="helper.getMainFilterButtons(buttons)"
      @click="onBtnClick">
    </main-toolbar>
    <eui-table
      slot="south"
      ref="table"
      :options="tableOptions"
      @reloadTable="tableOptions.reload">
      <el-table-column label="重置类型" width="80">
        <template slot-scope="scope">
          {{getReSetTypeCN(scope.row.resetType)}}
        </template>
      </el-table-column>
      <el-table-column label="是否启用公司识别码" width="150" align="center">
        <template slot-scope="scope">
          <i :class="['icon', {active: enabled(scope.row.compIdentifyFlag)}]"></i>
        </template>
      </el-table-column>
      <el-table-column label="公司识别码" width="80" prop="compIdentifyCode" align="center">
      </el-table-column>
      <el-table-column label="创建时间" minWidth="150" prop="createTime" align="center">
      </el-table-column>
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
    <eui-window ref="window"
                :options="windowOptions">
      <el-form class="form clearfix" ref="form" :model="formdata" label-width="130px" :rules="rules" style="padding: 20px">
        <el-col :sm="24" v-for="(item, index) in forminfo" :key="index">
          <el-form-item v-if="item.value === 'compIdentifyCode'"
                        v-show="formdata.compIdentifyFlag === 1"
                        :label="item.name"
                        :prop="item.value">
            <div class="item">
              <eui-input class="input"
                         v-model="formdata[item.value]">
              </eui-input>
            </div>
          </el-form-item>
          <el-form-item v-else  :label="item.name" :prop="item.value">
            <div class="item">
              <eui-input class="input"
                 v-model="formdata[item.value]"
                 :type="item.type"
                 :options="formOptions[item.value]">
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
  import {NUMBER} from './system.config'
  export default {
    name: 'serialnumber-controller',
    _meta: {
      path: '/serialnumber/controller',
      title: '序号管理'
    },
    mixins: [TabPane],
    components: {
      MainToolbar,
      EuiTable,
      EuiLayout,
      EuiWindow,
      EuiInput
    },
    computed: {
      getSwitchButton() {
        return this.buttons.find(btn => btn.btnKey === this.switchButtons[0]) || {}
      }
    },
    data() {
      return {
        helper,
        buttons: helper.getMainButtons(),
        REGIONS: NUMBER.REGIONS,
        forminfo: {...NUMBER.FORM_INFO},
        formdata: {...NUMBER.FORM_DATA},
        formOptions: {...NUMBER.FORM_OPTIONS},
        rules: NUMBER.RULES,
        query: {
          name: null,
          page: 1,
          pageSize: 10
        },
        windowOptions: {
          title: '序号规则',
          width: '30%'
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'code', label: '编码', width: 80, align: 'center'},
            {prop: 'prefix', label: '前缀', width: 80, align: 'center'},
            {prop: 'name', label: '名称', width: 80, align: 'center'},
            {prop: 'serialCurrentNum', label: '当前数值', width: 80, align: 'center'},
            {prop: 'serialNumFormat', label: '序列号位数', width: 80, align: 'center'},
            {prop: 'dateFormat', label: '日期格式', width: 80, align: 'center'}
          ],
          rowClick: (row, event, column) => {
            this.formdata = {...row}
          },
          rowDblclick: (row, event) => {
            this.$refs.window.open()
          },
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
        api.serialNumber.paged(query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      onBtnClick(btnKey, arg) {
        let btnHandlers = {
          btnAdd: () => {
            this.$refs.window.open()
            this.$nextTick(() => {
              this.$refs.form.resetFields()
              this.formdata = {...NUMBER.FORM_DATA}
            })
          },
          btnEdit: (arg) => {
            this.formdata = {...arg}
            this.$refs.window.open()
          },
          btnDelete: (arg) => {
            this.formdata = {...arg}
            this.$confirm(`是否删除该序号规则？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.serialNumber.delete(this.formdata.id).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData(this.query)
              })
            }).catch(() => {
            })
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, arg)
        }
      },
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formdata.id) {
              api.serialNumber.add(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.getData(this.query)
                this.$refs.window.cancel()
              })
            } else {
              api.serialNumber.update(this.formdata).then(() => {
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
      },
      enabled(status) {
        return status === 1
      },
      getReSetTypeCN(status) {
        if (status === 1) {
          return '按日'
        } else if (status === 2) {
          return '按月'
        } else if (status === 3) {
          return '按年'
        }
      }
    },
    mounted() {
      this.getData(this.query)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  /deep/ .el-dialog__body
    padding: 0 20px
    height: calc(100% - 96px)
    overflow-y: auto
  .icon
    display: inline-block
    width: 17px
    height: 17px
    border-radius: 50%
    background: #999
    &.active
      background: #13ce66
</style>
