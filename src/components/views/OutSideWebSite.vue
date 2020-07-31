<template>
  <div class="iframe-wrapper">
    <iframe :src="linkUrl"></iframe>
  </div>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        linkUrl: '',
        title: ''
      }
    },
    methods: {
      routeChange(_this, _$route) {
        if (!_this.title || (_this.title && _this.title !== _$route.query.title)) {
          _this.title = _$route.query.title
          _this.linkUrl = _$route.query.url
          _this.$store.commit('admin/UPDATE_TAB', {
            ..._$route,
            title: _$route.query.title
          })
        }
      }
    },
    mounted() {
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routeChange(vm, to)
      })
    },
    watch: {
      '$route' () {
        console.log(this.$route)
        this.$route.path.startsWith('/outside') && this.routeChange(this, this.$route)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.iframe-wrapper
  width: 100%
  height: 100%
  iframe
    width: 100%
    height: 100%
</style>
