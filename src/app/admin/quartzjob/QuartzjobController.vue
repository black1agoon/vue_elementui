<template>
  <eui-layout :regions="REGIONS">
    <main-toolbar
        slot="north"
        :buttons="helper.getMainFilterButtons(buttons, tableButtons)"
        @click="onBtnClick">
      <super-search
          ref="search"
          v-model="query"
          :options="SEARCH_OPTIONS"
          @search="superSearch"
          slot="right"
          style="margin-right: 35px;float: right">
      </super-search>
    </main-toolbar>
    <eui-table
        class="center-wrap"
        slot="south"
        ref="table"
        :highlight-current-row="false"
        :options="tableOptions">
      <el-table-column
          slot="status"
          label="任务状态"
          :min-width="100"
          align="center">
        <template slot-scope="scope" >
          <el-switch :value="scope.row.status === 0"
                     @change="changeAble(scope.$index,scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" minWidth="200" fixed="right">
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
    <quartzjob-controller-window
        ref="window"
        :input-options="inputOptions"
        @reload="tableOptions.reload">
    </quartzjob-controller-window>
  </eui-layout>
</template>

<script>
  import api from '@/api'
  import {QUARTZJOB} from './quartzjob.config'
  import helper from '@/app/app.helpers'
  import EuiLayout from '@/components/common/layout/EuiLayout'
  import EuiTable from '@/components/common/form/EuiTable'
  import MainToolbar from '@/components/common/tools/MainToolbar'
  import QuartzjobControllerWindow from './window/QuartzjobControllerWindow'
  import SuperSearch from '@/components/common/tools/SuperSearch'
  export default {
    name: 'quartzjob-controller',
    _meta: {
      path: '/quartzjob/controller',
      title: '定时任务'
    },
    components: {
      EuiLayout,
      EuiTable,
      MainToolbar,
      QuartzjobControllerWindow,
      SuperSearch
    },
    data() {
      return {
        helper,
        REGIONS: QUARTZJOB.REGIONS,
        buttons: helper.getMainButtons(),
        tableButtons: ['btnDo', 'btnOneLog'],
        query: {
          page: 1,
          pageSize: 10,
          jobName: null,      // 编号
          jobGroup: null,   // 站点号
          status: null    // 仓库存放情况
        },
        SEARCH_OPTIONS: QUARTZJOB.SEARCH_OPTIONS,
        tableOptions: {
          data: [],
          total: 0,
          columns: [
            {prop: 'jobName', label: '任务名称', minWidth: 150},
            {prop: 'jobGroup', label: '任务组名', minWidth: 100},
            {prop: 'invokeTarget', label: '调用目标字符串', minWidth: 100},
            {prop: 'cronExpression', label: '执行表达式', minWidth: 100},
            {prop: 'status', label: '任务状态', minWidth: 100, slot: true},
            {prop: 'startTime', label: '开始时间', minWidth: 150},
            {prop: 'endTime', label: '结束时间', minWidth: 150},
            {prop: 'createTime', label: '创建时间', minWidth: 150}
          ],
          rowClassName: ({row, rowIndex}) => {
          },
          rowClick: (row, event, column) => {
            // this.formdata = {...row}
          },
          reload: (name, val) => {
            this.query.page = name === 'page' ? val : this.query.page
            this.query.pageSize = name === 'pageSize' ? val : this.query.pageSize
            this.getData(this.query)
          }
        },
        inputOptions: {
          jobGroup: []
        }
      }
    },
    methods: {
      onBtnClick(btnKey, row) {
        let btnHandlers = {
          btnAdd: () => {
            this.$refs.window.open()
          },
          btnEdit: (row) => {
            this.$refs.window.open(row)
          },
          btnDelete: (row) => {
            this.$confirm(`是否删除: ${QUARTZJOB.WINDOW_NAME} ${row.jobName}？`, '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.quartzjob.delete([row.id]).then(() => {
                this.$message({
                  message: '删除成功!',
                  type: 'success'
                })
                this.getData()
              })
            }).catch(() => {
            })
          },
          btnDo: () => {
            this.$confirm('确认要立即执行一次任务吗？', '提示', {
              iconClass: 'fa fa-question-circle'
            }).then(() => {
              api.quartzjob.run(row.id).then(() => {
                this.$message({
                  message: '执行成功!',
                  type: 'success'
                })
              }).catch(() => {
                this.$message({
                  message: '执行失败!',
                  type: 'error'
                })
              })
            }).catch(() => {
            })
          },
          btnLog: () => {
            this.$router.push('/quartzjob/log')
          },
          btnOneLog: (row) => {
            this.$router.push({
              path: '/quartzjob/log',
              query: {jobId: row.id}
            })
          }
        }
        if (btnHandlers[btnKey]) {
          btnHandlers[btnKey].call(this, row)
        }
      },
      getData() {
        api.quartzjob.paged(this.query).then(data => {
          this.tableOptions.data = data.records
          this.tableOptions.total = data.total
        })
      },
      superSearch(searchinfo) {
        this.query.page = 1
        for (let key in searchinfo) {
          this.query[key] = searchinfo[key]
        }
        this.getData()
      },
      getInputData() {
        api.quartzGroup.all().then(data => {
          if (data) {
            this.inputOptions.jobGroup = this.SEARCH_OPTIONS.conditionSearch.jobGroup.options = data.map(d => ({
              label: d.groupName,
              value: d.id
            }))
          } else {
            this.inputOptions.jobGroup = []
            this.SEARCH_OPTIONS.conditionSearch.jobGroup.options = []
          }
        })
      },
      changeAble(index, row) {
        if (row.status === 0) {
          api.quartzjob.control({
            id: row.id,
            status: 1
          }).then(() => {
            row.status = 1
            this.$notify({
              title: '',
              message: '暂停成功',
              type: 'success'
            })
          })
        } else {
          api.quartzjob.control({
            id: row.id,
            status: 0
          }).then(() => {
            row.status = 0
            this.$notify({
              title: '',
              message: '启动成功',
              type: 'success'
            })
          })
        }
      }
    },
    mounted() {
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getData()
        vm.getInputData()
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

