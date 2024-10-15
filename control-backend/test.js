const http = require('http');

// 測試是否能啟動服務
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running!');
});

server.listen(5002, () => {
  console.log('測試伺服器在連接埠 5002 上運行');
});

// 假設您有一個正常執行的代碼功能
setTimeout(() => {
  console.log('程式碼運行順利!');
  process.exit(0); // 正常退出
}, 1000); // 延遲1秒以確認服務已啟動
