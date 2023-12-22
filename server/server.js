const { log } = require("console");
const {
  dbGetUserTeam,
  dbGetUserTeamSchema,
  dbAddUser,
  dbAddUserTeam,
  dbGetUser,
  dbGetPlayers,
  dbUpsertPlayerInfo,
  dbInsertOfficialTeam,
  dbInsertPlayerPosition,
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

const PORT = 8000;
const REFRESH_MS = 10000 * 60 * 60;
const URL_API_FANTASY_FOOTBALL =
  "https://fantasy.premierleague.com/api/bootstrap-static/";

fastify.register(require("@fastify/postgres"), {
  connectionString:
    "postgres://einstein:einstein@localhost/uni_fantasy_football",
});
fastify.register(require("@fastify/multipart"));
fastify.register(require("@fastify/cors"));

fastify.get("/", async (_, reply) => reply.send("Fantasy football ⚽️"));

fastify.listen({ port: PORT }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});

const interval = setInterval(job, REFRESH_MS);

// if (process.env.NODE_ENV === "production") {
//   job();
// }

async function job() {
  const client = await fastify.pg.connect();
  const response = await fetch(URL_API_FANTASY_FOOTBALL);
  const data = await response.json();

  const officialTeams = await dbGetOfficialTeams(client);
  const playerPositions = await dbGetPlayerPositions(client);

  if (!officialTeams.length) {
    for (team of data.teams) {
      const result = await dbInsertOfficialTeam(client, team);
      console.log(JSON.stringify(result));
    }
  }

  if (!playerPositions.length) {
    for (playerPosition of data.element_types) {
      const result = await dbInsertPlayerPosition(client, playerPosition);
      console.log(JSON.stringify(result));
    }
  }

  for (const player of data.elements) {
    const result = await dbUpsertPlayerInfo(client, player);
  }
}

fastify.get("/users/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const user = await dbGetUser(client, user_id);
  reply.send(user);
  client.release();
});

fastify.get("/players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const players = await dbGetPlayers(client);
  reply.send(players);
  client.release();
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

fastify.get("/user-team-schemas/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const result = await dbGetUserTeamSchema(client, user_id);
  reply.send(result);
  client.release();
});

fastify.post("/users", async (req, reply) => {
  const client = await fastify.pg.connect();
  const { username, email, password } = req.body;
  const result = await dbAddUser(client, username, email, password);
  reply.send({ message: "User was added successfully!" });
  client.release();
});

fastify.get("/user-teams/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const result = await dbGetUserTeam(client, user_id);
  reply.send(result);
  client.release();
});

fastify.post("/user-teams/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const { budget, ...team } = req.body;
  const roundedBudget = budget.toFixed(2);
  const result = await dbAddUserTeam(client, user_id, roundedBudget, team);
  reply.send({ message: "User team was added successfully!" });
  client.release();
});
