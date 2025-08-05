import mockData, { mockResponse, delay } from './mock';

// 获取付款类合同列表
export async function getPaymentContractList(params) {
    await delay(500);
    let { keyword, status, departmentId, pageNum = 1, pageSize = 10 } = params || {};

    let filteredContracts = [...mockData.paymentContracts];

    // 关键字过滤
    if (keyword) {
        keyword = keyword.toLowerCase();
        filteredContracts = filteredContracts.filter(contract =>
            contract.contractNo.toLowerCase().includes(keyword) ||
            contract.contractName.toLowerCase().includes(keyword) ||
            contract.partyB.toLowerCase().includes(keyword)
        );
    }

    // 状态过滤
    if (status) {
        filteredContracts = filteredContracts.filter(contract => contract.status === status);
    }

    // 部门过滤
    if (departmentId) {
        filteredContracts = filteredContracts.filter(contract => contract.departmentId === parseInt(departmentId));
    }

    // 计算分页
    const total = filteredContracts.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredContracts.slice(start, end);

    return mockResponse({
        list,
        total,
        pageNum: parseInt(pageNum),
        pageSize: parseInt(pageSize)
    });
}

// 获取收款类合同列表
export async function getReceiptContractList(params) {
    await delay(500);
    let { keyword, status, departmentId, pageNum = 1, pageSize = 10 } = params || {};

    let filteredContracts = [...mockData.receiptContracts];

    // 关键字过滤
    if (keyword) {
        keyword = keyword.toLowerCase();
        filteredContracts = filteredContracts.filter(contract =>
            contract.contractNo.toLowerCase().includes(keyword) ||
            contract.contractName.toLowerCase().includes(keyword) ||
            contract.partyA.toLowerCase().includes(keyword)
        );
    }

    // 状态过滤
    if (status) {
        filteredContracts = filteredContracts.filter(contract => contract.status === status);
    }

    // 部门过滤
    if (departmentId) {
        filteredContracts = filteredContracts.filter(contract => contract.departmentId === parseInt(departmentId));
    }

    // 计算分页
    const total = filteredContracts.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredContracts.slice(start, end);

    return mockResponse({
        list,
        total,
        pageNum: parseInt(pageNum),
        pageSize: parseInt(pageSize)
    });
}

// 获取合同详情
export async function getContractDetail(id) {
    await delay(300);
    id = parseInt(id);

    // 先查找付款类合同
    let contract = mockData.paymentContracts.find(c => c.id === id);

    // 如果没找到，再查找收款类合同
    if (!contract) {
        contract = mockData.receiptContracts.find(c => c.id === id);
    }

    if (!contract) {
        return mockResponse(null, 404, '合同不存在');
    }

    // 获取付款/收款记录
    let records = [];
    if (contract.contractType === '1') { // 付款类合同
        records = mockData.payments.filter(p => p.contractId === id);
    } else { // 收款类合同
        records = mockData.receipts.filter(r => r.contractId === id);
    }

    return mockResponse({
        ...contract,
        records
    });
}

