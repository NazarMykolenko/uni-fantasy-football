async function getUser(client, user_id) {
  const query = `SELECT * FROM "users" WHERE user_id = $1`;
  const values = [user_id];
  const result = await client.query(query, values);
  return result.rows;
}

async function getPlayers(client) {
  const query = `SELECT * FROM "players"`;
  const result = await client.query(query);
  return result.rows;
}

async function getSortedPlayers(client) {
  const query = `SELECT * FROM players ORDER BY rating DESC, price DESC;`;
  const result = await client.query(query);
  return result.rows;
}

async function getTopPlayers(client) {
  const query = `SELECT * FROM players WHERE rating > 80;`;
  const result = await client.query(query);
  return result.rows;
}

async function getCheapPlayers(client) {
  const query = `SELECT * FROM players WHERE price BETWEEN 1 AND 3;`;
  const result = await client.query(query);
  return result.rows;
}

async function getBestPlayer(client) {
  const query = `SELECT MAX(rating) FROM players;`;
  const result = await client.query(query);
  return result.rows;
}

async function getWorstPlayer(client) {
  const query = `SELECT MIN(rating) FROM players;`;
  const result = await client.query(query);
  return result.rows;
}

async function getGKsAndDEFs(client) {
  const query = `SELECT * FROM players WHERE position_id IN (1, 2);`;
  const result = await client.query(query);
  return result.rows;
}

async function getMIDsAndFWDs(client) {
  const query = `SELECT * FROM players WHERE position_id NOT IN (1, 2);`;
  const result = await client.query(query);
  return result.rows;
}

async function getPlayersWithoutCOPNextRound(client) {
  const query = `SELECT * FROM players WHERE chance_of_playing_next_round IS NULL;`;
  const result = await client.query(query);
  return result.rows;
}

async function getPlayersWithCOPNextRound(client) {
  const query = `SELECT * FROM players WHERE chance_of_playing_next_round IS NOT NULL;`;
  const result = await client.query(query);
  return result.rows;
}

async function getAverageRatingOfPlayers(client) {
  const query = `SELECT AVG(rating) FROM players;`;
  const result = await client.query(query);
  return result.rows;
}

async function getPlayerCharacteristics(client) {
  const query = `SELECT
  name,
  CASE
      WHEN goals_scored >= 3 AND assists >= 2 THEN 'Гарний гравець'
      WHEN goals_scored >= 2 AND assists >= 1 THEN 'Посередній гравець'
      ELSE 'Поганий гравець'
  END AS rating_category
FROM players;`;
  const result = await client.query(query);
  return result.rows;
}

// TODO: RIGHT JOIN;
async function get(client) {
  const query = ``;
  const result = await client.query(query);
  return result.rows;
}

async function getPricesOfAllUserTeams(client) {
  const query = `SELECT user_teams.user_id,
  user_teams.user_team_id,
  SUM(players.price) AS total_team_value
FROM user_teams
JOIN team_players ON user_teams.user_team_id = team_players.user_team_id
JOIN players ON team_players.player_id = players.player_id
GROUP BY user_teams.user_id, user_teams.user_team_id;`;
  const result = await client.query(query);
  return result.rows;
}

// TODO: UNION;
async function getOfficialUserTeamsComparison(client) {
  const query = `SELECT
  'User team' AS team_name,
  SUM(p.goals_scored) AS total_goals
FROM
  team_players tp
JOIN
  players p ON tp.player_id = p.player_id
WHERE
  tp.user_team_id = 1
GROUP BY
  team_name

UNION

SELECT
  ot.official_team_name AS team_name,
  SUM(p.goals_scored) AS total_goals
FROM
  official_teams ot
JOIN
  players p ON ot.official_team_id = p.official_team_id
GROUP BY
  ot.official_team_name;`;
  const result = await client.query(query);
  return result.rows;
}

async function getPricesOfAllOfficialTeams(client) {
  const query = `SELECT 
  official_teams.official_team_name AS team_name,
  SUM(players.price) AS total_team_value
FROM 
  official_teams
JOIN 
  players ON official_teams.official_team_id = players.official_team_id
GROUP BY 
  official_teams.official_team_name`;
  const result = await client.query(query);
  return result.rows;
}

async function getUserTeamPlayersICT(client) {
  const query = `SELECT players.name, players.ict_index
  FROM players
  INTERSECT
  SELECT players.name, players.ict_index
  FROM players
  JOIN team_players ON players.player_id = team_players.player_id;`;
  const result = await client.query(query);
  return result.rows;
}

async function getTopPlayersFromUserTeams(client) {
  const query = `SELECT t_p_id, user_team_id, player_id, position_number
  FROM team_players
  EXCEPT
  SELECT t_p_id, user_team_id, tp.player_id, position_number
  FROM team_players tp
  JOIN players p ON tp.player_id = p.player_id
  WHERE p.rating < 80;`;
  const result = await client.query(query);
  return result.rows;
}

