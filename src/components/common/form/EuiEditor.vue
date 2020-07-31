<template>
  <div style="height: 100%">
    <!-- 图片上传组件辅助-->
    <el-upload
      style="visibility: hidden"
      class="avatar-uploader"
      action=""
      :multiple="true"
      :show-file-list="false"
      :http-request="uploadFile">
    </el-upload>
    <quill-editor
      class="editor"
      :value="value"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>

<script>
  // import api from '@/api'
  import helper from '@/app/app.helpers'
  import {quillEditor} from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'font': []}],
    [{'color': []}, {'background': []}],
    [{'align': []}],
    // ['clean'],
    ['link', 'image', 'video']
  ]
  export default {
    props: {
      value: {
        type: String
      },
      uploadPic: Function,
      uploadVideo: Function
    },
    components: {
      quillEditor
    },
    data() {
      return {
        helper,
        uploadType: '',
        editorOption: {
          theme: 'snow', // or 'bubble'
          placeholder: '产品详情',
          modules: {
            toolbar: {
              container: toolbarOptions,
              handlers: {
                image: (value) => {
                  if (value) {
                    this.uploadType = 'image'
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false) // 禁用quill内部上传图片方法
                  }
                },
                video: (value) => {
                  if (value) {
                    this.uploadType = 'video'
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('video', false)
                  }
                }
              }
            }
          }
        }
      }
    },

    methods: {
      onEditorBlur() {
        // 失去焦点事件
      },
      onEditorFocus() {
        // 获得焦点事件
      },
      onEditorChange(val) {
        this.$emit('input', val.html.replace(/iframe/g, 'video').replace(/frameborder="0"/g, 'controls="controls"').replace(/allowfullscreen="true"/g, ''))
      },
      // 富文本图片上传前
      uploadFile(params) {
        if (this.uploadType === 'video') {
          const isMP4 = params.file.type === 'video/mp4'
          if (!isMP4) {
            this.$message.error('上传视频只能是 MP4 格式!')
            return false
          }
        }
        let quill = this.$refs.myQuillEditor.quill
        // 获取光标所在位置
        let length = quill.getSelection().index
        if (this.uploadType === 'image' && typeof this.uploadPic === 'function') {
          this.uploadPic(params.file).then(data => {
            quill.insertEmbed(length, 'image', helper.getImgUrl(data.path))
            // 调整光标到最后
            quill.setSelection(length + 1)
          }).catch(() => {
            this.$message.error('图片插入失败')
          })
        } else if (this.uploadType === 'video' && typeof this.uploadVideo === 'function') {
          // api.public.uploadVideo(params.file).then(data => {
          this.uploadVideo(params.file).then(data => {
            quill.insertEmbed(length, 'video', helper.getImgUrl(data.path))
            // 调整光标到最后
            quill.setSelection(length + 1)
          }).catch(() => {
            this.$message.error('视频插入失败')
          })
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .avatar-uploader
    line-height: 0
  /deep/ .ql-container
    height: 350px
</style>
<style>
  .editor {
    line-height: normal !important;
    height: 400px;
  }

  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
  }

  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
  }

  .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }
</style>
