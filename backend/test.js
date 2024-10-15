const axios = require('axios');

// 假設這是你的業務邏輯函數
function runBusinessLogic(input) {
  return `處理的結果: ${input}`;
}

// 使用完整的 URL
const apiUrl = 'http://nginx/api/announcements'; // 確保這是正確的 URL

// 從 API 獲取測試數據
axios.get(apiUrl)
  .then(response => {
    const testData = response.data;
    try {
      const result = runBusinessLogic(testData);
      console.log(result);
      process.exit(0); // 正常退出
    } catch (error) {
      console.error('測試失敗:', error);
      process.exit(1); // 當有錯誤發生時返回非零退出碼
    }
  })
  .catch(error => {
    console.error('無法獲取測試數據:', error);
    process.exit(1); // 當有錯誤發生時返回非零退出碼
  });