async function getNonFieldPlayers(client) {
  const query = `SELECT *
  FROM players
  JOIN player_positions ON players.position_id = player_positions.position_id
  WHERE player_positions.position_name_short LIKE 'G%';`;
  const result = await client.query(query);
  return result.rows;
}

async function getFieldPlayers(client) {
  const query = `SELECT *
 FROM players
 JOIN player_positions ON players.position_id = player_positions.position_id
 WHERE player_positions.position_name_short NOT LIKE 'G%';`;
  const result = await client.query(query);
  return result.rows;
}

async function getUserInfoAndBudget(client) {
  const query = `SELECT users.username, users.email, user_teams.budget
  FROM users
  JOIN user_teams ON users.user_id = user_teams.user_id;`;
  const result = await client.query(query);
  return result.rows;
}

async function getPlayerCountForPosition(client) {
  const query = `SELECT position_id, COUNT(*) AS player_count
  FROM players
  GROUP BY position_id
  ORDER BY player_count DESC;`;
  const result = await client.query(query);
  return result.rows;
}

async function getPlayersAndTheirTeams(client) {
  const query = `SELECT players.name, official_teams.official_team_name
  FROM "players"
  INNER JOIN official_teams ON players.official_team_id = official_teams.official_team_id
  ORDER BY official_teams.official_team_name;`;
  const result = await client.query(query);
  return result.rows;
}

async function getUserTotalCoefficient(client) {
  const query = `SELECT users.username, user_teams.total_coefficient
  FROM "users"
  LEFT JOIN user_teams ON users.user_id = user_teams.user_id;`;
  const result = await client.query(query);
  return result.rows;
}

async function getAverageRatingForPlayerPosition(client) {
  const query = `SELECT position_id, AVG(rating) AS avg_rating
  FROM players
  GROUP BY position_id
  HAVING AVG(rating) > 7;`;
  const result = await client.query(query);
  return result.rows;
}

async function getOfficialTeams(client) {
  const query = `SELECT * FROM "official_teams"`;
  const result = await client.query(query);
  return result.rows;
}

async function getUserTeam(client, user_id) {
  const query = `SELECT * FROM user_teams WHERE user_id = $1`;
  const values = [user_id];
  const result = await client.query(query, values);
  return result.rows;
}

async function getUserTeamId(client, user_id) {
  const query = `SELECT user_team_id FROM user_teams WHERE user_id = $1`;
  const values = [user_id];
  const result = await client.query(query, values);
  const user_team_id = result.rows[0]?.user_team_id;
  return user_team_id;
}

async function getUserTeamSchemaByUserTeamId(client, user_team_id) {
  const query = `SELECT * FROM "team_players" WHERE user_team_id = $1`;
  const values = [user_team_id];
  const result = await client.query(query, values);
  return result.rows;
}

async function getUserTeamSchemaByUserId(client, user_id) {
  const user_team_id = await getUserTeamId(client, user_id);
  const user_team_schema = await getUserTeamSchemaByUserTeamId(
    client,
    user_team_id
  );
  return user_team_schema;
}

async function getPlayerPositions(client) {
  const query = `SELECT * FROM "player_positions"`;
  const result = await client.query(query);
  return result.rows;
}

async function addUser(client, username, email, password) {
  const query = `INSERT INTO "users" (username, email, password) VALUES ($1, $2, $3)`;
  const values = [username, email, password];
  const result = await client.query(query, values);
  return result.rows;
}

