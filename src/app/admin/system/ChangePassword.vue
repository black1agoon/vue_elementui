<template>
  <div class="form-wrapper">
    <el-form class="clearfix" ref="form" :model="formdata" label-width="80px" :rules="rules">
      <el-col :sm="24" v-for="(item, index) in FORMDATA" :key="index">
        <el-form-item :label="item.name" :prop="item.value">
          <eui-input v-model="formdata[item.value]"
                     :type="item.type"
                     :autosize="item.autosize">
          </eui-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-button type="primary" size="mini" @click="sure">修改</el-button>
    <el-button size="mini" @click="reset">重置</el-button>
  </div>

</template>

<script>
  import api from '@/api'
  import EuiInput from '@/components/common/form/EuiInput'

  const FORMDATA = [
    {
      name: '原密码',
      value: 'oldpassword',
      type: 'password'
    }, {
      name: '新密码',
      value: 'password',
      type: 'password'
    }, {
      name: '再次输入',
      value: 'repassword',
      type: 'password'
    }]
  const INFO = {
    oldpassword: null,
    password: null,
    repassword: null
  }
  export default {
    name: 'change-password',
    _meta: {
      path: 'changepassword',
      title: '修改密码'
    },
    components: {
      EuiInput
    },
    data() {
      return {
        FORMDATA,
        formdata: JSON.parse(JSON.stringify(INFO)),
        rules: {
          oldpassword: [{
            required: true, message: '请输入原密码', trigger: 'blur'
          }],
          password: [{
            required: true,
            validator: (rule, value, callback) => {
              if (value === '' || value === null) {
                callback(new Error('请输入新密码'))
              } else {
                if (this.formdata.repassword !== '' && this.formdata.repassword !== null) {
                  this.$refs.form.validateField('repassword')
                }
                callback()
              }
            },
            trigger: 'blur'
          }, { min: 6, message: '密码长度至少为6位', trigger: 'blur' }],
          repassword: [{
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '' || value === null) {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.formdata.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            }
          }, { min: 6, message: '密码长度至少为6位', trigger: 'blur' }]
        }
      }
    },
    methods: {
      sure() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            api.user.updateUserPwd(this.formdata).then(() => {
              this.$message({
                message: '修改成功,请重新登录!',
                type: 'success'
              })
              this.reset()
              this.$router.push('/login')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      reset() {
        this.$refs.form.resetFields()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.form-wrapper
  width: 500px !important
  margin: auto
  padding-top: 50px
  text-align: center
</style>
