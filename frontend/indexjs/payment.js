// 將支付邏輯封裝成 fetchPayment 函數
function fetchPayment() {
    // 發送支付請求
    fetch('/api/create-payment', { // 使用 POST 方法
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: '商品名稱', // 這裡填寫商品名稱等必要資料
            amount: 1000 // 這裡填寫支付金額等必要資料
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('網絡錯誤：' + response.status);
        }
        return response.json();
    })
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
}

// 綁定支付按鈕事件
document.getElementById('payButton').addEventListener('click', function() {
    fetchPayment(); // 當按鈕被點擊時，調用 fetchPayment 函數
});
