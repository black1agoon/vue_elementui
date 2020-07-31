<template>
  <div class="btn-wrapper">
    <slot class="right" name="right"></slot>
    <div :class="['input-wrapper', {right: rightButtons.includes(btn.btnKey)}]" v-for="(btn, index) in buttons" :key="index">
      <el-input v-if="btn.btnKey === 'btnSingleSearch'"
                round
                :placeholder="btn.memo"
                v-model="searchword"
                class="input-with-select"
                :clearable="true"
                @clear="onBtnClick(btn.btnKey+'Clear')">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="onBtnClick(btn.btnKey, searchword)">
        </el-button>
      </el-input>
      <el-dropdown
          v-else-if="btn.btnKey.startsWith('btnSplit')">
        <el-button type="primary" size="mini" round>
          {{btn.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
              v-for="(item,i) in btn.memo.split('&')"
              @click.native="onBtnClick(btn.btnKey + i)"
              :key="i">
            {{item}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-else
        round
        :type="btnType(btn).type"
        :size="btnType(btn).size"
        @click="onBtnClick(btn.btnKey)">
        <i :class="['btn-icon fa', btn.logo]"></i>{{btn.name}}
      </el-button>
    </div>
    <div class="input-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'MainToolbar',
    components: {
    },
    props: {
      buttons: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        searchword: null,
        rightButtons: ['btnSingleSearch']
      }
    },
    methods: {
      onBtnClick (btnKey, data) {
        this.$emit('click', btnKey, data)
      },
      btnType(btn) {
        return {
          btnAdd: {
            size: 'mini',
            type: 'primary'
          },
          btnEdit: {
            size: 'mini',
            type: 'primary'
          },
          btnDelete: {
            size: 'mini',
            type: 'primary'
          },
          btnDefault: {
            size: 'mini',
            type: 'primary'
          },
          btnSubAdd: {
            size: 'mini',
            type: 'primary'
          },
          btnSubEdit: {
            size: 'mini',
            type: 'primary'
          },
          btnSubDelete: {
            size: 'mini',
            type: 'primary'
          },
          btnBatchDelete: {
            size: 'mini',
            type: 'primary'
          }
        }[btn.btnKey] || {
          size: 'mini',
          type: 'default'
        }
      }
    },
    mounted() {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .btn-wrapper
    padding: 0 10px
    line-height: 40px
    .input-wrapper
      display: inline-block
      margin-right: 10px
      &.right
        float: right
      /deep/ .el-input__inner
        height: 28px
    .el-button--mini, .el-button--mini.is-round
      padding: 7px 12px
    .btn-icon
      padding-right: 5px
    .right
      display: inline-block
      float: right
  .el-dropdown-menu
    padding: 0
    margin: 0
    border-radius: 8px
    .el-dropdown-menu__item
      padding: 0 15px
</style>

