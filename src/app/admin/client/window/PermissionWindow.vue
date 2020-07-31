<template>
  <eui-window ref="window"
              :options="windowOptions">
    <eui-tree
        ref="tree"
        :options="treeOptions">
    </eui-tree>
    <div slot="btns">
      <el-button type="primary" size="mini" @click="sure">确定</el-button>
      <el-button size="mini" @click="cancel">关闭</el-button>
    </div>
  </eui-window>
</template>

<script>
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiTree from '@/components/common/form/EuiTree'
  import helper from '@/app/app.helpers'
  import api from '@/api'
  const REGIONS = {
    middle: {
      west: {
        style: {
          width: 115,
          border: false
        }
      },
      center: {}
    }
  }
  export default {
    name: 'permission-window',
    components: {
      EuiWindow,
      EuiTree
    },
    data() {
      return {
        REGIONS,
        groupId: null,
        query: {
          roleId: null,
          subSystemId: null
        },
        windowOptions: {
          title: '权限设置',
          width: '40%'
        },
        treeOptions: {
          data: [],
          checkStrictly: false,
          showCheckbox: true,
          // defaultExpandAll: true,
          defaultCheckedKeys: [],
          defaultExpandedKeys: []
        },
        subSystemList: [],
        loading: false
      }
    },
    methods: {
      open(id) {
        this.groupId = id
        this.$refs.window.open()
        this.getSubSyetemList()
      },
      getSubSyetemList() {
        this.loading = true
        return api.clientPermission.groupTree(this.groupId).then((data) => {
          this.treeOptions.data = helper.getTreeData(data.permissionList, 'childUserPermission', 'name')
          this.treeOptions.defaultCheckedKeys = helper.getCheckedList(data.permissionList, 'childUserPermission')
          this.treeOptions.defaultExpandedKeys = this.treeOptions.data.map(t => t.id)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      sure() {
        let checked = this.$refs.tree.callByName('getCheckedNodes', false, true) || []
        api.clientGroup.setClientGroupPermission({
          permissionList: checked.map(c => c.id),
          groupId: this.groupId
        }).then(() => {
          this.$message({
            message: '设置成功!',
            type: 'success'
          })
          this.$refs.window.cancel()
        })
      },
      cancel() {
        this.$refs.window.cancel()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-tree
    padding: 20px
    height: 500px
</style>