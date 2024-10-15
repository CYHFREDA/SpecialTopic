// __tests__/app.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

// 模擬 mongoose 的方法
jest.mock('mongoose', () => {
  const mMongoose = {
    connect: jest.fn().mockResolvedValue({}),
    set: jest.fn(),
    Schema: jest.fn().mockImplementation(() => {
      return {}; // 模擬 Schema 的返回值
    }),
    model: jest.fn().mockImplementation(() => {
      return {}; // 模擬 model 的返回值
    }),
    disconnect: jest.fn().mockResolvedValue({}), // 模擬 disconnect 方法
  };
  return mMongoose;
});

describe('GET /', () => {
  // beforeAll(async () => {
  //   // 這裡可以模擬連接或其他需要執行的前置操作
  // });

  afterAll(async () => {
    // 可以在這裡關閉 mongoose 連接
    await mongoose.disconnect();
  });

  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
