import mockData, { mockResponse, delay } from './mock';

// 获取部门列表
export async function getDepartmentList(params) {
    await delay(300);
    let { keyword, status, pageNum = 1, pageSize = 10 } = params || {};

    let filteredDepartments = [...mockData.departments];

    // 关键字过滤
    if (keyword) {
        keyword = keyword.toLowerCase();
        filteredDepartments = filteredDepartments.filter(dept =>
            dept.name.toLowerCase().includes(keyword) ||
            dept.code.toLowerCase().includes(keyword)
        );
    }

    // 状态过滤
    if (status) {
        filteredDepartments = filteredDepartments.filter(dept => dept.status === status);
    }

    // 计算分页
    const total = filteredDepartments.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredDepartments.slice(start, end);

    return mockResponse({
        list,
        total,
        pageNum: parseInt(pageNum),
        pageSize: parseInt(pageSize)
    });
}

// 添加部门
export async function addDepartment(data) {
    await delay(500);
    const newId = Math.max(...mockData.departments.map(d => d.id)) + 1;
    const newDepartment = {
        ...data,
        id: newId,
        status: data.status || '1',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    mockData.departments.push(newDepartment);
    return mockResponse({ id: newId });
}

// 更新部门
export async function updateDepartment(data) {
    await delay(500);
    const departmentIndex = mockData.departments.findIndex(d => d.id === data.id);
    if (departmentIndex === -1) {
        return mockResponse(null, 404, '部门不存在');
    }

    mockData.departments[departmentIndex] = {
        ...mockData.departments[departmentIndex],
        ...data
    };

    return mockResponse(null);
}

// 删除部门
export async function deleteDepartment(id) {
    await delay(500);
    id = parseInt(id);
    const departmentIndex = mockData.departments.findIndex(d => d.id === id);
    if (departmentIndex === -1) {
        return mockResponse(null, 404, '部门不存在');
    }

    // 检查是否有用户属于该部门
    const hasUsers = mockData.users.some(user => user.departmentId === id);
    if (hasUsers) {
        return mockResponse(null, 400, '该部门下有用户，无法删除');
    }

    mockData.departments.splice(departmentIndex, 1);
    return mockResponse(null);
}

// 获取角色列表
export async function getRoleList(params) {
    await delay(300);
    let { keyword, status, pageNum = 1, pageSize = 10 } = params || {};

    let filteredRoles = [...mockData.roles];

    // 关键字过滤
    if (keyword) {
        keyword = keyword.toLowerCase();
        filteredRoles = filteredRoles.filter(role =>
            role.name.toLowerCase().includes(keyword) ||
            role.code.toLowerCase().includes(keyword)
        );
    }

    // 状态过滤
    if (status) {
        filteredRoles = filteredRoles.filter(role => role.status === status);
    }

    // 计算分页
    const total = filteredRoles.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredRoles.slice(start, end);

    return mockResponse({
        list,
        total,
        pageNum: parseInt(pageNum),
        pageSize: parseInt(pageSize)
    });
}

// 添加角色
export async function addRole(data) {
    await delay(500);
    const newId = Math.max(...mockData.roles.map(r => r.id)) + 1;
    const newRole = {
        ...data,
        id: newId,
        status: data.status || '1',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    mockData.roles.push(newRole);
    return mockResponse({ id: newId });
}

// 更新角色
export async function updateRole(data) {
    await delay(500);
    const roleIndex = mockData.roles.findIndex(r => r.id === data.id);
    if (roleIndex === -1) {
        return mockResponse(null, 404, '角色不存在');
    }

    mockData.roles[roleIndex] = {
        ...mockData.roles[roleIndex],
        ...data
    };

    return mockResponse(null);
}

// 删除角色
export async function deleteRole(id) {
    await delay(500);
    id = parseInt(id);
    const roleIndex = mockData.roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
        return mockResponse(null, 404, '角色不存在');
    }

    // 检查是否有用户拥有该角色
    const hasUsers = mockData.users.some(user => user.roles && user.roles.some(role => role.id === id));
    if (hasUsers) {
        return mockResponse(null, 400, '该角色已分配给用户，无法删除');
    }

    mockData.roles.splice(roleIndex, 1);
    return mockResponse(null);
}

// 获取权限列表
export async function getPermissionList() {
    await delay(300);
    // 模拟权限数据
    const permissions = [
        {
            id: 1,
            name: '系统管理',
            code: 'system',
            children: [
                { id: 101, name: '用户管理', code: 'system:user' },
                { id: 102, name: '角色管理', code: 'system:role' },
                { id: 103, name: '部门管理', code: 'system:department' }
            ]
        },
        {
            id: 2,
            name: '合同管理',
            code: 'contract',
            children: [
                { id: 201, name: '付款合同管理', code: 'contract:payment' },
                { id: 202, name: '收款合同管理', code: 'contract:receipt' }
            ]
        },
        {
            id: 3,
            name: '付款管理',
            code: 'payment',
            children: [
                { id: 301, name: '付款记录管理', code: 'payment:record' }
            ]
        },
        {
            id: 4,
            name: '收款管理',
            code: 'receipt',
            children: [
                { id: 401, name: '收款记录管理', code: 'receipt:record' }
            ]
        }
    ];

    return mockResponse(permissions);
}

// 获取系统日志
export async function getSystemLog(params) {
    await delay(500);
    let { type, username, startTime, endTime, pageNum = 1, pageSize = 10 } = params || {};

    // 模拟日志数据
    const logs = [];
    const logTypes = ['登录', '操作', '异常'];
    const operations = ['登录系统', '退出系统', '新增用户', '修改用户', '删除用户', '新增合同', '修改合同', '删除合同'];
    const usernames = ['admin', 'user'];

    // 生成模拟日志数据
    for (let i = 1; i <= 100; i++) {
        const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
        const username = usernames[Math.floor(Math.random() * usernames.length)];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        logs.push({
            id: i,
            type: logType,
            username,
            operation,
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            createTime: date.toISOString().replace('T', ' ').substring(0, 19)
        });
    }

    // 过滤
    let filteredLogs = [...logs];

    if (type) {
        filteredLogs = filteredLogs.filter(log => log.type === type);
    }

    if (username) {
        filteredLogs = filteredLogs.filter(log => log.username.includes(username));
    }

    if (startTime) {
        filteredLogs = filteredLogs.filter(log => log.createTime >= startTime);
    }

    if (endTime) {
        filteredLogs = filteredLogs.filter(log => log.createTime <= endTime);
    }

    // 计算分页
    const total = filteredLogs.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredLogs.slice(start, end);

    return mockResponse({
        list,
        total,
        pageNum: parseInt(pageNum),
        pageSize: parseInt(pageSize)
    });
}

// 获取系统配置
export async function getSystemConfig() {
    await delay(300);
    // 模拟系统配置
    const config = {
        siteName: '项目合同全周期管理系统',
        logo: '/logo.png',
        footer: '© 2023 项目合同全周期管理系统',
        theme: {
            primaryColor: '#409EFF',
            menuTheme: 'dark'
        },
        security: {
            passwordExpireDays: 90,
            loginRetryLimit: 5,
            lockTime: 30
        },
        upload: {
            maxSize: 10, // MB
            allowTypes: '.jpg,.png,.pdf,.doc,.docx,.xls,.xlsx'
        }
    };

    return mockResponse(config);
}

// 更新系统配置
export async function updateSystemConfig(data) {
    await delay(500);
    // 实际应用中这里会更新配置
    return mockResponse(null);
}