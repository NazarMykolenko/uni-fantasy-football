const {
  addUser,
  dbGetUser,
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
const crypto = require("crypto");

const PORT = 8000;
const authenticate = { realm: "example" };
const REFRESH_MS = 1000 * 60 * 60;
const URL_API_FANTASY_FOOTBALL =
  "https://fantasy.premierleague.com/api/bootstrap-static/";

fastify.register(require("@fastify/postgres"), {
  connectionString:
    "postgres://einstein:einstein@localhost/uni_fantasy_football",
});
fastify.register(require("@fastify/multipart"));
fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/auth"));
fastify.register(require("@fastify/basic-auth"), { validate, authenticate });

fastify.get("/", async (_, reply) => reply.send("Fantasy football ⚽️"));

fastify.listen({ port: PORT }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});

const interval = setInterval(job, REFRESH_MS);
// Run in terminal: export NODE_ENV=production
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

async function validate(username, password, req, reply) {
  const client = await fastify.pg.connect();

  try {
    const result = await dbGetUser(client, username);

    if (result.length === 0) {
      throw new Error("User not found");
    }

    const [salt, hashedPassword] = result[0].password.split("$");
    const hashedInputPassword = hashPassword(password, salt);
    const isPasswordValid = hashedInputPassword === hashedPassword;

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
  } finally {
    client.release();
  }
}

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}$${hash}`;
}

// fastify.after(() => {
//   fastify.addHook("onRequest", fastify.basicAuth);

//   fastify.get("/login", (req, reply) => {
//     reply.send({ hello: "world" });
//   });
// });

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

fastify.post("/register", async (request, reply) => {
  const client = await fastify.pg.connect();

  try {
    const { username, password1, password2 } = request.body;

    if (!username || !password1 || !password2) {
      reply.code(400).send({ error: "Missing required fields" });
      return;
    }

    if (password1.length < 6) {
      reply.send({ message: "Password must be a least 6 characters long" });
    }

    if (password1 !== password2) {
      reply.send({ message: "Passwords do not match" });
    }

    const existingUser = await dbGetUser(client, username);

    if (existingUser.length > 0) {
      reply.code(400).send({ error: "Username is already in use" });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password1, salt);
    const resultOfAdding = await addUser(client, username, hashedPassword);

    reply.code(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    reply.code(500).send({ error: "Internal Server Error" });
  }
});
