<template>
  <el-date-picker
    v-model="val"
    type="date"
    @change="dateChange">
  </el-date-picker>
</template>

<script>
  export default {
    name: 'eui-input',
    props: {
      value: {
      },
      type: {
        type: String,
        default: 'input'
      }
    },
    data() {
      return {
        val: null,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        }
      }
    },
    computed: {
      datePlaceHolder() {
        if (this.type === 'date') {
          return '选择日期'
        } else {
          return '选择日期时间'
        }
      }
    },
    methods: {
      dateChange(val) {
        this.$emit('input', val)
      }
    },
    watch: {
      'value' () {
        console.log('watch')
        this.val = this.value
      }
    }
  }
</script>

