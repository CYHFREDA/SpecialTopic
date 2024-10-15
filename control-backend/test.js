// 假設這是你的業務邏輯函數
function runBusinessLogic() {
  // 這裡可以放置你的業務邏輯
  return '程式碼運行順利!';
}

// 進行簡單測試
try {
  const result = runBusinessLogic();
  console.log(result);
  process.exit(0); // 正常退出
} catch (error) {
  console.error('測試失敗:', error);
  process.exit(1); // 當有錯誤發生時返回非零退出碼
}
