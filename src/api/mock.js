// 模拟延迟
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟响应
export const mockResponse = (data, code = 200, message = 'success') => {
    return {
        code,
        message,
        data
    };
};

// 模拟数据
const mockData = {
    // 用户数据
    users: [
        {
            id: 1,
            username: 'admin',
            name: '系统管理员',
            password: '123456',
            email: 'admin@example.com',
            phone: '13800138000',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            departmentId: 1,
            status: '1',
            createTime: '2023-01-01 00:00:00',
            roles: [
                { id: 1, name: '系统管理员', code: 'admin' }
            ]
        },
        {
            id: 2,
            username: 'user',
            name: '普通用户',
            password: '123456',
            email: 'user@example.com',
            phone: '13900139000',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            departmentId: 2,
            status: '1',
            createTime: '2023-01-02 00:00:00',
            roles: [
                { id: 4, name: '普通员工', code: 'user' }
            ]
        },
        {
            id: 3,
            username: 'finance',
            name: '财务人员',
            password: '123456',
            email: 'finance@example.com',
            phone: '13700137000',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            departmentId: 2,
            status: '1',
            createTime: '2023-01-03 00:00:00',
            roles: [
                { id: 3, name: '财务人员', code: 'finance' }
            ]
        }
    ],

    // 部门数据
    departments: [
        {
            id: 1,
            name: '总经办',
            code: 'CEO',
            parentId: 0,
            status: '1',
            createTime: '2023-01-01 00:00:00'
        },
        {
            id: 2,
            name: '财务部',
            code: 'FIN',
            parentId: 0,
            status: '1',
            createTime: '2023-01-01 00:00:00'
        },
        {
            id: 3,
            name: '人力资源部',
            code: 'HR',
            parentId: 0,
            status: '1',
            createTime: '2023-01-01 00:00:00'
        },
        {
            id: 4,
            name: '技术部',
            code: 'TECH',
            parentId: 0,
            status: '1',
            createTime: '2023-01-01 00:00:00'
        },
        {
            id: 5,
            name: '销售部',
            code: 'SALES',
            parentId: 0,
            status: '1',
            createTime: '2023-01-01 00:00:00'
        },
        {
            id: 6,
            name: '采购部',
            code: 'PURCHASE',
            parentId: 0,
            status: '1',
            createTime: '2023-01-01 00:00:00'
        }
    ],

    // 角色数据
    roles: [
        {
            id: 1,
            name: '系统管理员',
            code: 'admin',
            status: '1',
            createTime: '2023-01-01 00:00:00',
            permissions: ['*']
        },
        {
            id: 2,
            name: '部门经理',
            code: 'manager',
            status: '1',
            createTime: '2023-01-01 00:00:00',
            permissions: ['contract:view', 'contract:add', 'contract:edit', 'contract:approve']
        },
        {
            id: 3,
            name: '财务人员',
            code: 'finance',
            status: '1',
            createTime: '2023-01-01 00:00:00',
            permissions: ['contract:view', 'payment:view', 'payment:add', 'receipt:view', 'receipt:add']
        },
        {
            id: 4,
            name: '普通员工',
            code: 'user',
            status: '1',
            createTime: '2023-01-01 00:00:00',
            permissions: ['contract:view']
        }
    ],

    // 付款类合同数据
    paymentContracts: [
        {
            id: 'PC-2023-001',
            name: '办公设备采购合同',
            contractNo: 'PC-2023-001',
            type: '采购合同',
            partyA: '我方公司',
            partyB: '供应商A',
            signDate: '2023-01-15',
            startDate: '2023-01-20',
            endDate: '2023-12-31',
            amount: 50000,
            paidAmount: 30000,
            unpaidAmount: 20000,
            status: '执行中',
            createUser: '张三',
            createTime: '2023-01-10 10:00:00',
            approvalStatus: '已审批',
            department: '采购部',
            attachments: [
                { name: '合同文本.pdf', url: '/files/contract1.pdf' },
                { name: '设备清单.xlsx', url: '/files/list1.xlsx' }
            ],
            paymentPlan: [
                { id: 1, planDate: '2023-02-15', planAmount: 20000, status: '已支付', actualDate: '2023-02-16', actualAmount: 20000 },
                { id: 2, planDate: '2023-05-15', planAmount: 10000, status: '已支付', actualDate: '2023-05-17', actualAmount: 10000 },
                { id: 3, planDate: '2023-09-15', planAmount: 20000, status: '未支付', actualDate: '', actualAmount: 0 }
            ]
        },
        {
            id: 'PC-2023-002',
            name: '软件开发服务合同',
            contractNo: 'PC-2023-002',
            type: '服务合同',
            partyA: '我方公司',
            partyB: '软件开发公司B',
            signDate: '2023-02-10',
            startDate: '2023-02-15',
            endDate: '2023-08-15',
            amount: 200000,
            paidAmount: 100000,
            unpaidAmount: 100000,
            status: '执行中',
            createUser: '李四',
            createTime: '2023-02-05 14:30:00',
            approvalStatus: '已审批',
            department: '技术部',
            attachments: [
                { name: '合同文本.pdf', url: '/files/contract2.pdf' },
                { name: '需求说明书.docx', url: '/files/requirements.docx' }
            ],
            paymentPlan: [
                { id: 4, planDate: '2023-03-15', planAmount: 60000, status: '已支付', actualDate: '2023-03-16', actualAmount: 60000 },
                { id: 5, planDate: '2023-05-15', planAmount: 40000, status: '已支付', actualDate: '2023-05-17', actualAmount: 40000 },
                { id: 6, planDate: '2023-08-15', planAmount: 100000, status: '未支付', actualDate: '', actualAmount: 0 }
            ]
        },
        {
            id: 'PC-2023-003',
            name: '办公场所租赁合同',
            contractNo: 'PC-2023-003',
            type: '租赁合同',
            partyA: '我方公司',
            partyB: '房地产公司C',
            signDate: '2023-03-01',
            startDate: '2023-04-01',
            endDate: '2024-03-31',
            amount: 360000,
            paidAmount: 90000,
            unpaidAmount: 270000,
            status: '执行中',
            createUser: '王五',
            createTime: '2023-02-25 09:15:00',
            approvalStatus: '已审批',
            department: '行政部',
            attachments: [
                { name: '合同文本.pdf', url: '/files/contract3.pdf' },
                { name: '场地照片.zip', url: '/files/photos.zip' }
            ],
            paymentPlan: [
                { id: 7, planDate: '2023-04-01', planAmount: 90000, status: '已支付', actualDate: '2023-04-01', actualAmount: 90000 },
                { id: 8, planDate: '2023-07-01', planAmount: 90000, status: '未支付', actualDate: '', actualAmount: 0 },
                { id: 9, planDate: '2023-10-01', planAmount: 90000, status: '未支付', actualDate: '', actualAmount: 0 },
                { id: 10, planDate: '2024-01-01', planAmount: 90000, status: '未支付', actualDate: '', actualAmount: 0 }
            ]
        }
    ],

    // 收款类合同数据
    receiptContracts: [
        {
            id: 'RC-2023-001',
            name: '产品销售合同',
            contractNo: 'RC-2023-001',
            type: '销售合同',
            partyA: '客户公司A',
            partyB: '我方公司',
            signDate: '2023-01-20',
            startDate: '2023-01-25',
            endDate: '2023-12-31',
            amount: 150000,
            receivedAmount: 50000,
            unreceiveAmount: 100000,
            status: '执行中',
            createUser: '赵六',
            createTime: '2023-01-18 11:20:00',
            approvalStatus: '已审批',
            department: '销售部',
            attachments: [
                { name: '合同文本.pdf', url: '/files/contract4.pdf' },
                { name: '产品清单.xlsx', url: '/files/products.xlsx' }
            ],
            receiptPlan: [
                { id: 11, planDate: '2023-02-25', planAmount: 50000, status: '已收款', actualDate: '2023-02-26', actualAmount: 50000 },
                { id: 12, planDate: '2023-06-25', planAmount: 50000, status: '未收款', actualDate: '', actualAmount: 0 },
                { id: 13, planDate: '2023-10-25', planAmount: 50000, status: '未收款', actualDate: '', actualAmount: 0 }
            ]
        },
        {
            id: 'RC-2023-002',
            name: '技术服务合同',
            contractNo: 'RC-2023-002',
            type: '服务合同',
            partyA: '客户公司B',
            partyB: '我方公司',
            signDate: '2023-02-15',
            startDate: '2023-03-01',
            endDate: '2023-08-31',
            amount: 80000,
            receivedAmount: 40000,
            unreceiveAmount: 40000,
            status: '执行中',
            createUser: '钱七',
            createTime: '2023-02-10 16:45:00',
            approvalStatus: '已审批',
            department: '技术部',
            attachments: [
                { name: '合同文本.pdf', url: '/files/contract5.pdf' },
                { name: '服务说明.docx', url: '/files/service.docx' }
            ],
            receiptPlan: [
                { id: 14, planDate: '2023-03-15', planAmount: 40000, status: '已收款', actualDate: '2023-03-16', actualAmount: 40000 },
                { id: 15, planDate: '2023-08-15', planAmount: 40000, status: '未收款', actualDate: '', actualAmount: 0 }
            ]
        },
        {
            id: 'RC-2023-003',
            name: '咨询顾问合同',
            contractNo: 'RC-2023-003',
            type: '咨询合同',
            partyA: '客户公司C',
            partyB: '我方公司',
            signDate: '2023-03-10',
            startDate: '2023-03-15',
            endDate: '2023-09-15',
            amount: 120000,
            receivedAmount: 60000,
            unreceiveAmount: 60000,
            status: '执行中',
            createUser: '孙八',
            createTime: '2023-03-05 10:30:00',
            approvalStatus: '已审批',
            department: '咨询部',
            attachments: [
                { name: '合同文本.pdf', url: '/files/contract6.pdf' },
                { name: '咨询方案.pptx', url: '/files/plan.pptx' }
            ],
            receiptPlan: [
                { id: 16, planDate: '2023-03-20', planAmount: 60000, status: '已收款', actualDate: '2023-03-21', actualAmount: 60000 },
                { id: 17, planDate: '2023-06-20', planAmount: 30000, status: '未收款', actualDate: '', actualAmount: 0 },
                { id: 18, planDate: '2023-09-15', planAmount: 30000, status: '未收款', actualDate: '', actualAmount: 0 }
            ]
        }
    ],

    // 付款记录
    payments: [
        {
            id: 1,
            contractId: 'PC-2023-001',
            contractName: '办公设备采购合同',
            paymentNo: 'PAY-2023-001',
            paymentDate: '2023-02-16',
            amount: 20000,
            paymentMethod: '银行转账',
            paymentAccount: '622848******1234',
            receivingUnit: '供应商A',
            receivingAccount: '622848******5678',
            receivingBank: '中国银行',
            remark: '首期款',
            createUser: '张三',
            createTime: '2023-02-16 14:30:00',
            attachments: [
                { name: '付款凭证.pdf', url: '/files/payment1.pdf' }
            ]
        },
        {
            id: 2,
            contractId: 'PC-2023-001',
            contractName: '办公设备采购合同',
            paymentNo: 'PAY-2023-002',
            paymentDate: '2023-05-17',
            amount: 10000,
            paymentMethod: '银行转账',
            paymentAccount: '622848******1234',
            receivingUnit: '供应商A',
            receivingAccount: '622848******5678',
            receivingBank: '中国银行',
            remark: '第二期款',
            createUser: '张三',
            createTime: '2023-05-17 15:20:00',
            attachments: [
                { name: '付款凭证.pdf', url: '/files/payment2.pdf' }
            ]
        },
        {
            id: 3,
            contractId: 'PC-2023-002',
            contractName: '软件开发服务合同',
            paymentNo: 'PAY-2023-003',
            paymentDate: '2023-03-16',
            amount: 60000,
            paymentMethod: '银行转账',
            paymentAccount: '622848******1234',
            receivingUnit: '软件开发公司B',
            receivingAccount: '622848******9012',
            receivingBank: '建设银行',
            remark: '首期款',
            createUser: '李四',
            createTime: '2023-03-16 10:15:00',
            attachments: [
                { name: '付款凭证.pdf', url: '/files/payment3.pdf' }
            ]
        },
        {
            id: 4,
            contractId: 'PC-2023-002',
            contractName: '软件开发服务合同',
            paymentNo: 'PAY-2023-004',
            paymentDate: '2023-05-17',
            amount: 40000,
            paymentMethod: '银行转账',
            paymentAccount: '622848******1234',
            receivingUnit: '软件开发公司B',
            receivingAccount: '622848******9012',
            receivingBank: '建设银行',
            remark: '第二期款',
            createUser: '李四',
            createTime: '2023-05-17 11:30:00',
            attachments: [
                { name: '付款凭证.pdf', url: '/files/payment4.pdf' }
            ]
        },
        {
            id: 5,
            contractId: 'PC-2023-003',
            contractName: '办公场所租赁合同',
            paymentNo: 'PAY-2023-005',
            paymentDate: '2023-04-01',
            amount: 90000,
            paymentMethod: '银行转账',
            paymentAccount: '622848******1234',
            receivingUnit: '房地产公司C',
            receivingAccount: '622848******3456',
            receivingBank: '工商银行',
            remark: '首季度租金',
            createUser: '王五',
            createTime: '2023-04-01 09:45:00',
            attachments: [
                { name: '付款凭证.pdf', url: '/files/payment5.pdf' }
            ]
        }
    ],

    // 收款记录
    receipts: [
        {
            id: 1,
            contractId: 'RC-2023-001',
            contractName: '产品销售合同',
            receiptNo: 'REC-2023-001',
            receiptDate: '2023-02-26',
            amount: 50000,
            receiptMethod: '银行转账',
            receiptAccount: '622848******1234',
            payingUnit: '客户公司A',
            payingAccount: '622848******7890',
            payingBank: '招商银行',
            remark: '首期款',
            createUser: '赵六',
            createTime: '2023-02-26 16:20:00',
            attachments: [
                { name: '收款凭证.pdf', url: '/files/receipt1.pdf' }
            ]
        },
        {
            id: 2,
            contractId: 'RC-2023-002',
            contractName: '技术服务合同',
            receiptNo: 'REC-2023-002',
            receiptDate: '2023-03-16',
            amount: 40000,
            receiptMethod: '银行转账',
            receiptAccount: '622848******1234',
            payingUnit: '客户公司B',
            payingAccount: '622848******4321',
            payingBank: '农业银行',
            remark: '首期款',
            createUser: '钱七',
            createTime: '2023-03-16 14:50:00',
            attachments: [
                { name: '收款凭证.pdf', url: '/files/receipt2.pdf' }
            ]
        },
        {
            id: 3,
            contractId: 'RC-2023-003',
            contractName: '咨询顾问合同',
            receiptNo: 'REC-2023-003',
            receiptDate: '2023-03-21',
            amount: 60000,
            receiptMethod: '银行转账',
            receiptAccount: '622848******1234',
            payingUnit: '客户公司C',
            payingAccount: '622848******8765',
            payingBank: '交通银行',
            remark: '首期款',
            createUser: '孙八',
            createTime: '2023-03-21 11:10:00',
            attachments: [
                { name: '收款凭证.pdf', url: '/files/receipt3.pdf' }
            ]
        }
    ]
};

export default mockData;