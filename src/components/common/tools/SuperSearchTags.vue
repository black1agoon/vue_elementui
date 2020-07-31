<template>
  <div class="tags-wrap" v-show="taglist.length > 0">
    <el-tag
        size="small"
        v-for="(tag, index) in taglist"
        :key="tag.name"
        @close="tagClose(index)"
        closable>
      {{tag.label}}:{{tag.value}}
    </el-tag>
  </div>
</template>

<script>
  export default {
    name: 'super-search-tags',
    props: {
      tags: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        taglist: []
      }
    },
    methods: {
      tagClose(index) {
        // this.$refs.supersearch.emptyValue(this.taglist[index].name)
        this.$emit('emptySearch', this.taglist[index].name)
        this.taglist.splice(index, 1)
      },
      tagsChange(tags) {
        this.taglist = tags
      }
    },
    watch: {
      'tags'() {
        this.taglist = this.tags
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tags-wrap
    padding-top: 10px
    .el-tag
      margin-right: 10px
</style>