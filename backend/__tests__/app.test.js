const request = require('supertest');
const app = require('../app');

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
}));

describe('GET /', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
