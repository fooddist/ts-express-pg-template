import { Server } from 'http';
import request from 'supertest';
import bootServer from '../server';

let server: Server;

beforeAll(() => {
  server = bootServer(8081);
});

test('Write your tests here', async () => {
  expect(2 + 2).toBe(4);
  await request(server).get('/').expect(404);
});

afterAll(async () => {
  await server.close();
});
