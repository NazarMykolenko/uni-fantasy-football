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
