<template>
  <div class="tabs-view">
    <el-tabs ref="tabs" :value="activeTabName" type="card" @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        :label="item.title"
        :name="item.name"
        :closable="!item.keep">
      </el-tab-pane>
    </el-tabs>
    <div class="tab-contents">
      <keep-alive :include="getKeepAlivePageNames">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  // import ElTabs from 'element-ui/packages/tabs/src/tabs.vue'
  import {mapState} from 'vuex'

  // import Vue from 'vue'

  export default {
    name: 'TabsView',
    computed: {
      ...mapState('admin', ['tabs']),
      getKeepAlivePageNames() {
        return this.tabs.map(tab => tab.name).toString()
      }
    },
    components: {
      // ElTabs
    },
    data() {
      return {
        activeTabName: null,
        tabIndex: 2
      }
    },
    methods: {
      tabClick(tab) {
        this.$router.push(this.tabs[tab.index].fullPath)
      },
      removeTab(targetName) {
        let tabs = this.tabs
        let activeName = this.activeTabName
        if (activeName === targetName) { // 如果关闭的tab是当前tab
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
                this.$router.push(this.tabs.find(t => { // 进入下一个tab
                  return t.name === activeName
                }).path)
              }
            }
          })
        }
        this.activeTabName = activeName
        this.$store.commit('admin/REMOVE_TAB', targetName)
      },
      updateActiveTab() {   // 设置active的tab
        this.activeTabName = this.tabs.find(t => {
          return this.$route.path === t.path || t.path.startsWith('/outside')
        }).name
      },
      activeCurrentTab() {  // 刷新的时候 只有一个tab 设置为active
        this.activeTabName = this.tabs[0].name
        if (this.tabs.length === 1) {
          this.tabs[0].keep = true
        }
      },
      refresh() {
        this.removeTab(this.$route.name)
        this.$router.push('/company/permission')
      }
    },
    created() {
    },
    watch: {
      '$route.path'() {
        this.updateActiveTab()
      },
      'tabs'() {
        if (this.tabs.length === 1) { // 如果tab长度为1 就不能关闭
          this.$store.commit('admin/TOGGLE_TAB_KEEP', {
            index: 0,
            boolean: true
          })
        } else {                // 如果长度大于1 则都可以关闭
          this.tabs.forEach((t, i) => {
            this.$store.commit('admin/TOGGLE_TAB_KEEP', {
              index: i,
              boolean: false
            })
          })
        }
      }
    },
    mounted() {
      this.activeCurrentTab()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tabs-view
    width: 100%
    height: 100%
    overflow-y: hidden
    overflow-x: auto
    min-width: 1200px
    position: relative
    /deep/ .el-tabs__header
      margin: 0
      .el-tabs__item
        height: 30px
        line-height: 30px
        padding: 0 5px
        &.is-active.is-closable
          padding: 0 5px
        &:last-child
          padding: 0 5px
    .tab-contents
      width: 100%
      height: calc(100% - 31px)
      border-left: 1px solid #e4e7ed
      box-sizing: border-box
      position: relative
      & > div
        width: 100%
        height: 100%
</style>
