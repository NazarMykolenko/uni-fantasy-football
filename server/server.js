const {
  upsertPlayerInfo,
  insertOfficialTeam,
  insertPlayerPosition,
  dbGetOfficialTeams,
  dbGetPlayerPositions,
} = require("./db/utils");

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

const REFRESH_MS = 10000;
const URL_API_FANTASY_FOOTBALL =
  "https://fantasy.premierleague.com/api/bootstrap-static/";

const interval = setInterval(job, REFRESH_MS);

async function job() {
  const client = await fastify.pg.connect();
  const response = await fetch(URL_API_FANTASY_FOOTBALL);
  const data = await response.json();

  if (!client.dbGetOfficialTeams()) {
    for (team of data.team) {
      const result = await insertOfficialTeam(client, team);
      console.log(JSON.stringify(result));
    }
  }

  if (!client.dbGetAllPlayers()) {
    for (team of data.element_types) {
      const result = await insertPlayerPosition(client, team);
      console.log(JSON.stringify(result));
    }
  }

  for (const player of data.elements) {
    const result = await upsertPlayerInfo(client, player);
    console.log(JSON.stringify(result));
  }
}

fastify.get("/players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const players = await dbGetAllPlayers(client);
  reply.send(players);
  client.release();
});

fastify.get("/official_teams", async (_, reply) => {
  const client = await fastify.pg.connect();
  const official_teams = await dbGetOfficialTeams(client);
  reply.send(official_teams);
  client.release();
});

fastify.get("/player_positions", async (_, reply) => {
  const client = await fastify.pg.connect();
  const player_positions = await dbGetPlayerPositions(client);
  reply.send(player_positions);
  client.release();
});
