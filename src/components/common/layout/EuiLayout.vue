<template>
  <div class="layout-wrapper">
    <div v-if="defaultRegions.north" class="north" :style="getStyle(defaultRegions.north)">
      <slot name="north"></slot>
    </div>
    <div v-if="defaultRegions.middle" class="middle" :style="getStyle(defaultRegions.middle)">
      <div v-if="defaultRegions.middle.west" class="west" :style="getStyle(defaultRegions.middle.west)">
        <slot name="west"></slot>
      </div>
      <div v-if="defaultRegions.middle.center" class="center" :style="getStyle(defaultRegions.middle.center)">
        <slot name="center"></slot>
      </div>
      <div v-if="defaultRegions.middle.east" class="east" :style="getStyle(defaultRegions.middle.east)">
        <slot name="east"></slot>
      </div>
    </div>
    <div v-if="defaultRegions.south" class="south" :style="getStyle(defaultRegions.south)">
      <slot name="south"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'eui-layout',
    props: {
      regions: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
    },
    data() {
      return {
        defaultRegions: Object.assign({}, this.regions)
      }
    },
    methods: {
      getStyle(region) {
        if (region) {
          let style = region.hasOwnProperty('style') ? region.style : {}
          if (style.width) {  // 如果存在宽
            return {
              // flex: `0 0 ${style.width}`,
              flex: `0 0 ${style.width}px`,
              border: `${style.border}px`
            }
          } else if (style.height) {  // 如果存在高
            return {
              // flex: `0 0 ${style.height}`,
              flex: `0 0 ${style.height}px`,
              border: !style.border && 'none'
            }
          } else if (style.flex) {  // 如果存在flex值
            return {
              flex: style.flex,
              border: !style.border && 'none',
              padding: style.padding ? style.padding : 0  + 'px',
            }
          } else {
            return style.hasOwnProperty('border') ? {
              border: !style.border && 'none'
            } : {}
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .layout-wrapper
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    .north
      width: 100%
      flex: 0 0 40px
      border-bottom: 1px solid #ebf1f6
    .middle
      flex: 1
      width: 100%
      display: flex
      overflow: hidden
      .west
        flex: 0 0 300px
        overflow: auto
        border-right: 1px solid #ebf1f6
        padding: 10px
        box-sizing: border-box
      .center
        flex: 1
        overflow: auto
        position: relative
      .east
        flex: 0 0 250px
    .south
      width: 100%
      flex-grow: 1
      overflow: hidden
      /*flex: 0 0 50px*/
</style>
