const fastify = require("fastify")({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(require("@fastify/postgres"), {
  connectionString:
    "postgres://einstein:einstein@localhost/uni_fantasy_football",
});
fastify.register(require("@fastify/multipart"));
fastify.register(require("@fastify/cors"));

fastify.get("/", async (_, reply) => reply.send("Fantasy football ⚽️"));

fastify.listen({ port: 8000 }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
