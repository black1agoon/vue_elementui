<template>
  <eui-window ref="window"
              :options="windowOptions">
    <el-form class="form" ref="form" :model="formdata" label-width="120px" style="padding: 20px">
      <el-col :sm="24" v-for="(item, index) in forminfo" :key="index">
        <label>
          {{item.name}}:
        </label>
        <span class="value status" :class="{error: formdata[item.value] === 1}" v-if="item.value === 'status'">
          {{formdata[item.value] === 0 ? '成功' : '失败'}}
        </span>
        <span class="value" v-else>
           {{formdata[item.value]}}
        </span>
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
  import {DETAIL} from '../quartzjob.config'
  import helper from '@/app/app.helpers'
  export default {
    name: 'quartzjob-log-detail-window',
    components: {
      EuiWindow
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
        forminfo: {...DETAIL.FORM_INFO},
        formdata: {...DETAIL.FORM_DATA},
        windowOptions: {
          title: null,
          width: '600px'
        }
      }
    },
    methods: {
      open(row) {
        this.$refs.window.open()
        this.$nextTick(() => {
          this.windowOptions.title = '调度日志详情'
          this.formdata = {...row}
        })
      },
      sure() {
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
  label
    display: inline-block
    width: 120px
    text-align: right
    margin: 20px 15px 20px 0
  .status
    padding: 5px 10px
    text-align: center
    font-size: 12px
    color: #ffffff
    font-weight: bold
    background: #1BB394
    &.error
      background: #ED5565
</style>
