<template>
  <el-tree
      ref="tree"
      node-key="id"
      :data="options.data"
      :highlight-current="getValOrDefault('highlightCurrent')"
      :check-strictly="getValOrDefault('checkStrictly')"
      :show-checkbox="getValOrDefault('showCheckbox')"
      :default-expand-all="getValOrDefault('defaultExpandAll')"
      :expand-on-click-node="getValOrDefault('expandOnClickNode')"
      :default-expanded-keys="getValOrDefault('defaultExpandedKeys')"
      :default-checked-keys="getValOrDefault('defaultCheckedKeys')"
      :check-on-click-node="getValOrDefault('checkOnClickNode')"
      @node-click="(...params) => todoEvent('nodeClick', ...params)"
      @check-change="(...params) => todoEvent('checkChange', ...params)">
    <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
      <!--<span @click="aaa(node,data)">-->
        <!--<i :class="['tree-icon fa', node.icon]"></i>{{ node.label }}-->
      <!--</span>-->
      <!--<span v-if="data.resourceType === '9'">-->
        <!--<slot :data="data"></slot>-->
      <!--</span>-->
    <!--</span>-->
  </el-tree>
</template>

<script>
  const DEFAULT = {
    highlightCurrent: true,
    showCheckbox: false,
    defaultExpandAll: false, // 是否展开所有节点
    accordion: true,     // 是否每次只打开一个同级树节点展开
    checkStrictly: true, // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
    expandOnClickNode: true,  // 是否在点击节点的时候展开或者收缩节点
    checkOnClickNode: true,   // 是否在点击节点的时候选中复选框，默认只有在点击复选框时才会选中节点。
    defaultExpandedKeys: [],
    defaultCheckedKeys: []
  }
  export default {
    name: 'eui-tree',
    props: {
      options: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
      }
    },
    computed: {},
    methods: {
      getValOrDefault(key) {
        return this.options[key] !== undefined ? this.options[key] : DEFAULT[key]
      },
      callByName(method, ...args) {
        return this.$refs.tree[method].call(this, ...args)
      },
      todoEvent(name, ...params) {
        if (this.options[name]) {
          this.options[name](...params)
        }
      },
      aaa(node, data) {
        // console.log(node, data)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .custom-tree-node
    flex: 1
    display: flex
    align-items: center
    justify-content: space-between
    font-size: 14px
    padding-right: 8px
    .tree-icon
      width: 20px
      vertical-align: top
</style>
<style>
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
    background-color: rgba(102, 177, 255, .4)
  }
  .el-tree-node>.el-tree-node__children {
    overflow: inherit;
  }
  .el-tree-node__label{
    font-size: 13px !important;
  }
</style>
