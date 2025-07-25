import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./graphql";
import { prisma, GraphQLContext as Context } from "./graphql/context";
import { tokenReading } from "./middlewares/jwtMiddleware";
import "dotenv/config";

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // criação do header de autorização, que receberá o Bearer token
      const AuthorizationHeader = req.headers.authorization || "";
      const token = AuthorizationHeader.replace("Bearer ", "");
      let user = null;

      // altera o valor de user se houver autenticação
      if (token) {
        try {
          const decoded = tokenReading(token);
          user = await prisma.user.findUnique({
            where: {
              id: decoded.id,
            },
          });
        } catch (err) {
          console.warn("Token expirado", err);
        }
      }

      return { prisma, user };
    },
  });
  console.log(`🚀 Server rodando em: ${url}`);
}

main();
