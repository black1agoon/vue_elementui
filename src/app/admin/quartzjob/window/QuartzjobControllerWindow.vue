<template>
    <eui-window ref="window"
                :options="windowOptions">
        <el-form class="form" ref="form" :model="formdata" label-width="120px" :rules="rules" style="padding: 20px">
            <el-col :sm="24" v-for="(item, index) in forminfo" :key="index">
                <el-form-item :label="item.name" :prop="item.value">
                    <div class="item">
                        <div class="explain"></div>
                        <div class="input">
                            <eui-input
                                v-model="formdata[item.value]"
                                :type="item.type"
                                :autosize="item.autosize"
                                :options="defaultformOptions[item.value]"
                                :placeholder="item.placeholder"
                                :unit="item.unit">
                            </eui-input>
                        </div>
                    </div>
                    <div class="info-msg" v-if="item.value === 'invokeTarget'">
                        <p><i class="fa fa-info-circle"></i> Bean调用示例：ryTask.ryParams('ry')</p>
                        <p><i class="fa fa-info-circle"></i> Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')</p>
                        <p><i class="fa fa-info-circle"></i> 参数说明：支持字符串，布尔类型，长整型，浮点型，整型</p>
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
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiInput from '@/components/common/form/EuiInput'
  import {QUARTZJOB} from '../quartzjob.config'
  import api from '@/api'
  import helper from '@/app/app.helpers'
  export default {
    name: 'quartzjob-controller-window',
    components: {
      EuiWindow,
      EuiInput
    },
    props: {
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
        helper,
        forminfo: {...QUARTZJOB.FORM_INFO},
        formdata: {...QUARTZJOB.FORM_DATA},
        formOptions: Object.assign(QUARTZJOB.FORM_OPTIONS, {
        }),
        rules: QUARTZJOB.RULES,
        windowOptions: {
          title: null,
          width: '600px'
        }
      }
    },
    methods: {
      open(row) {
        if (row) {
          this.windowOptions.title = '编辑' + QUARTZJOB.WINDOW_NAME
          this.formdata = {...row}
          this.$refs.window.open()
        } else {
          this.$refs.window.open()
          this.$nextTick(() => {
            this.windowOptions.title = '新增' + QUARTZJOB.WINDOW_NAME
            this.$refs.form.resetFields()
            this.formdata = {...QUARTZJOB.FORM_DATA}
          })
        }
      },
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formdata.id) {
              api.quartzjob.add(this.formdata).then(() => {
                this.$message({
                  message: '新增成功!',
                  type: 'success'
                })
                this.$emit('reload')
                this.cancel()
              })
            } else {
              api.quartzjob.update(this.formdata).then(() => {
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
      },
      cancel() {
        this.$refs.window.cancel()
      }
    },
    watch: {
    },
    mounted() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.info-msg
  p
    margin: 5px 0 0 10px
    font-size: 12px
</style>
