export const QUARTZJOB = {
  WINDOW_NAME: '定时任务',
  REGIONS: {
    north: {},
    south: {}
  },
  FORM_INFO: [
    {
      name: '任务名称',
      value: 'jobName'
    }, {
      name: '任务分组',
      value: 'jobGroup',
      type: 'select'
    }, {
      name: '调用目标字符串',
      value: 'invokeTarget'
    }, {
      name: 'cron表达式',
      value: 'cronExpression'
    }, {
      name: '执行策略',
      value: 'misfirePolicy',
      type: 'radio'
    }, {
      name: '并发执行',
      value: 'concurrent',
      type: 'radio'
    }, {
      name: '状态',
      value: 'status',
      type: 'radio'
    }, {
      name: '开始时间',
      value: 'startTime',
      type: 'datetime'
    }, {
      name: '结束时间',
      value: 'endTime',
      type: 'datetime'
    }, {
      name: '备注',
      value: 'memo',
      type: 'textarea',
      autosize: {
        minRows: 4,
        maxRows: 4
      }
    }
  ],
  RULES: {
    jobName: [{
      required: true, message: '请输入任务名称', trigger: ['blur', 'change']
    }],
    cronExpression: [{
      required: true, message: '请输入cron表达式', trigger: ['blur', 'change']
    }],
    invokeTarget: [{
      required: true, message: '请输入调用目标字符串', trigger: ['blur', 'change']
    }],
    jobGroup: [{
      required: true, message: '请输入选择任务分组', trigger: ['blur', 'change']
    }]
  },
  FORM_DATA: {
    concurrent: 0, // 是否并发执行(0允许 1禁止)
    cronExpression: '1 1 * * * ?', // 执行表达式
    invokeTarget: 'testTask.quartzTest', // 调用目标字符串
    jobGroup: null, // 任务组名
    jobName: null, // 任务名称
    memo: null, // 备注
    misfirePolicy: 1, // 计划执行策略
    status: 0 // 状态(0正常 1暂停)
  },
  FORM_OPTIONS: {
    jobGroup: [],
    concurrent: [
      {
        label: '允许',
        value: 0
      }, {
        label: '禁止',
        value: 1
      }
    ],
    status: [
      {
        label: '正常',
        value: 0
      }, {
        label: '暂停',
        value: 1
      }
    ],
    misfirePolicy: [
      {
        label: '立即执行',
        value: '1'
      }, {
        label: '执行一次',
        value: '2'
      }, {
        label: '放弃执行',
        value: '3'
      }
    ]
  },
  SEARCH_OPTIONS: {
    width: 500,
    fieldSearch: {
      jobName: {
        placeholder: '任务名称',
        sm: 8
      }
    },
    conditionSearch: {
      status: {
        placeholder: '状态',
        type: 'select',
        options: [
          {
            label: '正常',
            value: 0
          }, {
            label: '暂停',
            value: 1
          }
        ],
        sm: 8
      },
      jobGroup: {
        type: 'select',
        options: [],
        placeholder: '任务分组',
        sm: 8
      }
    }
  }
}

export const GROUP = {
  WINDOW_NAME: '任务分组',
  REGIONS: {
    north: {},
    south: {}
  },
  FORM_INFO: [
    {
      name: '分组名称',
      value: 'groupName'
    }
  ],
  RULES: {
    groupName: [{
      required: true, message: '请输入分组名称', trigger: ['blur', 'change']
    }]
  },
  FORM_DATA: {
    groupName: null
  },
  FORM_OPTIONS: {
  }
}

export const DETAIL = {
  REGIONS: {
    north: {},
    south: {}
  },
  FORM_INFO: [
    {
      name: '任务名称',
      value: 'jobName'
    }, {
      name: '任务分组',
      value: 'jobGroupName'
    }, {
      name: '调用目标字符串',
      value: 'invokeTarget'
    }, {
      name: '日志信息',
      value: 'jobMessage'
    }, {
      name: '执行状态',
      value: 'status'
    }
  ],
  FORM_DATA: {
    jobName: null,
    jobGroupName: null,
    invokeTarget: null,
    jobMessage: null,
    status: null
  }
}