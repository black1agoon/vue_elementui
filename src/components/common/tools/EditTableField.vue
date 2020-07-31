<template>
  <div class="edit-form">
    <el-popover
        placement="bottom"
        width="177"
        v-model="show"
        trigger="click">

      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedFields" @change="handleCheckedFieldChange">
        <el-checkbox class="checkbox" v-for="field in fieldList" :label="field.prop" :key="field.prop">{{field.label}}</el-checkbox>
      </el-checkbox-group>

      <el-button class="button" type="primary" size="mini" @click="sure">确定</el-button>
      <el-button class="button" @click="close" size="mini">关闭</el-button>
      <el-button slot="reference" type="text" size="mini">编辑表单</el-button>
    </el-popover>
  </div>
</template>

<script>
  export default {
    name: 'edit-table-field',
    props: {
      fieldList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        show: false,
        checkAll: true,
        checkedFields: this.fieldList.map(f => f.prop),
        isIndeterminate: false
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.checkedFields = val ? this.fieldList.map(f => f.prop) : []
        this.isIndeterminate = false
      },
      handleCheckedFieldChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.fieldList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.fieldList.length
      },
      sure() {
        this.show = false
        this.$emit('filterField', this.checkedFields)
      },
      close() {
        this.show = false
      }
    },
    watch: {
      'fieldList'() {
        this.isIndeterminate = false
        this.checkAll = true
        this.checkedFields = this.fieldList.map(f => f.prop)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.edit-form
  float: right
  margin-right: 35px
.el-checkbox-group
  height: 300px
  overflow: auto
  padding: 10px 0
.checkbox
  display: block
  border-bottom: 1px solid #eee
  margin-left: 0 !important
  padding: 7px 20px
.button
  margin-top: 5px
</style>