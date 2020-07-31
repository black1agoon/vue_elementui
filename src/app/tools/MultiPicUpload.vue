<template>
  <eui-window ref="window" :options="windowOptions" >
    <el-upload
      v-loading="loading"
      ref="upload"
      :auto-upload="false"
      class="avatar-uploader"
      action=""
      :file-list="EMPTYLIST"
      list-type="picture-card"
      :multiple="true"
      :show-file-list="true"
      :http-request="uploadFile"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-remove="beforeRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div slot="btns">
      <el-button type="primary" size="mini" @click="sure" >开始上传</el-button>
      <el-button size="mini" @click="cancel">关闭</el-button>
    </div>
  </eui-window>
</template>

<script>
  import api from '@/api'
  import helper from '@/app/app.helpers'
  import EuiTree from '@/components/common/form/EuiTree'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  const EMPTYLIST = []
  export default {
    name: 'multi-pic-upload',
    components: {
      EuiLayout,
      EuiTree,
      EuiWindow
    },
    data() {
      return {
        EMPTYLIST,
        fromname: null,
        loading: false,
        helper,
        piclist: [],
        length: 0,
        windowOptions: {
          title: '批量上传',
          width: '980px'
        }
      }
    },
    methods: {
      sure() {
        this.$refs.upload.submit()
      },
      cancel() {
        this.$refs.window.cancel()
      },
      open(fromname) {
        this.fromname = fromname
        this.EMPTYLIST = []
        this.piclist = []
        this.$refs.window.open()
      },
      uploadFile(params) {
        this.length > 0 && (this.loading = true)
        let isJpg = params.file.type === 'image/jpeg'
        let isPng = params.file.type === 'image/png'
        if (isJpg || isPng) {
          api.workshopOrder.upload(params.file).then(data => {
            this.piclist.find(p => p.name === params.file.name).url = data.path
            if (--this.length === 0) {
              this.loading = false
              this.$message({
                message: '上传成功!',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.cancel()
                  this.$parent.$emit('uploadlists', this.piclist.map(p => p.url), this.fromname)
                }
              })
            }
          })
        } else {
          this.loading = false
          this.$message.error('上传图片只能是 JPG或者PNG 格式!')
        }
      },
      handleRemove(file, fileList) {
        this.piclist = this.piclist.filter(l => l.name !== file.name)
        this.length--
      },
      beforeRemove() {
        return this.$confirm(`是否删除该图片？`, '提示', {
          iconClass: 'fa fa-question-circle'
        })
      },
      handleChange(file, fileList) {
        this.piclist = fileList.map(f => ({
          name: f.name,
          url: f.url
        }))
        this.length = fileList.length
      }
    },
    mounted() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.avatar-uploader
  margin: 20px
</style>
<style>
  .el-list-enter-active,
  .el-list-leave-active {
    transition: all 0s;
  }
  .el-list-enter, .el-list-leave-active {
    opacity: 0;
    transform: translateY(0);
  }
</style>
