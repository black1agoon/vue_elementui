<template>
  <div class="steps-wrapper">
    <div :class="['step', {'active': activeIndex >= index}]" v-for="(step, index) in steps" :key="index">
      <span class="num">{{index + 1}}</span>
      <span class="title">{{step}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'eui-steps',
    props: {
      steps: {
        type: Array,
        default: () => []
      },
      activeIndex: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .steps-wrapper
    display: flex
    justify-content: center
    .step
      flex: 1
      /*text-align: center*/
      display: flex
      align-items: center
      justify-content: center
      &.active
        .num, .title
          opacity: 1
      &::before
        content: ""
        display: inline-block
        flex: 1
        height: 1px
        background: #e9e9e9
      &::after
        content: ""
        display: inline-block
        flex: 1
        height: 1px
        background: #e9e9e9
      &:first-child::before
        background: #ffffff
      &:last-child::after
        background: #ffffff
      .num
        display: inline-block
        width: 45px
        height: 45px
        background-image: url("../../../assets/img/steps.png")
        background-size: 45px 45px
        background-repeat: no-repeat
        line-height: 45px
        text-align: center
        color: #ffffff
        margin: 0 8px 0 16px
        opacity: 0.3
      .title
        color: rgba(0, 0, 0, .85)
        margin-right: 15px
        font-size: 16px
        opacity: 0.3
</style>
