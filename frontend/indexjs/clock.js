// clock.js
async function clockIn() {
    const username = document.getElementById('user').value;
    try {
        const response = await fetch('/api/clock-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (response.ok) {
            alert('打卡上班成功！');
        } else {
            const errorResponse = await response.json();
            console.error('Clock-in error:', errorResponse);
            alert('打卡上班失敗，請檢查用戶名。');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('打卡上班失敗：無法連接到伺服器');
    }
}

async function clockOut() {
    const username = document.getElementById('user').value;
    try {
        const response = await fetch('/api/clock-out', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (response.ok) {
            alert('打卡下班成功！');
        } else {
            const errorResponse = await response.json();
            console.error('Clock-out error:', errorResponse);
            alert('打卡下班失敗，請檢查用戶名。');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('打卡下班失敗：無法連接到伺服器');
    }
}
