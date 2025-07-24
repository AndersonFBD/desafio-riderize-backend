import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./graphql";
import { prisma, GraphQLContext as Context } from "./graphql/context";
import "dotenv/config";

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const userId = req.headers.authorization ?? null;
      return { prisma, userId };
    },
  });
  console.log(`🚀 Server rodando em: ${url}`);
}

main();
