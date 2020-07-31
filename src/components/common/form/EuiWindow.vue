<template>
  <el-dialog
      ref="window"
      :width="options.width"
      :title="options.title"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="getHandleClose">
    <slot></slot>
    <span slot="footer">
      <slot name="btns"></slot>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'eui-window',
    props: {
      options: {
        type: Object,
        default: () => ({})
      },
      handleClose: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    computed: {
      getHandleClose() {
        if (this.handleClose) {
          return this.beforeClose
        } else {
          return null
        }
      }
    },
    methods: {
      beforeClose(done) {
        this.$confirm('信息还未保存,确认关闭？', '提示', {
          iconClass: 'fa fa-question-circle'
        }).then(_ => {
          done()
        }).catch(_ => {
        })
      },
      open() {
        this.dialogVisible = true
      },
      cancel() {
        this.$refs.window.handleClose()
      }
    },
    mounted() {
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .el-dialog__header
    background-color: #ebf1f6
    padding: 10px 0 10px 20px
    border-radius: 5px
    .el-dialog__headerbtn
      top: 10px
      right: 10px
  /deep/ .el-dialog__title
    line-height: 20px
    font-weight: bold
  /deep/ .el-dialog__body
    /*border-bottom: 1px solid #dcdfe6*/
    padding: 0 !important
    max-height: 600px
    overflow: auto

  /deep/ .el-dialog
    border-radius: 5px
    /*overflow: hidden*/
    position: absolute
    top: 50%
    left: 50%
    margin: 0 !important
    transform: translate(-50%, -50%)
    .el-dialog__footer
      padding: 5px 10px
</style>
