// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { gql } from 'graphql-tag';

// describe('Auth (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   afterEach(async () => {
//     await app.close();
//   });

//   it('should return a token for valid credentials', async () => {
//     const loginInput = {
//       email: 'test@example.com',
//       password: 'password123',
//     };

//     const LOGIN_MUTATION = gql`
//       mutation Login($loginInput: LoginInput!) {
//         login(loginInput: $loginInput)
//       }
//     `;
//     console.log(LOGIN_MUTATION);
//     const response = await request(app.getHttpServer()).post('/graphql').send({
//       query: LOGIN_MUTATION.loc.source.body,
//       variables: { loginInput },
//     });
// >
//       console.log(response)
//     expect(response.status).toBe(200);
//     expect(response.body.data.login.access_token).toBeTruthy();
//   });
//   // it('should return error for invalid credentials', async () => {
//   //   const loginInput = {
//   //     email: 'wrong@example.com',
//   //     password: 'wrongpassword',
//   //   };

//   //   const response = await request(app.getHttpServer()).post('/graphql').send({
//   //     query: LOGIN_MUTATION,
//   //     variables: { loginInput },
//   //   });

//   //   expect(response.status).toBe(200);
//   //   expect(response.body.errors).toBeDefined();
//   //   expect(response.body.errors[0].message).toContain('Invalid credentials');
//   // });

//   // it('should protect routes with authentication', async () => {
//   //   const PROTECTED_QUERY = gql`
//   //     query {
//   //       protectedRoute
//   //     }
//   //   `;

//   //   const response = await request(app.getHttpServer()).post('/graphql').send({
//   //     query: PROTECTED_QUERY,
//   //   });

//   //   expect(response.status).toBe(200);
//   //   expect(response.body.errors).toBeDefined();
//   //   expect(response.body.errors[0].message).toContain('Unauthorized');
//   // });
// });
