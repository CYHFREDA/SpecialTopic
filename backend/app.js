require('dotenv').config(); // 加載環境變數

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
// Line Messaging API 的 Channel Access Token，請替換為你的 Token
const channelAccessToken = 'yFIX0XKAtgJykeAfoHdXFqjUIvEdoRfU5dKwzCG4tApHQ7eJRKTTrHd708yY86w01Syqj3u2q794ec2rCF+ctmmEJqQVE0XPspzDLedecfU+SudW232DOWbUr62LSlmBDM4t20xXogjgpx3ZQgCFOQdB04t89/1O/w1cDnyilFU='

app.use(bodyParser.json());
app.use(cors());

// 使用環境變數來讀取 MongoDB 連接字串
const MONGO_URI = process.env.MONGO_URI; // 確保 MONGO_URI 被加載

mongoose.set('strictQuery', true);
// 連接 MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB 連接成功'))
    .catch(err => console.error('MongoDB 連接錯誤:', err));

// 打卡記錄 Schema
const clockSchema = new mongoose.Schema({
    user: String,
    time: Date,
    type: { type: String, enum: ['上班打卡', '下班打卡'] }
});

const ClockRecord = mongoose.model('ClockRecord', clockSchema);

// 用戶 Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// 註冊新用戶
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 檢查用戶是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '用戶名已被佔用。' }); // 400 Bad Request
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.sendStatus(201); // 201 Created
    } catch (error) {
        console.error('註冊錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 登入
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            // 登入成功，不需要返回 JWT
            res.json({ message: '登入成功' });
        } else {
            return res.status(401).json({ message: '用戶名或密碼錯誤。' }); // 401 Unauthorized
        }
    } catch (error) {
        console.error('登入錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 打卡上班
app.post('/api/clock-in', async (req, res) => {
    try {
        const { username } = req.body; // 獲取用戶名稱
        if (!username) {
            return res.status(400).json({ message: '缺少用戶名稱' }); // 400 Bad Request
        }
        
        // 查找用戶以確認其存在
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: '用戶不存在' }); // 404 Not Found
        }

        const record = new ClockRecord({ user: username, time: new Date(), type: '上班打卡' });
        await record.save();        
        res.sendStatus(200); // 200 OK
    } catch (error) {
        console.error('打卡上班錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 打卡下班
app.post('/api/clock-out', async (req, res) => {
    try {
        const { username } = req.body; // 獲取用戶名稱
        if (!username) {
            return res.status(400).json({ message: '缺少用戶名稱' }); // 400 Bad Request
        }

         // 查找用戶以確認其存在
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: '用戶不存在' }); // 404 Not Found
        }

        const record = new ClockRecord({ user: username, time: new Date(), type: '下班打卡' });
        await record.save();
        res.sendStatus(200); // 200 OK
    } catch (error) {
        console.error('打卡下班錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 查詢打卡記錄
app.get('/api/records', async (req, res) => {
    try {
        const records = await ClockRecord.find();
        res.json(records);
    } catch (error) {
        console.error('查詢打卡記錄錯誤:', error);
        res.sendStatus(500); // 500 Internal Server Error
    }
});

// 刪除打卡記錄
app.delete('/api/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ClockRecord.findByIdAndDelete(id);
        if (result) {
            res.sendStatus(204); // 204 No Content
        } else {
            res.sendStatus(404); // 404 Not Found
        }
    } catch (error) {
        console.error('刪除打卡紀錄錯誤:', error);
        res.status(500).json({ error: '刪除打卡紀錄時發生錯誤。' });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Webhook 端點
app.post('/webhook', async (req, res) => {
    const currentTime = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    console.log(`[${currentTime}] Webhook received!`);

    const events = req.body.events;

    for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') { // 確保是文本訊息
            const userId = event.source.userId; // 獲取用戶 ID
            const userMessage = event.message.text; // 獲取用戶發送的訊息
            console.log(`[${currentTime}] 接收到的 User ID:`, userId);
            console.log(`[${currentTime}] 接收到的訊息:`, userMessage);

            // 根據用戶的訊息進行回覆
            const replyMessage = handleMessage(userMessage);
            await sendLineMessage(userId, replyMessage);
        } else {
            console.log('未處理的事件類型或非文本訊息:', event);
        }
    }

    res.sendStatus(200); // 回應 200 OK
});

// 根據用戶的訊息處理回覆
function handleMessage(message) {
    // 根據不同的訊息內容生成回覆
    if (message.includes('打卡')) {
        return '您已成功打卡！';
    } else if (message.includes('你好')) {
        return '您好！有什麼可以幫助您的嗎？';
    } else {
        return '謝謝您的訊息！我們會盡快回覆您！';
    }
}

// 發送訊息到特定用戶的函數
async function sendLineMessage(userId, message) {
    const url = 'https://api.line.me/v2/bot/message/push';

    const data = {
        to: userId,
        messages: [
            {
                type: 'text',
                text: message
            }
        ]
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${channelAccessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('訊息發送成功！');
        } else {
            console.log(`訊息發送失敗，狀態碼：${response.status}`);
        }
    } catch (error) {
        console.error('發送訊息時發生錯誤:', error);
    }
}

// 交易記錄 Schema
const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    amount: Number,
    currency: String,
    status: String, // 假設這裡有交易狀態
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// 實現 getTransactionDetails 函數
const getTransactionDetails = async (transactionId) => {
    try {
        // 假設您使用 mongoose 與 MongoDB
        const transaction = await Transaction.findOne({ transactionId });
        console.log('查詢的交易資料:', transaction);
        return transaction;
    } catch (error) {
        console.error('查詢交易詳細資料時發生錯誤:', error);
        return null; // 返回 null 如果查詢失敗
    }
};



// LINE Pay API 配置
const channelID = '2006462420'; 
const channelSecret = '8c832c018d09a8be1738b32a3be1ee0a'; 

// 創建支付的 API
app.post('/api/create-payment', async (req, res) => {
    const orderId = `o_${Date.now()}`; // 生成唯一的訂單 ID
    const amount = 200; // 您可以根據需要調整金額
    const currency = 'TWD'; // 或 'JPY'

    const paymentData = {
        amount,
        currency,
        orderId,
        productName: "Line Pay",
        productImageUrl: "https://play-lh.googleusercontent.com/227YjLBcUSi_M1OZ6GGFlcfZ9vCi9bZ79SmTMDffF79n0DbcjlAmBIB-V2O7-lOb3xac",
        confirmUrl: "http://192.168.61.15/api/transaction",
        ReturnURL: 'https://192.168.61.15',
    };

    try {
        const response = await axios.post('https://sandbox-api-pay.line.me/v2/payments/request', paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'X-LINE-ChannelId': channelID,
                'X-LINE-ChannelSecret': channelSecret,
            },
        });

        // 記錄響應信息
        console.log('API 響應:', response.data);
        console.log('生成的交易 ID:', response.data.info.transactionId);
        
        if (response.data && response.data.info && response.data.info.paymentUrl) {
            // 儲存交易資料到資料庫
            const transaction = new Transaction({
                transactionId: response.data.info.transactionId, // 獲取交易 ID
                amount,
                currency,
                status: '待處理' // 或根據實際情況設置狀態
            });

            console.log('儲存交易資料:', transaction);
            await transaction.save();

            res.json({ 
                returnUrl: response.data.info.paymentUrl.web,
                transactionId: response.data.info.transactionId // 添加交易 ID 
            });
            
        } else {
            res.status(501).json({ message: '支付請求成功，但未返回有效的付款網址' });
        }
    } catch (error) {
        // 記錄錯誤信息
        console.error('支付請求錯誤:', error.response ? error.response.data : error.message);
        res.status(500).json({
            message: '支付請求失敗',
            error: error.response ? error.response.data : error.message,
        });
    }
});

//訂單返回的路徑
app.get('/api/transaction', async (req, res) => {
    const transactionId = req.query.transactionId;

    // 查詢交易細節
    const transactionDetails = await getTransactionDetails(transactionId);
    console.log('查詢的 transactionId:', transactionId);
    if (transactionDetails) {
        // 根據交易狀態決定是否重定向
        if (transactionDetails.status === '成功') {
            // 重定向到打卡頁面或適當的頁面
            res.redirect('/'); // 根據您的需求替換這裡的路由
        } else {
            res.send('交易未成功，請稍後重試。');
        }
    } else {
        res.status(404).send('找不到交易資料');
    }
});

// 綠界支付
app.post('/api/create-ecpay-payment', async (req, res) => {
    const { productName, amount } = req.body;

    const orderData = {
        MerchantID: '3002599',  // 測試特店編號
        MerchantTradeNo: 'DT' + Math.floor(Date.now() / 1000),  // 訂單編號
        MerchantTradeDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        PaymentType: 'aio',
        TotalAmount: amount,
        TradeDesc: '打賞支付',
        ItemName: productName,
        ReturnURL: 'https://192.168.61.15',  // 支付完成返回的 URL
        HashKey: 'spPjZn66i0OhqJsQ',  // 串接金鑰
        HashIV: 'hT5OJckN45isQTTs'    // 串接加密向量
    };

    // 計算並設置支付簽名
    const generateCheckMacValue = (data) => {
        const stringA = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
        const stringB = `HashKey=${data.HashKey}&${stringA}&HashIV=${data.HashIV}`;
        return crypto.createHash('sha256').update(stringB, 'utf8').digest('hex').toUpperCase();
    };

    // 計算支付請求的簽名
    const checkMacValue = generateCheckMacValue(orderData);

    // 添加簽名到請求資料
    orderData.CheckMacValue = checkMacValue;

    // 儲存交易資料到資料庫
    const transaction = new Transaction({
        transactionId: orderData.MerchantTradeNo,  // 訂單編號作為交易 ID
        amount,
        currency: 'TWD',  // 設置貨幣類型
        status: '待處理'  // 初始狀態為待處理
    });

    await transaction.save()
        .then(() => {
            console.log('交易資料儲存成功:', transaction);
        })
        .catch(error => {
            console.error('儲存交易資料時發生錯誤:', error);
            res.status(500).json({ message: '儲存交易資料時發生錯誤。' });
            return;
        });

    try {
        // 綠界支付的請求 URL
        const response = await axios.post('https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5', orderData);

        // 檢查支付回應結果
        if (response.data.Status === '1') {
            console.log('支付請求成功，返回支付網址:', response.data.PaymentURL);
            res.json({
                returnUrl: response.data.PaymentURL
            });
        } else {
            console.error('支付請求失敗，原因:', response.data.Message);
            res.status(500).json({
                message: '支付請求失敗',
                error: response.data.Message
            });
        }

    } catch (error) {
        // 記錄錯誤信息
        console.error('支付請求錯誤:', error.response ? error.response.data : error.message);
        res.status(500).json({
            message: '支付請求錯誤',
            error: error.response ? error.response.data : error.message,
        });
    }
});
