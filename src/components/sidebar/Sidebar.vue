<template>
  <div class="aside-wrapper">
    <div class="elaside" ref="elaside">
      <el-menu class="el-menu-vertical-demo"
               :default-active="activeItem"
               :collapse="isCollapse"
               unique-opened>
        <el-menu-item index="-1" @click="go2link({link: '/'})">
          <i class="sidebar-icon fa fa-home"></i>
          <span slot="title">主页</span>
        </el-menu-item>
        <template v-for="(item, index) in menus">
          <el-menu-item v-if="item.link" :index="item.index"  @click="go2link(item)" :key="index">
            <i :class="['sidebar-icon fa', item.icon]"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
          <el-submenu :index="item.index" :key="index" v-else>
            <template slot="title">
              <i :class="['sidebar-icon fa', item.icon]"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <template v-for="(ii,i) in item.items">
              <el-menu-item v-if="ii.link" :index="ii.index" :key="i" @click="go2link(ii)">
                <span slot="title">{{ii.name}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
  // import $ from 'jquery'
  import BScroll from 'better-scroll'
  import helpers from '@/app/app.helpers'
  import {mapState} from 'vuex'
  export default {
    name: 'Sidebar',
    props: {},
    components: {},
    computed: {
      ...mapState('admin', {
        _menus: state => state.menus
      }),
    },
    data() {
      return {
        menus: null,
        isCollapse: false,
        BS: null,
        activeItem: '-1',
        menulist: []
      }
    },
    methods: {
      setMenus() {
        let mapMenus = (perms, index) => perms ? perms
          .sort((p1, p2) => p1.seq - p2.seq)
          .filter(f => f.resourceType !== '3')
          .map((p, i) => {
            let vindex = index || index === 0 ? index.toString() + '-' + i.toString() : i.toString()
            return {
              name: p.name || 'No title',
              icon: p.logo || 'fa-bars',
              link: p.resourceType === '1' ? p.url : null,
              items: p.resourceType === '0' ? mapMenus(p[helpers.getMenuChildKey()], vindex) : null,
              index: vindex
            }
          }) : null
        if (this._menus && this._menus.length) {
          this.menus = mapMenus(this._menus)
        } else {
          this.menus = []
        }
      },
      go2link(item) {
        // console.log(item)
        if (item.link.startsWith('http') || item.link.startsWith('https')) {
          this.$router.push({
            path: '/outside/website/' + item.link.split('//')[1],
            query: {
              title: item.name,
              url: item.link
            }
          })
        } else {
          this.$router.push(item.link)
        }
      },
      getIndex() {
        return Array.prototype.slice.call(arguments).join('-')
      },
      toggleMenu() {
        this.isCollapse = !this.isCollapse
      },
      scrollInit() {
        this.$nextTick(() => {
          this.BS = new BScroll(this.$refs.elaside, {
            mouseWheel: true
          })
        })
      },
      scrollDestroy() {
        try {
          this.BS.destroy()
        } catch (e) {
          delete this.BS
          this.BS = null
        }
      },
      getMenuList() {
        let traverse = list => {
          list.forEach(i => {
            this.menulist.push(i)
            i.items && traverse(i.items)
          })
        }
        traverse(this.menus)
        this.menuActive()   // 当你刷新的时候，使得侧边栏active
      },
      menuActive() {
        let acmenu = this.menulist.find(f => {
          return f.link === this.$route.path
        })
        this.$nextTick(() => {
          this.activeItem = acmenu ? acmenu.index : '-1'
        })
      }
    },
    mounted() {
      this.setMenus()
      this.getMenuList()
      this.scrollInit()
    },
    beforeDestroy() {
      this.scrollDestroy()
    },
    watch: {
      '$route.path' () {
        this.menuActive()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/theme.styl'
  .aside-wrapper
    /*overflow: hidden*/
    .el-menu-vertical-demo:not(.el-menu--collapse)
      width: 200px
    .elaside
      overflow-y: hidden
      box-sizing: content-box
      height: calc(100vh - 60px)
      transition: width .5s
      background-color: $navbarColor
      .el-menu
        border: none
        background: $menuColor
        .el-submenu__title
          span
            font-size: 12px
        .el-menu-item,.el-submenu__title
          color: $normalFontColor
          line-height: 40px
          height: 40px
          &.is-active
            color: $activeFontColor
            background: $activeColor
            span
              font-weight: bold
          &:hover
            background: $activeColor
        .el-submenu
          .el-menu-item
            span
              padding-left: 25px
              font-size: 12px
      .sidebar-icon
        vertical-align: middle
        margin-right: 5px
        width: 24px
        text-align: center
        font-size: 12px
      .el-icon-arrow-down
        font-size: 10px
      .el-submenu__title
        font-size: 0

</style>
