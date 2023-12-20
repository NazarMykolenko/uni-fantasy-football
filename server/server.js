const {
  dbGetPlayers,
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

fastify.get("/players", async (_, reply) => {
  console.log("Get players 1");
  const client = await fastify.pg.connect();
  console.log("Get players 2");
  const players = await dbGetPlayers(client);
  console.log("Get players 3");
  reply.send(players);
  console.log("Get players 4");
  client.release();
  console.log("Get players 5");
});

fastify.get("/official-teams", async (_, reply) => {
  const client = await fastify.pg.connect();
  const official_teams = await dbGetOfficialTeams(client);
  reply.send(official_teams);
  client.release();
});

fastify.get("/player-positions", async (_, reply) => {
  const client = await fastify.pg.connect();
  const player_positions = await dbGetPlayerPositions(client);
  reply.send(player_positions);
  client.release();
});

fastify.listen({ port: 8000 }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});

const REFRESH_MS = 1000 * 60 * 60;
const URL_API_FANTASY_FOOTBALL =
  "https://fantasy.premierleague.com/api/bootstrap-static/";

const interval = setInterval(job, REFRESH_MS);
// Run in terminal: export NODE_ENV=production
if (process.env.NODE_ENV === "production") {
  job();
}

async function job() {
  const client = await fastify.pg.connect();
  const response = await fetch(URL_API_FANTASY_FOOTBALL);
  const data = await response.json();

  const officialTeams = await dbGetOfficialTeams(client);
  const playerPositions = await dbGetPlayerPositions(client);

  if (!officialTeams.length) {
    for (team of data.teams) {
      const result = await insertOfficialTeam(client, team);
      console.log(JSON.stringify(result));
    }
  }

  if (!playerPositions.length) {
    for (playerPosition of data.element_types) {
      const result = await insertPlayerPosition(client, playerPosition);
      console.log(JSON.stringify(result));
    }
  }

  for (const player of data.elements) {
    const result = await upsertPlayerInfo(client, player);
  }
}