async function addUserTeam(client, user_id, budget, team) {
  try {
    await client.query("BEGIN");

    await updateUserTeam(client, user_id, budget, team);
    await deleteCurrentTeamPlayers(client, user_id);
    await insertNewTeamPlayers(client, user_id, team);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function updateUserTeam(client, user_id, budget, team) {
  const query = `
   UPDATE "user_teams"
   SET total_coefficient = total_coefficient + $1, budget = $2
   WHERE user_id = $3;
 `;

  const values = [
    Object.values(team).reduce((sum, player) => sum + player.total_points, 0),
    budget,
    user_id,
  ];

  const result = await client.query(query, values);
  return result.rows;
}

async function deleteCurrentTeamPlayers(client, user_id) {
  const query = `
   DELETE FROM "team_players"
   WHERE user_team_id = (SELECT user_team_id FROM user_teams WHERE user_id = $1);
 `;
  const values = [user_id];
  const result = await client.query(query, values);
  return result.rows;
}

async function insertNewTeamPlayers(client, user_id, team) {
  const user_team_id = await getUserTeamId(client, user_id);

  if (!user_team_id) {
    return userTeamIdResult.rows;
  }

  const values = Object.values(team).flatMap((player) => [
    user_team_id,
    player.player_id,
    player.nuber,
  ]);

  const placeholders = Array.from(
    { length: values.length / 3 },
    (_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
  ).join(", ");

  const query = `
   INSERT INTO "team_players" (user_team_id, player_id, position_number)
   VALUES ${placeholders};
 `;

  const result = await client.query(query, values);
  return result.rows;
}

async function insertOfficialTeam(client, official_team) {
  const query = `
  INSERT INTO "official_teams" (official_team_id, official_team_name, official_team_name_short)
  VALUES ($1, $2, $3)
`;

  const values = [
    official_team.id,
    official_team.name,
    official_team.short_name,
  ];
  const result = await client.query(query, values);
  return result.rows;
}

async function insertPlayerPosition(client, player_position) {
  const query = `
 INSERT INTO "player_positions" (position_id, position_name, position_name_short)
 VALUES ($1, $2, $3)
`;

  const values = [
    player_position.id,
    player_position.singular_name,
    player_position.singular_name_short,
  ];
  const result = await client.query(query, values);
  return result.rows;
}

async function upsertPlayerInfo(client, player) {
  const query = `
   INSERT INTO players (
     player_id, name, official_team_id, position_id, price, rating,
     chance_of_playing_next_round, chance_of_playing_this_round, minutes,
     goals_scored, assists, goals_conceded, penalties_saved, penalties_missed,
     yellow_cards, red_cards, saves, bonus, influence, creativity, threat,
     ict_index, expected_goals, expected_assists, expected_goal_involvements,
     expected_goals_conceded, expected_goals_per_90, saves_per_90,
     expected_assists_per_90, expected_goal_involvements_per_90,
     expected_goals_conceded_per_90, goals_conceded_per_90, starts_per_90,
     clean_sheets_per_90
   ) VALUES (
     $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
     $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
     $31, $32, $33, $34
   )
   ON CONFLICT (player_id) DO UPDATE
   SET (
     player_id, name, official_team_id, position_id, price, rating, chance_of_playing_next_round,
     chance_of_playing_this_round, minutes, goals_scored, assists, goals_conceded,
     penalties_saved, penalties_missed, yellow_cards, red_cards, saves, bonus,
     influence, creativity, threat, ict_index, expected_goals, expected_assists,
     expected_goal_involvements, expected_goals_conceded, expected_goals_per_90,
     saves_per_90, expected_assists_per_90, expected_goal_involvements_per_90,
     expected_goals_conceded_per_90, goals_conceded_per_90, starts_per_90,
     clean_sheets_per_90
   ) = (
     EXCLUDED.player_id, EXCLUDED.name, EXCLUDED.official_team_id, EXCLUDED.position_id,
     EXCLUDED.price, EXCLUDED.rating, EXCLUDED.chance_of_playing_next_round,
     EXCLUDED.chance_of_playing_this_round, EXCLUDED.minutes, EXCLUDED.goals_scored,
     EXCLUDED.assists, EXCLUDED.goals_conceded, EXCLUDED.penalties_saved,
     EXCLUDED.penalties_missed, EXCLUDED.yellow_cards, EXCLUDED.red_cards,
     EXCLUDED.saves, EXCLUDED.bonus, EXCLUDED.influence, EXCLUDED.creativity,
     EXCLUDED.threat, EXCLUDED.ict_index, EXCLUDED.expected_goals,
     EXCLUDED.expected_assists, EXCLUDED.expected_goal_involvements,
     EXCLUDED.expected_goals_conceded, EXCLUDED.expected_goals_per_90,
     EXCLUDED.saves_per_90, EXCLUDED.expected_assists_per_90,
     EXCLUDED.expected_goal_involvements_per_90,
     EXCLUDED.expected_goals_conceded_per_90, EXCLUDED.goals_conceded_per_90,
     EXCLUDED.starts_per_90, EXCLUDED.clean_sheets_per_90
   )
   RETURNING player_id;
 `;

  const values = [
    player.id,
    player.first_name + " " + player.second_name,
    player.team,
    player.element_type,
    player.now_cost,
    player.total_points,
    player.chance_of_playing_next_round,
    player.chance_of_playing_this_round,
    player.minutes,
    player.goals_scored,
    player.assists,
    player.goals_conceded,
    player.penalties_saved,
    player.penalties_missed,
    player.yellow_cards,
    player.red_cards,
    player.saves,
    player.bonus,
    player.influence,
    player.creativity,
    player.threat,
    player.ict_index,
    player.expected_goals,
    player.expected_assists,
    player.expected_goal_involvements,
    player.expected_goals_conceded,
    player.expected_goals_per_90,
    player.saves_per_90,
    player.expected_assists_per_90,
    player.expected_goal_involvements_per_90,
    player.expected_goals_conceded_per_90,
    player.goals_conceded_per_90,
    player.starts_per_90,
    player.clean_sheets_per_90,
  ];
  const result = await client.query(query, values);
  return result.rows;
}

module.exports = {
  getOfficialUserTeamsComparison,
  getTopPlayersFromUserTeams,
  getUserTeamPlayersICT,
  getPricesOfAllUserTeams,
  getNonFieldPlayers,
  getFieldPlayers,
  getPlayerCharacteristics,
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
  getOfficialTeams,
  getPlayerPositions,
  insertOfficialTeam,
  insertPlayerPosition,
  upsertPlayerInfo,
};
