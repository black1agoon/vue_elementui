export const PARAMS = {
  REGIONS: {
    north: {},
    south: {}
  },
  FORM_INFO: [
    {
      name: '编码',
      value: 'code'
    }, {
      name: '值',
      value: 'valuez'
    }, {
      name: '备注',
      value: 'memo',
      type: 'textarea',
      autosize: {
        minRows: 5,
        maxRows: 5
      }
    }
  ],
  RULES: {
    code: [{
      required: true, message: '请输入编码', trigger: ['blur', 'change']
    }],
    valuez: [{
      required: true, message: '请输入值', trigger: ['blur', 'change']
    }]
  },
  FORM_DATA: {
    code: null,
    valuez: null,
    memo: null
  },
  FORM_OPTIONS: {}
}

export const NUMBER = {
  REGIONS: {
    north: {},
    south: {}
  },
  FORM_INFO: [
    {
      name: '编码',
      value: 'code'
    }, {
      name: '前缀',
      value: 'prefix'
    }, {
      name: '名称',
      value: 'name'
    }, {
      name: '当前数值',
      value: 'serialCurrentNum',
      type: 'number'
    }, {
      name: '序列号位数',
      value: 'serialNumFormat',
      type: 'number'
    }, {
      name: '重置类型',
      value: 'resetType',
      type: 'select'
    }, {
      name: '日期格式',
      value: 'dateFormat',
      type: 'select'
    }, {
      name: '启用公司识别码',
      value: 'compIdentifyFlag',
      type: 'ratio'
    }, {
      name: '公司识别码',
      value: 'compIdentifyCode'
    }
  ],
  RULES: {
    code: [{
      required: true, message: '请输入编码', trigger: ['blur', 'change']
    }],
    prefix: [{
      required: true, message: '请输入前缀', trigger: ['blur', 'change']
    }],
    name: [{
      required: true, message: '请输入名称', trigger: ['blur', 'change']
    }],
    serialCurrentNum: [{
      required: true, message: '请输入当前数值', trigger: ['blur', 'change']
    }],
    serialNumFormat: [{
      required: true, message: '请输入序列号位数', trigger: ['blur', 'change']
    }],
    resetType: [{
      required: true, message: '请选择重置类型', trigger: ['blur', 'change']
    }]
  },
  FORM_DATA: {
    code: null,         // 编码
    prefix: null,       // 前缀
    name: null,         // 名称
    serialCurrentNum: 0,  // 当前数值
    serialNumFormat: null,  // 序列号位数
    resetType: null,     // 重置类型 1按日, 2按月， 3按年
    dateFormat: null,  // 日期格式
    compIdentifyFlag: 1, // 公司识别码 0 禁用 1 启用
    compIdentifyCode: null, // 公司识别码
    suffixFlag: 0,   // 是否启用后缀 0 禁用 1 启用
    suffix: null,   // 后缀
    suffixType: null  // 后缀类型
  },
  FORM_OPTIONS: {
    resetType: [{
      label: '按日',
      value: 1
    }, {
      label: '按月',
      value: 2
    }, {
      label: '按年',
      value: 3
    }],
    compIdentifyFlag: [{
      label: '禁用',
      value: 0
    }, {
      label: '启用',
      value: 1
    }],
    suffixFlag: [{
      label: '禁用',
      value: 0
    }, {
      label: '启用',
      value: 1
    }],
    dateFormat: [{
      value: 'yy',
      label: 'yy'
    }, {
      value: 'yyyy',
      label: 'yyyy'
    }, {
      value: 'yyMM',
      label: 'yyMM'
    }, {
      value: 'yyyyMM',
      label: 'yyyyMM'
    }, {
      value: 'yyMMdd',
      label: 'yyMMdd'
    }, {
      value: 'yyyyMMdd',
      label: 'yyyyMMdd'
    }]
  }
}

export const MENU = {
  REGIONS: {
    north: {},
    middle: {
      west: {
        style: {
          width: 250
        }
      },
      center: {}
    }
  },
  FORM_INFO: [
    {
      name: '名称',
      value: 'name'
    }, {
      name: '备注',
      value: 'memo'
    }, {
      name: '终端',
      value: 'channel',
      type: 'select'
    }, {
      name: '权限',
      value: 'permission'
    }, {
      name: '类型',
      value: 'resourceType',
      type: 'select'
    }, {
      name: 'URL',
      value: 'url'
    }, {
      name: '上级菜单',
      value: 'pid',
      type: 'treeselect'
    }, {
      name: '键名',
      value: 'btnKey'
    }, {
      name: '图标',
      value: 'logo'
    }, {
      name: '排序',
      value: 'seq',
      type: 'number'
    }
  ],
  FORM_DATA: {
    name: null, // 名称
    memo: null, // 备注
    url: null, // URL
    seq: null, // 排序
    pid: null, // 上级菜单
    resourceType: null, // 类型
    logo: null, // 图标
    btnKey: null, // 键名
    channel: 0, // 使用渠道
    permission: null // 权限
  },
  FORM_OPTIONS: {
    resourceType: [{
      value: '0',
      label: '文件夹'
    }, {
      value: '1',
      label: '页面'
    }, {
      value: '2',
      label: '按钮'
    }, {
      value: '3',
      label: '权限'
    }, {
      value: '9',
      label: '子系统'
    }],
    channel: [{
      value: 0,
      label: 'PC端'
    }, {
      value: 1,
      label: 'APP端'
    }],
  },
  RULES: {
    name: [
      {required: true, message: '请输入名称', trigger: 'blur'}
    ],
    resourceType: [
      {required: true, message: '请选择类型', trigger: 'change'}
    ],
    permission: [
      {required: true, message: '请输入权限', trigger: 'blur'}
    ],
    pid: [
      {required: true, message: '请选择父级', trigger: 'change'}
    ],
    url: [
      {required: true, message: '请输入URL', trigger: 'blur'}
    ],
    channel: [
      {required: true, message: '请选择终端', trigger: 'change'}
    ],
    btnKey: [
      {required: true, message: '请输入键名', trigger: 'blur'}
    ]
  }
}

export const MOCK = {
  regions: {
    north: {},
    middle: {
      center: {
        style: {
          flex: 1
        }
      }
    }
  },
  formdata: {
    name: null,
    education: null,
    phone: null,
    profession: null,
    graduationschool: null,
    email: null,
  },
  forminfo: [
    {
      name: '姓名',
      value: 'name'
    }, {
      name: '学历',
      value: 'education'
    }, {
      name: '手机',
      value: 'phone'
    }, {
      name: '职业',
      value: 'profession'
    }, {
      name: '毕业学校',
      value: 'graduationschool'
    }, {
      name: '邮箱',
      value: 'email'
    }
  ],
  rules: {},
  formOptions: {}
}
