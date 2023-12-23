const { log } = require("console");
const {
  getOfficialUserTeamsComparison,
  getTopPlayersFromUserTeams,
  getUserTeamPlayersICT,
  getPricesOfAllUserTeams,
  getNonFieldPlayers,
  getFieldPlayers,
  getPlayersCharacteristics,
  getBestPlayer,
  getWorstPlayer,
  getAverageRatingOfPlayers,
  getPlayersWithoutCOPNextRound,
  getPlayersWithCOPNextRound,
  getMIDsAndFWDs,
  getGKsAndDEFs,
  getCheapPlayers,
  getTopPlayers,
  getUserInfoAndBudget,
  getPlayerCountForPosition,
  getAverageRatingForPlayerPosition,
  getSortedPlayers,
  getUserTotalCoefficient,
  getPlayersAndTheirTeams,
  getUserTeam,
  getUserTeamSchemaByUserId,
  addUser,
  addUserTeam,
  getUser,
  getPlayers,
  upsertPlayerInfo,
  insertOfficialTeam,
  insertPlayerPosition,
  getOfficialTeams,
  getPlayerPositions,
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

async function job() {
  const client = await fastify.pg.connect();
  const response = await fetch(URL_API_FANTASY_FOOTBALL);
  const data = await response.json();

  const officialTeams = await getOfficialTeams(client);
  const playerPositions = await getPlayerPositions(client);

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

fastify.get("/users/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const user = await getUser(client, user_id);
  reply.send(user);
  client.release();
});

fastify.get("/players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPlayers(client);
  reply.send(result);
  client.release();
});

fastify.get("/sorted-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getSortedPlayers(client);
  reply.send(result);
  client.release();
});

fastify.get("/user-team-prices", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPricesOfAllUserTeams(client);
  reply.send(result);
  client.release();
});

fastify.get("/position-average-rating", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getAverageRatingForPlayerPosition(client);
  reply.send(result);
  client.release();
});

fastify.get("/players-average-rating", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getAverageRatingOfPlayers(client);
  reply.send(result);
  client.release();
});

fastify.get("/player-count-for-position", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPlayerCountForPosition(client);
  reply.send(result);
  client.release();
});

fastify.get("/non-field-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getNonFieldPlayers(client);
  reply.send(result);
  client.release();
});

fastify.get("/field-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getFieldPlayers(client);
  reply.send(result);
  client.release();
});

fastify.get("/official-user-comparison", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getOfficialUserTeamsComparison(client);
  reply.send(result);
  client.release();
});

fastify.get("/official-teams", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getOfficialTeams(client);
  reply.send(result);
  client.release();
});

fastify.get("/player-positions", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPlayerPositions(client);
  reply.send(result);
  client.release();
});

fastify.get("/user-team-players-ict", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getUserTeamPlayersICT(client);
  reply.send(result);
  client.release();
});

fastify.get("/user-team-top-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getTopPlayersFromUserTeams(client);
  reply.send(result);
  client.release();
});

fastify.get("/user-team-schemas/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const result = await getUserTeamSchemaByUserId(client, user_id);
  reply.send(result);
  client.release();
});

fastify.post("/users", async (req, reply) => {
  const client = await fastify.pg.connect();
  const { username, email, password } = req.body;
  const result = await addUser(client, username, email, password);
  reply.send({ message: "User was added successfully!" });
  client.release();
});

fastify.get("/user-teams/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const result = await getUserTeam(client, user_id);
  reply.send(result);
  client.release();
});

fastify.post("/user-teams/:userId", async (req, reply) => {
  const client = await fastify.pg.connect();
  const user_id = +req.params.userId;
  const { budget, ...team } = req.body;
  const roundedBudget = budget.toFixed(2);
  const result = await addUserTeam(client, user_id, roundedBudget, team);
  reply.send({ message: "User team was added successfully!" });
  client.release();
});

fastify.get("/players-and-official-teams", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPlayersAndTheirTeams(client);
  reply.send(result);
  client.release();
});

fastify.get("/user-total-coefficient", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getUserTotalCoefficient(client);
  reply.send(result);
  client.release();
});

fastify.get("/user-info-and-budget", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getUserInfoAndBudget(client);
  reply.send(result);
  client.release();
});

fastify.get("/top-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getTopPlayers(client);
  reply.send(result);
  client.release();
});

fastify.get("/cheap-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getCheapPlayers(client);
  reply.send(result);
  client.release();
});

fastify.get("/def-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getGKsAndDEFs(client);
  reply.send(result);
  client.release();
});

fastify.get("/attack-players", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getMIDsAndFWDs(client);
  reply.send(result);
  client.release();
});

fastify.get("/players-without-cop-next-round", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPlayersWithoutCOPNextRound(client);
  reply.send(result);
  client.release();
});

fastify.get("/players-with-cop-next-round", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPlayersWithCOPNextRound(client);
  reply.send(result);
  client.release();
});

fastify.get("/players-best", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getBestPlayer(client);
  reply.send(result);
  client.release();
});

fastify.get("/players-worst", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getWorstPlayer(client);
  reply.send(result);
  client.release();
});

fastify.get("/players-characteristics", async (_, reply) => {
  const client = await fastify.pg.connect();
  const result = await getPlayersCharacteristics(client);
  reply.send(result);
  client.release();
});
