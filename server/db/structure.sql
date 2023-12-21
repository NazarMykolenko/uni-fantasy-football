CREATE TABLE "users" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(150) NOT NULL
);

CREATE TABLE "user_teams" (
    user_team_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "users"(user_id),
    user_team_name VARCHAR(20) NOT NULL,
    total_coefficient DECIMAL(5, 2) DEFAULT 0.00
);

CREATE TABLE "official_teams" (
    official_team_id INT PRIMARY KEY,
    official_team_name VARCHAR(20) NOT NULL,
    official_team_name_short VARCHAR(5) NOT NULL
);

CREATE TABLE "player_positions" (
    position_id INT PRIMARY KEY,
    position_name VARCHAR(15) NOT NULL,
    position_name_short VARCHAR(3) NOT NULL
);


CREATE TABLE "players" (
    player_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    official_team_id INT REFERENCES "official_teams"(official_team_id),
    position_id INT REFERENCES "player_positions"(position_id),
    price DECIMAL(8, 2) NOT NULL,
    rating DECIMAL(10, 2) DEFAULT 0.00,
    chance_of_playing_next_round INT,
    chance_of_playing_this_round INT,
    minutes INT,
    goals_scored INT,
    assists INT,
    goals_conceded INT,
    penalties_saved INT,
    penalties_missed INT,
    yellow_cards INT,
    red_cards INT,
    saves INT,
    bonus INT,
    influence VARCHAR(10),
    creativity VARCHAR(10),
    threat VARCHAR(10),
    ict_index VARCHAR(10),
    expected_goals VARCHAR(10),
    expected_assists VARCHAR(10),
    expected_goal_involvements VARCHAR(10),
    expected_goals_conceded VARCHAR(10),
    expected_goals_per_90 DECIMAL(5, 2),
    saves_per_90 DECIMAL(5, 2),
    expected_assists_per_90 DECIMAL(5, 2),
    expected_goal_involvements_per_90 DECIMAL(5, 2),
    expected_goals_conceded_per_90 DECIMAL(5, 2),
    goals_conceded_per_90 DECIMAL(5, 2),
    starts_per_90 DECIMAL(5, 2),
    clean_sheets_per_90 DECIMAL(5, 2)
);

CREATE TABLE "team_players" (
    user_team_id INT REFERENCES "user_teams"(user_team_id),
    player_id INT REFERENCES "players"(player_id),
    PRIMARY KEY (user_team_id, player_id)
);