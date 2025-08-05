echo "# contract_demo" >> README.mdimport mockData, { delay, mockResponse } from './mock';

// 用户登录
export async function login(data) {
    await delay(500); // 模拟网络延迟
    
    const { username, password } = data;
    const user = mockData.users.find(
        u => u.username === username && u.password === password
    );
    
    if (user) {
        // 生成模拟token
        const token = `mock-token-${Date.now()}`;
        // 存储到localStorage，模拟登录状态
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify({
            id: user.id,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            roles: user.roles
        }));
        
        return mockResponse({
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                avatar: user.avatar
            }
        });
    } else {
        return mockResponse(null, 401, '用户名或密码错误');
    }
}

// 获取用户信息
export async function getUserInfo() {
    await delay(300);
    
    const token = localStorage.getItem('token');
    if (!token) {
        return mockResponse(null, 401, '未登录或登录已过期');
    }
    
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
        return mockResponse(null, 401, '未找到用户信息');
    }
    
    const userInfo = JSON.parse(userInfoStr);
    const user = mockData.users.find(u => u.id === userInfo.id);
    
    if (!user) {
        return mockResponse(null, 404, '用户不存在');
    }
    
    return mockResponse({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        departmentId: user.departmentId,
        department: mockData.departments.find(d => d.id === user.departmentId)?.name || '',
        status: user.status,
        roles: user.roles
    });
}

// 用户登出
export async function logout() {
    await delay(200);
    
    // 清除本地存储的登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    
    return mockResponse(null);
}

// 获取用户列表
export async function getUserList(params) {
    await delay(300);
    
    let { keyword, status, departmentId, pageNum = 1, pageSize = 10 } = params || {};
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);
    
    // 过滤用户
    let filteredUsers = [...mockData.users];
    
    if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
            user.username.toLowerCase().includes(lowerKeyword) || 
            user.name.toLowerCase().includes(lowerKeyword) ||
            user.email.toLowerCase().includes(lowerKeyword)
        );
    }
    
    if (status) {
        filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    if (departmentId) {
        filteredUsers = filteredUsers.filter(user => user.departmentId === Number(departmentId));
    }
    
    // 计算分页
    const total = filteredUsers.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const pagedUsers = filteredUsers.slice(start, end);
    
    // 添加部门名称
    const usersWithDepartment = pagedUsers.map(user => ({
        ...user,
        department: mockData.departments.find(d => d.id === user.departmentId)?.name || ''
    }));
    
    return mockResponse({
        list: usersWithDepartment,
        total,
        pageNum,
        pageSize
    });
}

// 添加用户
export async function addUser(data) {
    await delay(500);
    
    // 检查用户名是否已存在
    const existingUser = mockData.users.find(u => u.username === data.username);
    if (existingUser) {
        return mockResponse(null, 400, '用户名已存在');
    }
    
    // 生成新用户ID
    const newId = Math.max(...mockData.users.map(u => u.id)) + 1;
    
    // 创建新用户
    const newUser = {
        id: newId,
        username: data.username,
        name: data.name,
        password: data.password,
        email: data.email,
        phone: data.phone,
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        departmentId: Number(data.departmentId),
        status: data.status || '1',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        roles: data.roleIds.map(roleId => {
            const role = mockData.roles.find(r => r.id === Number(roleId));
            return {
                id: role.id,
                name: role.name,
                code: role.code
            };
        })
    };
    
    // 添加到用户列表
    mockData.users.push(newUser);
    
    return mockResponse(newUser);
}

// 更新用户
export async function updateUser(data) {
    await delay(500);
    
    // 查找用户
    const userIndex = mockData.users.findIndex(u => u.id === Number(data.id));
    if (userIndex === -1) {
        return mockResponse(null, 404, '用户不存在');
    }
    
    // 检查用户名是否已被其他用户使用
    const existingUser = mockData.users.find(u => u.username === data.username && u.id !== Number(data.id));
    if (existingUser) {
        return mockResponse(null, 400, '用户名已存在');
    }
    
    // 更新用户信息
    const updatedUser = {
        ...mockData.users[userIndex],
        username: data.username,
        name: data.name,
        email: data.email,
        phone: data.phone,
        departmentId: Number(data.departmentId),
        status: data.status,
        roles: data.roleIds.map(roleId => {
            const role = mockData.roles.find(r => r.id === Number(roleId));
            return {
                id: role.id,
                name: role.name,
                code: role.code
            };
        })
    };
    
    // 如果提供了新密码，则更新密码
    if (data.password) {
        updatedUser.password = data.password;
    }
    
    // 更新用户列表
    mockData.users[userIndex] = updatedUser;
    
    return mockResponse(updatedUser);
}

// 删除用户
export async function deleteUser(id) {
    await delay(500);
    
    // 查找用户
    const userIndex = mockData.users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
        return mockResponse(null, 404, '用户不存在');
    }
    
    // 删除用户
    mockData.users.splice(userIndex, 1);
    
    return mockResponse(null);
}

// 更新用户状态
export async function updateUserStatus(id, status) {
    await delay(300);
    
    // 查找用户
    const userIndex = mockData.users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
        return mockResponse(null, 404, '用户不存在');
    }
    
    // 更新状态
    mockData.users[userIndex].status = status;
    
    return mockResponse(null);
}

// 重置密码
export async function resetPassword(id) {
    await delay(500);
    
    // 查找用户
    const userIndex = mockData.users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
        return mockResponse(null, 404, '用户不存在');
    }
    
    // 重置密码为默认密码
    mockData.users[userIndex].password = '123456';
    
    return mockResponse(null);
}