import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';

describe('SignUp Routes',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return an account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Cristian',
        email: 'cristian123@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      })
      .expect(200);
  });
});
