import { ApolloServer } from "apollo-server";
import IthenticateAPI from "./dataSource/IthenticateAPI";
import resolvers from "./schema/resolvers";
import typeDefs from "./schema/typeDefs";

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ithenticateAPI: new IthenticateAPI(),
  }),
  cors: {
    origin: ["null", "http://local.live.test.cheggnet.com"],
    credentials: true,
  },
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
