<template>

  <el-popover
      class="super-search"
      placement="bottom-start"
      :width="defaultOptions.width"
      v-model="visible"
      trigger="manual">
    <div class="title">分字段搜索</div>
    <el-form class="form clearfix" ref="form">
      <el-col :sm="defaultOptions.fieldSearch[key].sm || 6"
              v-for="(key, index) in Object.keys(defaultOptions.fieldSearch)"
              :key="index">
        <eui-input size="mini"
                   v-model="searchinfo[key]"
                   :type="defaultOptions.fieldSearch[key].type"
                   :placeholder="defaultOptions.fieldSearch[key].placeholder"
                   @change="(val) => {inputChange(key, val)}">
        </eui-input>
      </el-col>
    </el-form>
    <div class="title" v-if="Object.keys(defaultOptions.conditionSearch).length > 0">条件筛选</div>
    <el-form class="form clearfix" ref="form" v-if="Object.keys(defaultOptions.conditionSearch).length > 0">
      <el-col :sm="defaultOptions.conditionSearch[key].sm || 6" v-for="(key, index) in Object.keys(defaultOptions.conditionSearch)" :key="index">
        <eui-input size="mini"
                   v-model="searchinfo[key]"
                   :type="defaultOptions.conditionSearch[key].type"
                   :placeholder="defaultOptions.conditionSearch[key].placeholder"
                   :options="defaultOptions.conditionSearch[key].options"
                   :readonly="defaultOptions.conditionSearch[key].readonly"
                   :clearable="defaultOptions.conditionSearch[key].clearable"
                   :appendicon="defaultOptions.conditionSearch[key].appendicon"
                   @appendClick="appendClick(key)"
                   @change="(val) => {inputChange(key, val)}">
        </eui-input>
      </el-col>
    </el-form>
    <el-button class="button" type="primary" size="mini" @click="search">搜索</el-button>
    <el-button class="button" @click="reset" size="mini">重置</el-button>
    <el-button slot="reference" type="text" size="mini" @click="visible = !visible">
      <i class="fa fa-search icon"></i>高级搜索
    </el-button>
  </el-popover>
</template>

<script>
  import EuiInput from '@/components/common/form/EuiInput'
  import helper from '@/app/app.helpers'
  export default {
    name: 'super-search',
    components: {
      EuiInput
    },
    props: {
      options: {
        type: Object,
        default: () => ({})
      },
      value: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      defaultOptions() {
        return Object.assign({}, this.options)
      },
      queryParams() { // 获取所有options中的参数名
        return Object.keys(this.options.fieldSearch).concat(Object.keys(this.options.conditionSearch), Object.keys(this.options.conditionSearch).map(key => this.options.conditionSearch[key].id))
      }
    },
    data() {
      return {
        helper,
        visible: false,
        searchinfo: this.value
      }
    },
    methods: {
      search() { // 搜索
        this.visible = false
        this.$emit('search', this.searchinfo)
      },
      reset() { // 重置
        this.queryParams.forEach(r => {
          this.searchinfo[r] = null
        })
        this.$emit('search', this.searchinfo)
        this.visible = false
      },
      inputChange(key, val) {
      },
      appendClick(val) {
        this.$emit('appendClick', val)
      }
    },
    watch: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .icon
    margin-right: 5px

  .title
    margin-bottom: 10px

  .el-form
    width: 100%
    .el-input, .el-select, .el-date-editor
      width: 90%
      box-sizing: border-box
      margin-bottom: 10px
      &:nth-of-type(4n)
        margin-right: 0
  /deep/.vue-treeselect
    width: 90%
    margin-bottom: 10px
    .vue-treeselect__control
      height: 28px !important
      font-size: 12px
      .vue-treeselect__single-value, .vue-treeselect__placeholder
        line-height: 26px
  /deep/ .el-date-editor
    width: 90% !important
</style>