// 添加付款类合同
export async function addPaymentContract(data) {
    await delay(500);
    const newId = Math.max(...mockData.paymentContracts.map(c => c.id), 0) + 1;
    const userId = localStorage.getItem('userId');
    const user = mockData.users.find(u => u.id === parseInt(userId));

    const newContract = {
        ...data,
        id: newId,
        contractType: '1', // 付款类合同
        paidAmount: 0,
        unpaidAmount: data.contractAmount,
        status: '1', // 默认为有效状态
        createUserId: user ? user.id : 1,
        createUserName: user ? user.name : '管理员',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    mockData.paymentContracts.push(newContract);
    return mockResponse({ id: newId });
}

// 添加收款类合同
export async function addReceiptContract(data) {
    await delay(500);
    const newId = Math.max(...mockData.receiptContracts.map(c => c.id), 0) + 1;
    const userId = localStorage.getItem('userId');
    const user = mockData.users.find(u => u.id === parseInt(userId));

    const newContract = {
        ...data,
        id: newId,
        contractType: '2', // 收款类合同
        receivedAmount: 0,
        unreceiveAmount: data.contractAmount,
        status: '1', // 默认为有效状态
        createUserId: user ? user.id : 1,
        createUserName: user ? user.name : '管理员',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    mockData.receiptContracts.push(newContract);
    return mockResponse({ id: newId });
}

// 更新合同
export async function updateContract(data) {
    await delay(500);
    const id = data.id;

    // 判断是付款类合同还是收款类合同
    let contractIndex = mockData.paymentContracts.findIndex(c => c.id === id);
    let isPaymentContract = true;

    if (contractIndex === -1) {
        contractIndex = mockData.receiptContracts.findIndex(c => c.id === id);
        isPaymentContract = false;

        if (contractIndex === -1) {
            return mockResponse(null, 404, '合同不存在');
        }
    }

    if (isPaymentContract) {
        // 更新付款类合同
        mockData.paymentContracts[contractIndex] = {
            ...mockData.paymentContracts[contractIndex],
            ...data,
            // 保持一些字段不被覆盖
            contractType: '1',
            paidAmount: mockData.paymentContracts[contractIndex].paidAmount,
            unpaidAmount: data.contractAmount - mockData.paymentContracts[contractIndex].paidAmount
        };
    } else {
        // 更新收款类合同
        mockData.receiptContracts[contractIndex] = {
            ...mockData.receiptContracts[contractIndex],
            ...data,
            // 保持一些字段不被覆盖
            contractType: '2',
            receivedAmount: mockData.receiptContracts[contractIndex].receivedAmount,
            unreceiveAmount: data.contractAmount - mockData.receiptContracts[contractIndex].receivedAmount
        };
    }

    return mockResponse(null);
}

// 删除合同
export async function deleteContract(id) {
    await delay(500);
    id = parseInt(id);

    // 判断是付款类合同还是收款类合同
    let contractIndex = mockData.paymentContracts.findIndex(c => c.id === id);
    let isPaymentContract = true;

    if (contractIndex === -1) {
        contractIndex = mockData.receiptContracts.findIndex(c => c.id === id);
        isPaymentContract = false;

        if (contractIndex === -1) {
            return mockResponse(null, 404, '合同不存在');
        }
    }

    if (isPaymentContract) {
        mockData.paymentContracts.splice(contractIndex, 1);
    } else {
        mockData.receiptContracts.splice(contractIndex, 1);
    }

    return mockResponse(null);
}

// 变更合同状态
export async function changeContractStatus(id, status) {
    await delay(300);
    id = parseInt(id);

    // 判断是付款类合同还是收款类合同
    let contractIndex = mockData.paymentContracts.findIndex(c => c.id === id);
    let isPaymentContract = true;

    if (contractIndex === -1) {
        contractIndex = mockData.receiptContracts.findIndex(c => c.id === id);
        isPaymentContract = false;

        if (contractIndex === -1) {
            return mockResponse(null, 404, '合同不存在');
        }
    }

    if (isPaymentContract) {
        mockData.paymentContracts[contractIndex].status = status;
    } else {
        mockData.receiptContracts[contractIndex].status = status;
    }

    return mockResponse(null);
}

// 添加付款记录
export async function addPaymentRecord(contractId, data) {
    await delay(500);
    contractId = parseInt(contractId);

    // 查找合同
    const contractIndex = mockData.paymentContracts.findIndex(c => c.id === contractId);
    if (contractIndex === -1) {
        return mockResponse(null, 404, '合同不存在');
    }

    const contract = mockData.paymentContracts[contractIndex];
    const newId = Math.max(...mockData.payments.map(p => p.id), 0) + 1;
    const userId = localStorage.getItem('userId');
    const user = mockData.users.find(u => u.id === parseInt(userId));

    // 创建新的付款记录
    const newPayment = {
        id: newId,
        contractId,
        paymentNo: `FKD-${contract.contractNo}-${mockData.payments.filter(p => p.contractId === contractId).length + 1}`,
        paymentAmount: data.paymentAmount,
        paymentDate: data.paymentDate,
        paymentType: data.paymentType,
        paymentAccount: data.paymentAccount,
        receiverAccount: data.receiverAccount,
        status: '1',
        createUserId: user ? user.id : 1,
        createUserName: user ? user.name : '管理员',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        remark: data.remark
    };

    mockData.payments.push(newPayment);

    // 更新合同的已付款金额和未付款金额
    mockData.paymentContracts[contractIndex].paidAmount += parseFloat(data.paymentAmount);
    mockData.paymentContracts[contractIndex].unpaidAmount = parseFloat(contract.contractAmount) - parseFloat(mockData.paymentContracts[contractIndex].paidAmount);

    return mockResponse({ id: newId });
}

// 添加收款记录
export async function addReceiptRecord(contractId, data) {
    await delay(500);
    contractId = parseInt(contractId);

    // 查找合同
    const contractIndex = mockData.receiptContracts.findIndex(c => c.id === contractId);
    if (contractIndex === -1) {
        return mockResponse(null, 404, '合同不存在');
    }

    const contract = mockData.receiptContracts[contractIndex];
    const newId = Math.max(...mockData.receipts.map(r => r.id), 0) + 1;
    const userId = localStorage.getItem('userId');
    const user = mockData.users.find(u => u.id === parseInt(userId));

    // 创建新的收款记录
    const newReceipt = {
        id: newId,
        contractId,
        receiptNo: `SKD-${contract.contractNo}-${mockData.receipts.filter(r => r.contractId === contractId).length + 1}`,
        receiptAmount: data.receiptAmount,
        receiptDate: data.receiptDate,
        receiptType: data.receiptType,
        receiptAccount: data.receiptAccount,
        payerAccount: data.payerAccount,
        status: '1',
        createUserId: user ? user.id : 1,
        createUserName: user ? user.name : '管理员',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        remark: data.remark
    };

    mockData.receipts.push(newReceipt);

    // 更新合同的已收款金额和未收款金额
    mockData.receiptContracts[contractIndex].receivedAmount += parseFloat(data.receiptAmount);
    mockData.receiptContracts[contractIndex].unreceiveAmount = parseFloat(contract.contractAmount) - parseFloat(mockData.receiptContracts[contractIndex].receivedAmount);

    return mockResponse({ id: newId });
}

// 上传合同附件
export async function uploadContractAttachment(contractId, formData) {
    await delay(1000); // 模拟上传时间
    return mockResponse({
        id: Date.now(),
        name: formData.get('file').name,
        url: URL.createObjectURL(formData.get('file')),
        size: formData.get('file').size,
        type: formData.get('file').type,
        uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
}

// 删除合同附件
export async function deleteContractAttachment(contractId, attachmentId) {
    await delay(300);
    return mockResponse(null);
}

// 获取合同统计数据
export async function getContractStatistics() {
    await delay(500);

    // 计算付款合同总金额
    const totalPaymentAmount = mockData.paymentContracts.reduce((sum, contract) => sum + parseFloat(contract.contractAmount), 0);
    const totalPaidAmount = mockData.paymentContracts.reduce((sum, contract) => sum + parseFloat(contract.paidAmount), 0);

    // 计算收款合同总金额
    const totalReceiptAmount = mockData.receiptContracts.reduce((sum, contract) => sum + parseFloat(contract.contractAmount), 0);
    const totalReceivedAmount = mockData.receiptContracts.reduce((sum, contract) => sum + parseFloat(contract.receivedAmount), 0);

    // 按月统计付款合同金额
    const paymentMonthlyData = Array(12).fill(0);
    mockData.paymentContracts.forEach(contract => {
        const month = new Date(contract.signDate).getMonth();
        paymentMonthlyData[month] += parseFloat(contract.contractAmount);
    });

    // 按月统计收款合同金额
    const receiptMonthlyData = Array(12).fill(0);
    mockData.receiptContracts.forEach(contract => {
        const month = new Date(contract.signDate).getMonth();
        receiptMonthlyData[month] += parseFloat(contract.contractAmount);
    });

    return mockResponse({
        paymentContractCount: mockData.paymentContracts.length,
        receiptContractCount: mockData.receiptContracts.length,
        totalPaymentAmount,
        totalPaidAmount,
        totalReceiptAmount,
        totalReceivedAmount,
        paymentMonthlyData,
        receiptMonthlyData
    });
}