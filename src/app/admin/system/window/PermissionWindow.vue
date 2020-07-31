<template>
  <eui-window ref="window"
              :options="windowOptions">
    <eui-layout :regions="REGIONS"
                v-loading="loading">
      <el-tabs slot="west" tab-position="left" type="border-card" style="width: 112px;height: 500px;" @tab-click="tabClick">
        <el-tab-pane
            v-for="(sys, index) in subSystemList"
            :label="sys.name"
            :key="index">
        </el-tab-pane>
      </el-tabs>
      <div slot="center" style="padding: 20px;overflow: auto;position: absolute">
        <eui-tree
            ref="tree"
            :options="treeOptions">
        </eui-tree>
      </div>
    </eui-layout>
    <div slot="btns">
      <el-button type="primary" size="mini" @click="sure">确定</el-button>
      <el-button size="mini" @click="cancel">关闭</el-button>
    </div>
  </eui-window>
</template>

<script>
  import EuiWindow from '@/components/common/form/EuiWindow'
  import EuiLayout from '@/components/common/layout/EuiLayout'
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
      EuiLayout,
      EuiTree
    },
    data() {
      return {
        REGIONS,
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
        this.query.roleId = id
        this.$refs.window.open()
        this.getSubSyetemList()
      },
      tabClick(vObj) {
        this.query.subSystemId = this.subSystemList[vObj.index].id
        this.getSubSyetemList(this.query)
      },
      getSubSyetemList() {
        this.loading = true
        return api.permission.getPermissRoleTree(this.query).then((data) => {
          if (data.subSystem) {
            this.subSystemList = data.subSystem
            this.query.subSystemId = data.subSystem[0].id
          }
          this.treeOptions.data = helper.getTreeData(data.subSystemPermissionList, 'childUserPermission', 'name')
          this.treeOptions.defaultCheckedKeys = helper.getCheckedList(data.subSystemPermissionList, 'childUserPermission')
          this.treeOptions.defaultExpandedKeys = this.treeOptions.data.map(t => t.id)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      sure() {
        let checked = this.$refs.tree.callByName('getCheckedNodes', false, true) || []
        // console.log(checked)
        api.role.setRolePermission({
          permissionList: checked.map(c => c.id),
          roleId: this.query.roleId,
          subSystemId: this.query.subSystemId
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

</style>