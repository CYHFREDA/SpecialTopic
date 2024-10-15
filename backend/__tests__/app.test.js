const request = require('supertest'); // 导入 supertest 库
const app = require('../app'); // 导入您的应用程序代码

describe('GET /', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/'); // 发起 GET 请求到根路径
    expect(response.status).toBe(200); // 期望返回 200 状态码
  });
});
