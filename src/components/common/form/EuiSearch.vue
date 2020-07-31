<template>
  <div class="search-wrapper">
    <el-button type="text" style="margin-left: 50px" @click="toggleSearch">{{getbtnfont}}</el-button>
    <transition name="show">
      <div class="search-form-wrapper" v-show="searchform.show">
        <el-form class="form clearfix" ref="form" label-width="80px">
          <el-col :sm="8" v-for="(data, index) in forminfo" :key="index">
            <el-form-item :label="data.label">
              <eui-input size="mini"
                         v-model="formdata[data.value]"
                         :options="formOptions[data.value]"
                         :type="data.type"
                         :readonly="data.readonly"
                         :clearable="data.clearable"
                         :appendicon="data.appendicon"
                         @appendClick="func(data.value)">
              </eui-input>
            </el-form-item>
          </el-col>
        </el-form>
        <el-button type="primary" size="mini" @click="search">搜索</el-button>
        <el-button @click="reset" size="mini">清空</el-button>
      </div>
    </transition>
  </div>
</template>

<script>
  import EuiInput from '@/components/common/form/EuiInput'

  export default {
    name: 'eui-search',
    components: {
      EuiInput
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      forminfo: {
        type: Array,
        default: () => []
      },
      formdata: {
        type: Object,
        default: () => ({})
      },
      formOptions: {
        type: Object,
        default: () => ({})
      },
      formfunctions: Function
    },
    data() {
      return {
        searchform: {
          show: false
        }
      }
    },
    computed: {
      getbtnfont() {
        return !this.searchform.show ? '显示搜索' : '隐藏搜索'
      }
    },
    methods: {
      func(val) {
        this.formfunctions(val, 'open', this)
      },
      toggleSearch() {
        this.searchform.show = !this.searchform.show
      },
      search() {
        this.$emit('search', this.formdata)
      },
      reset() {
        this.$emit('update:formdata', Object.keys(this.formdata).reduce((result, current) => {
          result[current] = null
          return result
        }, {}))
        this.$nextTick(() => {
          this.$emit('search', this.formdata)
        })
      }
    },
    watch: {
      'show' () {
        this.searchform.show = this.show
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search-wrapper
    display: inline
    .search-form-wrapper
      border: 1px solid #e4e7ed
      width: 800px
      padding: 0 20px 10px 20px
      text-align: center
      &.show-enter, &.show-leave-to
      .form
        display: block
      .el-form-item
        margin-bottom: 5px
</style>
