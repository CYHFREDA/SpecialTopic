// auth.js
async function authenticate(action) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const endpoint = action === 'login' ? '/api/login' : '/api/register';
    const successMessage = action === 'login' ? '登入成功！' : '註冊成功，請登入！';
    const alertMessage = action === 'login' ? '登入失敗：' : '註冊失敗：';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            if (action === 'login') {
                alert(successMessage);
                window.location.href = '/control'; // 登入成功後跳轉到控制台
            } else {
                alert(successMessage);
            }
        } else {
            const errorResponse = await response.json();
            console.error(`${action} error:`, errorResponse);
            alert(alertMessage + (errorResponse.message || '未知錯誤'));
        }
    } catch (error) {
        console.error('Network error:', error);
        alert(alertMessage + '無法連接到伺服器');
    }
}
