import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'graphql-ws';

export const graphqlConfig = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: 'src/schema.graphql',
  sortSchema: true,
  subscriptions: {
    'graphql-ws': {
      onConnect: (context: Context<any>) => {
        const { extra } = context;
        const { request } = extra as { request: unknown };
        const { rawHeaders } = request as { rawHeaders: string[] };
        const authIndex = rawHeaders.findIndex((header) =>
          header.toLowerCase().startsWith('authorization'),
        );
        const authorization = rawHeaders[authIndex + 1];

        const cookie = rawHeaders
          .find((header) => header.startsWith('jwt='))
          ?.split('=')[1];
        if (authorization || cookie) {
          const token = authorization.split(' ')[1] || cookie;
          const jwtService = new JwtService({
            secret: process.env.JWT_SECRET,
          });
          try {
            const user = jwtService.verify(token, {
              secret: process.env.JWT_SECRET,
            }) as { [key: string]: any };

            (extra as { user: unknown }).user = { user: user };
          } catch (error) {
            throw new Error(error);
          }
        } else {
          throw new Error('Authorization header missing');
        }
      },
    },
  },
  context: ({ req, res, extra }) => {
    return { req, res, user: extra?.user?.user };
  },
});
