<template>
  <eui-layout :regions="REGIONS">
    <main-toolbar
        slot="north"
        :buttons="helper.getMainFilterButtons(buttons, tableButtons)"
        @click="onBtnClick">
      <div class="input-wrapper">
        <div class="input-box">
          <span class="label">任务名称:</span>
          <eui-input
              class="input"
              v-model="query.jobName">
          </eui-input>
        </div>
        <div class="input-box">
          <span class="label">任务分组:</span>
          <eui-input
              class="select"
              type="select"
              :options="searchOptions.jobGroup"
              v-model="query.jobGroup">
          </eui-input>
        </div>
        <div class="input-box">
          <span class="label">状态:</span>
          <eui-input
              class="select"
              type="select"
              :options="searchOptions.status"
              v-model="query.status">
          </eui-input>
        </div>
        <div class="input-box">
          <span class="label">执行时间:</span>
          <eui-input
              class="input"
              type="datetime"
              placeholder="开始时间"
              v-model="query.startTime">
          </eui-input>
          -
          <eui-input
              class="input"
              placeholder="结束时间"
              type="datetime"
              v-model="query.endTime">
          </eui-input>
        </div>
        <div class="input-box">
          <el-button class="search"
                     type="primary"
                     size="mini"
                     @click="getData">
            搜索
          </el-button>
          <el-button class="search"
                     size="mini"
                     @click="reset">
            重置
          </el-button>
        </div>
      </div>
    </main-toolbar>
    <eui-table
        class="center-wrap"
        slot="south"
        ref="table"
        :highlight-current-row="false"
        :options="tableOptions">
      <el-table-column slot="status" label="状态" align="center" minWidth="100">
        <template slot-scope="scope">
          <span class="status" :class="{error: scope.row.status === 1}">
            {{scope.row.status === 0 ? '成功' : '失败'}}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" minWidth="100" fixed="right">
        <template slot-scope="scope">
          <el-button
              v-for="(btn, index) in helper.getTableButtons(buttons, tableButtons)"
              size="mini"
              type="text"
              :key="index"
              @click="onBtnClick(btn.btnKey, scope.row)">
            <i :class="['btn-icon fa', btn.logo]"></i>{{btn.name}}
          </el-button>
        </template>
      </el-table-column>
    </eui-table>
    <quartzjob-log-detail-window ref="window">
    </quartzjob-log-detail-window>
  </eui-layout>
</template>

<script>
  import api from '@/api'
  import {DETAIL} from './quartzjob.config'
  import helper from '@/app/app.helpers'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import EuiTable from '@/components/common/form/EuiTable'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import EuiInput from '@/components/common/form/EuiInput'
  import QuartzjobLogDetailWindow from './window/QuartzjobLogDetailWindow'
  export default {
    name: 'quartzjob-log',
    _meta: {
      path: '/quartzjob/log',
      title: '调度日志'
    },
    components: {
      EuiLayout,
      EuiTable,
      MainToolbar,
      QuartzjobLogDetailWindow,
      EuiInput
    },
    data() {
      return {
        helper,
        REGIONS: DETAIL.REGIONS,
        buttons: helper.getMainButtons(),
        tableButtons: ['btnDetail'],
        query: {
          page: 1,
          pageSize: 10,
          jobId: null,
          status: null,
          endTime: null,
          startTime: null,
          jobGroup: null,
          jobName: null
        },
        searchOptions: {
          jobGroup: [],
          status: [
            {
              label: '所有',
              value: null
            },
            {
              label: '成功',
              value: 0
            }, {
              label: '失败',
              value: 1
            }
          ]
        },
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'jobName', label: '任务名称', minWidth: 100},
            {prop: 'jobGroupName', label: '任务分组', minWidth: 100},
            {prop: 'invokeTarget', label: '调用目标字符串', minWidth: 100},
            {prop: 'jobMessage', label: '日志信息', minWidth: 100},
            {prop: 'status', label: '状态', minWidth: 100, slot: true},
            {prop: 'exceptionInfo', label: '明细', minWidth: 150, showTips: true},
            {prop: 'createTime', label: '创建时间', minWidth: 100, sortable: true}
          ],
          rowClassName: ({row, rowIndex}) => {
          },
          rowClick: (row, event, column) => {
            // this.formdata = {...row}
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData()
          }
        }
      }
    },
    methods: {
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnDelete: (row) => {
            this.$confirm(`是否删除: ${DETAIL.WINDOW_NAME} ${row.groupName}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {

            }).catch(() => {
            })
          },
          btnDetail: (row) => {
            this.$refs.window.open(row)
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, row)
        }
      },
      getData() {
        api.quartzjobLog.paged(this.query).then(data => {
          if (data && data.records) {
            this.tableOptions.data = data.records
            this.tableOptions.total = data.total
            if (this.query.jobId && data.records.length > 0) {
              this.query.jobName = data.records[0].jobName
            }
          }
        })
      },
      getInputData() {
        api.quartzGroup.all().then(data => {
          this.searchOptions.jobGroup = [{
            label: '所有',
            value: null
          }]
          if (data) {
            this.searchOptions.jobGroup = this.searchOptions.jobGroup.concat(data.map(d => ({
              label: d.groupName,
              value: d.id
            })))
          }
        })
      },
      reset() {
        this.query.page = 1
        this.query.jobId = null
        this.query.status = null
        this.query.startTime = null
        this.query.endTime = null
        this.query.jobGroup = null
        this.query.jobName = null
        this.getData()
      }
    },
    mounted() {
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.query.jobId = to.query.jobId
        vm.query.jobName = to.query.jobName
        vm.getData()
        vm.getInputData()
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.input-wrapper
  display: flex !important
  line-height: 40px
  font-size: 12px
  flex-wrap: wrap
  .input-box
    white-space: nowrap
    .label
      font-size: 12px
      margin: 0 5px
    .select, .input
      width: 200px !important
    .search
      margin-left: 20px
.status
  padding: 5px 10px
  text-align: center
  font-size: 12px
  color: #ffffff
  font-weight: bold
  background: #1BB394
  &.error
    background: #ED5565
</style>

