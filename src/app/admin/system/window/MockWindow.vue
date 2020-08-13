<template>
  <eui-window ref="window"
              :options="windowOptions">
    <el-form class="form" ref="form" :model="formdata" label-width="90px" :rules="rules" style="padding: 20px">
      <el-col :sm="24" v-for="(item, index) in forminfo" :key="index">
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
  import { MOCK } from '../system.config'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiInput from '@/components/common/form/EuiInput'
  import api from '@/api'
  export default {
    name: 'menu-window',
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
        formdata: {...MOCK.formdata},
        forminfo: MOCK.forminfo,
        formOptions: MOCK.formOptions,
        rules: MOCK.rules,
        windowOptions: {
          title: null,
          width: '500px'
        }
      }
    },
    methods: {
      open(row = {id: null}) {
        if (row.id) {
          this.windowOptions.title = '编辑mock'
          this.formdata = {...row}
          this.$refs.window.open()
        } else {
          this.$refs.window.open()
          this.$nextTick(() => {
            this.windowOptions.title = '新增mock'
            this.$refs.form.resetFields()
            this.formdata = {...MOCK.formdata}
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
              api.mock.addUser(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.$emit('reload')
                this.cancel()
              })
            } else {
              api.mock.updateUser(this.formdata).then(() => {
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
</style>