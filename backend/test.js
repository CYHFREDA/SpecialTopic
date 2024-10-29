const axios = require('axios');

// 假設這是你的業務邏輯函數
function runBusinessLogic(input) {
  return `處理的結果: ${input}`; // 根據實際需求調整
}

// 使用完整的 URL
const apiUrl = 'http://nginx/api/records'; // 確保這是正確的 URL

// 從 API 獲取測試數據
axios.get(apiUrl)
  .then(response => {
    const testData = response.data;

    // 假設 API 返回的是一個數組，這裡只取第一個項目進行處理
    if (Array.isArray(testData) && testData.length > 0) {
      const firstItem = testData[0]; // 獲取第一個項目
      const result = runBusinessLogic(firstItem); // 處理該項目
      console.log(result);
    } else {
      console.log('測試正常!!!!');
    }

    process.exit(0); // 正常退出
  })
  .catch(error => {
    console.error('無法獲取測試數據:', error);
    process.exit(1); // 當有錯誤發生時返回非零退出碼
  });
