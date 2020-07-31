<template>
  <eui-window ref="window"
              :options="windowOptions">
    <el-form class="form" ref="form" :model="formdata" label-width="90px" :rules="rules" style="padding: 20px">
      <el-col :sm="8" v-for="(item, index) in forminfo" :key="index">
        <el-form-item :label="item.name" :prop="item.value">
          <div class="item">
              <eui-input
                  class="input"
                  v-model="formdata[item.value]"
                  :type="item.type"
                  :options="defaultformOptions[item.value]"
                  :placeholder="item.placeholder"
                  :unit="item.unit">
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
</template>

<script>
  import {PERMISSION} from '../client.config'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiInput from '@/components/common/form/EuiInput'
  import api from '@/api'
  export default {
    name: 'client-permission-window',
    components: {
      EuiWindow,
      EuiInput
    },
    props: {
      pid: {
        type: String,
        default: ''
      },
      inputOptions: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      defaultformOptions() {
        return Object.assign({}, this.formOptions, this.inputOptions)
      }
    },
    data() {
      return {
        formdata: {...PERMISSION.FORM_DATA},
        forminfo: PERMISSION.FORM_INFO,
        formOptions: PERMISSION.FORM_OPTIONS,
        rules: PERMISSION.RULES,
        windowOptions: {
          title: null,
          width: '70%'
        }
      }
    },
    methods: {
      open(row = {id: null}) {
        if (row.id) {
          this.windowOptions.title = '编辑权限'
          this.formdata = {...row}
          this.$refs.window.open()
        } else if (row.name) {
          this.$refs.window.open()
          this.$nextTick(() => {
            this.windowOptions.title = '新增权限'
            this.formdata = {...row}
          })
        } else {
          this.$refs.window.open()
          this.$nextTick(() => {
            this.windowOptions.title = '新增权限'
            this.$refs.form.resetFields()
            this.formdata = {...PERMISSION.FORM_DATA}
            this.pid && (this.formdata.pid = this.pid)
          })
        }
      },
      cancel() {
        this.$refs.window.cancel()
      },
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formdata.id) {
              api.clientPermission.add(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.$emit('reload')
                this.cancel()
              })
            } else {
              api.clientPermission.update(this.formdata).then(() => {
                this.$message({
                  message: '编辑成功!',
                  type: 'success'
                })
                this.$emit('reload')
                this.cancel()
              })
            }
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .el-dialog__body
    height: 250px
    overflow: visible !important
</style>