const http = require('http');

// 測試是否能啟動服務
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running!');
});

server.listen(5001, () => {
  console.log('Test server is running on port 5001');
});

// 假設您有一個正常執行的代碼功能
setTimeout(() => {
  console.log('Code is running smoothly!');
  process.exit(0); // 正常退出
}, 1000); // 延遲1秒以確認服務已啟動
