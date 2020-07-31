export const CONTROLLER = {
  REGIONS: {
    north: {},
    center: {},
    middle: {
    },
    south: {
      style: {
        flex: 1
      }
    }
  },
  FORM_INFO: [
    {
      name: '类型名称',
      value: 'name'
    }, {
      name: '是否默认',
      value: 'pretermission',
      type: 'ratio'
    }
  ],
  RULES: {
    name: [{
      required: true, message: '请输入类型名称', trigger: ['blur', 'change']
    }]
  },
  FORM_DATA: {
    name: null,
    pretermission: 0
  },
  FORM_OPTIONS: {
    pretermission: [{
      label: '是',
      value: 1
    }, {
      label: '否',
      value: 0
    }]
  },
  SEARCH_INFO: [
    {
      label: '工位编码',
      value: 'stationCode'
    }, {
      label: '任务状态',
      value: 'state',
      type: 'select'
    }, {
      label: '操作任务',
      value: 'currentWork',
      type: 'select'
    }, {
      label: '订单编号',
      value: 'orderNumber'
    }, {
      label: '明细编号',
      value: 'detailNumber'
    }],
  SEARCH_DATA: {
    state: null,
    stationCode: null,
    orderNumber: null,
    detailNumber: null,
    currentWork: null
  },
  SEARCH_OPTIONS: {
    state: [{
      label: '完成',
      value: 1
    }, {
      label: '生产',
      value: 0
    }],
    currentWork: [{
      label: '生产中',
      value: 1
    }, {
      label: '非生产',
      value: 0
    }]
  },
  SEARCH_FUNS: (val, method, _this) => {
    let funs = {
    }
    funs[val][method].call(this)
  }
}


