export const GROUP = {
  REGIONS: {
    north: {},
    middle: {
      center: {
        style: {
          flex: 1
        }
      }
    },
    south: {
      style: {
        flex: 1
      }
    }
  },
  FORM_INFO: [
    {
      name: '角色名称',
      value: 'name'
    }, {
      name: '角色描述',
      value: 'description',
      type: 'textarea',
      autosize: {
        minRows: 6,
        maxRows: 6
      }
    }
  ],
  RULES: {
    name: [{
      required: true, message: '请输入角色名称', trigger: ['blur', 'change']
    }]
  },
  FORM_DATA: {
    name: null,
    description: null
  },
  FORM_OPTIONS: {}
}

export const PERMISSION = {
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
      value: '3',
      label: '权限'
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

export const CLIENT = {
  REGIONS: {
    north: {},
    middle: {
      west: {},
      center: {}
    }
  },
  FORM_INFO: [
    {
      name: '客户端ID',
      value: 'username'
    }, {
      name: '客户端名称',
      value: 'name'
    }, {
      name: '拼音码',
      value: 'hotkey'
    }, {
      name: '手机号码',
      value: 'mobile',
      type: 'number'
    }
    // , {
    //   name: '头像',
    //   value: 'avatar'
    // }
    , {
      name: '联系电话',
      value: 'contactTel',
      type: 'number'
    }, {
      name: '过期时间',
      value: 'expireTime',
      type: 'date'
    }, {
      name: '分组',
      value: 'clientPieceId',
      type: 'treeselect'
    }, {
      name: '邮箱',
      value: 'email'
    }, {
      name: '地址',
      value: 'address',
      sm: 16,
      type: 'textarea'
    }, {
      name: '备注',
      value: 'memo',
      sm: 24,
      type: 'textarea'
    }
  ],
  RULES: {
    username: [{
      required: true, message: '请输入用户名', trigger: ['blur', 'change']
    }, {
      min: 4, message: '用户名长度至少为4位', trigger: ['blur', 'change']
    }],
    name: [{
        required: true, message: '请输入真实姓名', trigger: ['blur', 'change']
    }],
    email: [
      {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
    ],
    mobile: [
      {required: true, message: '请输入手机号码', trigger: ['blur', 'change']},
      {
        validator: (rule, value, callback) => {
          if (/^1[34578]\d{9}$/.test(value) === false && value) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }],
    clientPieceId: [
      {required: true, message: '请选择所属分组', trigger: ['blur', 'change']}
    ]
  },
  FORM_DATA: {
    avatar: null,
    name: null,
    username: null,  // 用户名
    hotkey: null, //
    mobile: null, // 手机号码
    expireTime: null, // 过期时间
    email: null, // 邮箱
    enabled: 1, // 是否1：启动，0：禁用
    memo: null, // 备注
    clientPieceId: null, // 分组
    address: null // 地址
  },
  FORM_OPTIONS: {
    clientPieceId: []
  }
}

export const PIECE = {
  WINDOW_NAME: '分组',
  REGIONS: {
    north: {},
    middle: {
      west: {},
      center: {}
    }
  },
  FORM_INFO: [
    {
      name: '名称',
      value: 'name'
    }, {
      name: '上级',
      value: 'pid',
      type: 'treeselect'
    }, {
      name: '排序',
      value: 'seq'
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
  FORM_DATA: {
    name: null,
    pid: null,
    seq: null,
    memo: null // 备注
  },
  FORM_OPTIONS: {
    pid: []
  },
  RULES: {
    name: [{
      required: true, message: '请输入名称', trigger: ['blur', 'change']
    }],
    pid: [{
      required: true, message: '请选择上级目录', trigger: ['blur', 'change']
    }]
  }
}
