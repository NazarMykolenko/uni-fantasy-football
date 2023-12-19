CREATE TABLE "users" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE "teams" (
    team_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "users"(user_id),
    team_name VARCHAR(20) NOT NULL,
    budget DECIMAL(10, 2) DEFAULT 100.00,
    total_coefficient DECIMAL(5, 2) DEFAULT 0.00
);

CREATE TABLE "players" (
    player_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    team VARCHAR(50) NOT NULL,
    position VARCHAR(20) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    rating DECIMAL(4, 2) DEFAULT 0.00
);

CREATE TABLE "team_players" (
    team_id INT REFERENCES "teams"(team_id),
    player_id INT REFERENCES "players"(player_id),
    PRIMARY KEY (team_id, player_id)
);

