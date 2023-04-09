import request from 'supertest';
import App from '../app';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
});

describe('Testing Index', () => {
  describe('[GET] /test', () => {
    it('response statusCode 200', () => {
      const app = new App();
      return request(app.getServer()).get('/test').expect(200);
    });
  });
});
