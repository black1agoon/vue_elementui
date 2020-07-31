<template>
  <div class="table-wrapper">
    <el-table
        ref="table"
        class="table"
        :row-class-name="options.rowClassName"
        :data="options.data"
        :span-method="options.objectSpanMethod"
        style="width: 100%"
        size="mini"
        height="数值无关紧要，但必须要设置"
        header-row-class-name="header-class"
        :highlight-current-row="highlightCurrentRow"
        @selection-change="(...params) => todoEvent('handleSelectionChange', ...params)"
        @row-click="(...params) => todoEvent('rowClick', ...params)"
        @row-dblclick="(...params) => todoEvent('rowDblclick', ...params)">
      <el-table-column
          v-if="showSelection"
          type="selection"
          width="50"
          fixed>
      </el-table-column>
      <el-table-column
          v-if="showIndex"
          type="index"
          width="40"
          fixed>
      </el-table-column>
      <slot name="prev"></slot>
      <template v-for="(item) in (options.columns)">
        <template v-if="item.slot">
          <slot :name="item.prop"></slot>
        </template>
        <el-table-column
            v-else-if="item.click && item.type !== 'picture'"
            :key="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :fixed="item.fixed"
            :align="item.align"
            :sortable="item.sortable">
          <template slot-scope="scope">
          <span class="click-span" @click="handleClick(scope.row)">{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column
            v-else-if="item.type === 'picture'"
            :key="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :fixed="item.fixed"
            :align="item.align"
            :sortable="item.sortable">
          <template slot-scope="scope">
            <div class="image-wrap">
              <img v-if="scope.row[item.prop]"
                   @click="showFullpic(scope.row[item.prop])"
                   :src="helper.getImgUrl(scope.row[item.prop])">
            </div>
          </template>
        </el-table-column>
        <el-table-column
            v-else-if="item.showTips"
            :key="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :fixed="item.fixed"
            :align="item.align || 'center'"
            :sortable="item.sortable">
          <template slot-scope="scope" >
            <el-tooltip :content="scope.row[item.prop]"
                        placement="bottom-start" effect="light">
              <span>{{scope.row[item.prop]}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
            v-else
            :prop="item.prop"
            :key="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :fixed="item.fixed"
            :align="item.align || 'center'"
            :sortable="item.sortable">
        </el-table-column>
      </template>
        <!--<el-table-column-->
            <!--v-for="(item, index) in (options.columns)"-->
            <!--:prop="item.prop"-->
            <!--:key="index"-->
            <!--:label="item.label"-->
            <!--:width="item.width"-->
            <!--:min-width="item.minWidth"-->
            <!--:fixed="item.fixed"-->
            <!--:align="item.align"-->
            <!--:sortable="item.sortable">-->
        <!--</el-table-column>-->
      <slot></slot>
    </el-table>
    <el-pagination
        v-if="showPagination"
        class="pagination"
        :current-page.sync="options.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :layout="layout"
        :small="true"
        :total="options.total">
      <div class="slot-refresh">
        <span class="fa fa-refresh" @click="refresh"></span>
      </div>
    </el-pagination>
    <!--<span v-show="showRefresh && showPagination" class="refresh fa fa-refresh" @click="refresh"></span>-->
    <pic-looking-mask
        ref="piclook"
        :src="showPicUrl">
    </pic-looking-mask>
  </div>
</template>

<script>
  import helper from '@/app/app.helpers'
  import PicLookingMask from '@/app/tools/PicLookingMask'
  export default {
    name: 'eui-table',
    props: {
      options: {
        type: Object,
        default: () => ({
          data: [],
          total: 0,
          currentPage: 1,
          columns: []
        })
      },
      showPagination: {
        type: Boolean,
        default: true
      },
      showIndex: {
        type: Boolean,
        default: true
      },
      showSelection: {
        type: Boolean,
        default: false
      },
      pageSize: {
        type: Number,
        default: 10
      },
      layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper, slot'
      },
      showRefresh: {
        type: Boolean,
        default: true
      },
      highlightCurrentRow: {
        type: Boolean,
        default: false
      }
    },
    components: {
      PicLookingMask
    },
    data() {
      return {
        helper,
        showPicUrl: null,
        currentPage: 1,
        selectionList: []
      }
    },
    methods: {
      todoEvent(name, ...params) {
        if (this.options[name]) {
          this.options[name](...params)
        }
      },
      handleSizeChange(pageSize) {
        this.options['reload']('pageSize', pageSize)
        // this.$emit('reloadTable', 'pageSize', pageSize)
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.options['reload']('page', page)
        // this.$emit('reloadTable', 'page', page)
      },
      refresh() {
        this.options['reload']()
      },
      callByName(fn, ...args) {
        this.$refs.table[fn].call(this, ...args)
      },
      columnsSort(list) {
        // return list.sort((a, b) => a.req - b.req)
        return list
      },
      handleClick(row) {
        this.$emit('fieldClick', row)
      },
      showFullpic(url) {
        this.showPicUrl = url
        this.$refs.piclook.show()
      }
    },
    watch: {
      'currentPage'() {
        if (this.options.data.length === 0) {
          this.$emit('reloadTable', 'page', this.currentPage)
        }
      }
    },
    mounted() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .table-wrapper
    display: flex
    flex-direction: column
    flex: 1
    width: 100%
    height: 100%
    padding: 0 10px
    box-sizing: border-box
    /*background: #ebf1f6*/
    .table
      flex: 1
      border-top: 1px solid #eee
      .click-span
        font-weight: bold
        color: #409eff
        cursor: pointer
      .image-wrap
        width: 100%
        height: 100%
        line-height: 0 !important
        img
          width: 100%
          height: 50px
          cursor: pointer
    .pagination
      padding: 5px
      border-bottom: 1px solid #eee
      .slot-refresh
        display: inline-block
        text-align: center
        cursor: pointer
        margin-left: 10px
        span
          font-size: 16px
        &:hover
          color: #409EFF
    .refresh
      position: absolute
      display: block
      width: 38px
      height: 38px
      bottom: 0
      right: 0
      line-height: 38px
      cursor: pointer
      text-align: center
      &:hover
        color: #409EFF

  /deep/ .header-class
    color: #000
</style>
<style>
  .el-table th > .cell {
    color: #000;
    font-weight: bold;
  }

  /*.el-table__body tr.current-row > td,*/
  /*.el-table__body tr.hover-row > td,*/
  /*.el-table__body tr.hover-row.current-row > td {*/
    /*!*background-color: rgba(102, 177, 255, .4) !important;*!*/
    /*background-color: rgba(255, 255, 255, 1)*/
  /*}*/

  .el-table--border th {
    padding: 0;
    background: #ebf1f6;
  }

  .el-table {
    color: #333;
  }

  .el-table--small td {
    padding: 4px 0;
    background: #fff;
  }

  .el-table .cell {
    white-space: nowrap;
  }

  .el-table .cell i {
    vertical-align: top;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .el-table__fixed-right::before, .el-table__fixed::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0;
    background-color: #ebeef5;
    z-index: 4;
  }
  .el-table__fixed-right, .el-table__fixed {
    box-shadow: none !important;
    /*right: 8px !important;*/
    height: calc(100% - 10px) !important;
  }
  .el-table__body-wrapper {
    /*margin-bottom: 5px*/
  }
  .el-table--small td, .el-table--small th {
    padding: 5px 0 !important;
  }
  .el-table .cell {
    /*line-height: 50px !important;*/
    white-space: nowrap !important;
  }
  .el-table__fixed-right::before, .el-table__fixed::before {
    height: 0
  }
  .el-table .header-class th {
    background: #f7f7f7;
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-pagination
    background: #fff
    /deep/ .el-input__inner
      height: 22px
      line-height: 22px
    /deep/ .el-input__icon
      line-height: 22px
</style>