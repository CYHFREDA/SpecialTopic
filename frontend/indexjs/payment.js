// payment.js

// 當用戶點擊支付按鈕時的事件
document.getElementById('payButton').addEventListener('click', function() {
    // 發送支付請求
    fetch('/api/create-payment') // 替換為您的後端路由
        .then(response => response.json())
        .then(data => {
            if (data.returnUrl) {
                // 將用戶導向 LINE Pay 的支付頁面
                window.location.href = data.returnUrl;
            } else {
                alert('支付請求失敗：' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
