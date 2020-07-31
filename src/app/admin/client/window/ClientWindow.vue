<template>
  <eui-window ref="window"
              :options="windowOptions">
    <el-tabs type="card" v-model="windowTabOpen">
      <el-tab-pane label="基本信息" name="first">
        <el-form class="form clearfix" ref="form" :model="formdata" label-width="80px" :rules="rules">
          <el-col :sm="item.sm || 8" v-for="(item, index) in forminfo" :key="index">
            <el-form-item :label="item.name" :prop="item.value">
              <div class="item">
                <div class="explain"></div>
                <div class="input">
                  <eui-input v-if="item.value === 'username'"
                             :disabled="!!formdata.id"
                             v-model="formdata[item.value]">
                  </eui-input>
                  <eui-input v-else-if="item.value === 'name'"
                             v-model="formdata[item.value]"
                             @change="defaultformOptions[item.value].change()">
                  </eui-input>
                  <div v-else-if="item.value === 'avatar'" style="width: 100%;padding-bottom: 100%">
                    <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :http-request="defaultformOptions.avatar.uploadFile"
                        :before-upload="defaultformOptions.avatar.beforeAvatarUpload">
                      <img v-if="helper.getImgUrl(formdata.avatar)" :src="helper.getImgUrl(formdata.avatar)"
                           class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                  <eui-input
                      v-else
                      v-model="formdata[item.value]"
                      :type="item.type"
                      :readonly="item.readonly"
                      :suffixIcon="item.suffixIcon"
                      :options="defaultformOptions[item.value]"
                      :autosize="item.autosize">
                  </eui-input>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="角色信息" name="second">
        <el-checkbox-group v-model="checkedList">
          <el-checkbox
              v-for="(group, index) in groupList"
              :label="group.id"
              :key="index">{{group.name}}
          </el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
    </el-tabs>
    <div slot="btns">
      <el-button type="primary" size="mini" @click="sure">确定</el-button>
      <el-button size="mini" @click="cancel">关闭</el-button>
    </div>
  </eui-window>
</template>

<script>
  import {CLIENT} from '../client.config'
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiInput from '@/components/common/form/EuiInput'
  import api from '@/api'
  import helper from '@/app/app.helpers'
  import {getZwToPy} from '@/assets/plugins/zw-to-py.js'
  export default {
    name: 'client-window',
    components: {
      EuiWindow,
      EuiInput
    },
    props: {
      groupList: {
        type: Array,
        default: () => []
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
        helper,
        formdata: {...CLIENT.FORM_DATA},
        forminfo: CLIENT.FORM_INFO,
        formOptions: Object.assign({
          name: {
            change: () => {
              this.formdata.hotkey = getZwToPy(this.formdata.name)[0]  // 有多音字 取第一个
            }
          },
          avatar: {
            uploadFile: (params) => {
              api.public.uploadAvatar(params.file).then(data => {
                this.formdata.avatar = data.path
              })
            },
            beforeAvatarUpload: (file) => {
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
              }
              return isLt2M
            }
          }
        }, CLIENT.FORM_OPTIONS),
        rules: CLIENT.RULES,
        windowOptions: {
          title: null
        },
        windowTabOpen: 'first',
        checkedList: []
      }
    },
    methods: {
      open(row = {id: null}) {
        if (row.id) {
          this.windowOptions.title = '编辑客户端'
          api.client.get(row.id).then(data => {
            this.formdata = {...data.client}
            this.checkedList = data.clientGroup.map(group => group.id)
            this.$refs.window.open()
          })
        } else {
          this.$refs.window.open()
          this.$nextTick(() => {
            this.windowOptions.title = '新增客户端'
            this.$refs.form.resetFields()
            this.formdata = {...CLIENT.FORM_DATA}
            this.checkedList = []
          })
        }
        this.windowTabOpen = 'first'
      },
      cancel() {
        this.$refs.window.cancel()
      },
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formdata.id) {
              api.client.add(this.formdata).then(data => {
                api.clientGroup.setclientGroup({
                  clientId: data.clientId,
                  groupIdList: this.checkedList
                }).then(() => {
                  this.$message({
                    message: '新增成功!',
                    type: 'success'
                  })
                  this.$emit('reload')
                  this.cancel()
                })
              })
            } else {
              api.client.update(this.formdata).then(() => {
                api.clientGroup.setclientGroup({
                  clientId: this.formdata.id,
                  groupIdList: this.checkedList
                }).then(() => {
                  this.$message({
                    message: '编辑成功!',
                    type: 'success'
                  })
                  this.$emit('reload')
                  this.cancel()
                })
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
    overflow: visible !important
    height: 500px

  .avatar-uploader
    width: 100%
    height: 100%
    position: absolute
    /deep/ .el-upload
      width: 100%
      height: 100%
      .avatar-uploader-icon
        width: 100%
        height: 100%
        line-height: 0
      .el-icon-plus:before
        position: absolute
        top: 50%
        left: 50%
        transform: translateX(-50%) translateY(-50%)

  .avatar
    width: 100%
    height: 100%
</style>