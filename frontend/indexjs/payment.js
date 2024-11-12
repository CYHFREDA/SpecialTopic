// 將支付邏輯封裝成 fetchPayment 函數
function fetchPayment() {
    // 發送支付請求
    fetch('/api/create-payment', { // 使用 POST 方法
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: '打賞打賞', // 這裡填寫商品名稱等必要資料
            amount: 200 // 這裡填寫支付金額等必要資料
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

// 綠界支付邏輯封裝成 fetchECPayPayment 函數
function fetchECPayPayment() {
    // 發送支付請求
    fetch('/api/create-ecpay-payment', { // 使用 POST 方法
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: '打賞打賞2', // 商品名稱
            amount: 400 // 支付金額
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('網絡錯誤：' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.paymentUrl) {
            // 將用戶導向綠界的支付頁面
            window.location.href = data.paymentUrl;
        } else {
            alert('支付請求失敗：' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 綁定 LINE Pay 支付按鈕事件
document.getElementById('payButton').addEventListener('click', function() {
    fetchPayment(); // 當按鈕被點擊時，調用 LINE Pay 的 fetchPayment 函數
});

// 綁定綠界支付按鈕事件
document.getElementById('ecpayButton').addEventListener('click', function() {
    fetchECPayPayment(); // 當按鈕被點擊時，調用綠界支付的 fetchECPayPayment 函數
});

