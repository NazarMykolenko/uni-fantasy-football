export const URL_API = "http://localhost:8000";
export const URL_API_PLAYERS = `${URL_API}/players`;
export const URL_API_PLAYERS_POSITIONS = `${URL_API}/player-positions`;
const USER_ID = 1;
export const URL_API_USER_TEAM = `${URL_API}/user-team/${USER_ID}`;
export const URL_API_USERS = `${URL_API}/users/${USER_ID}`;

export const getUsers = async () => {
  const response = await fetch(URL_API_USERS);
  return await response.json();
};

export const getPlayers = async () => {
  const response = await fetch(URL_API_PLAYERS);
  return await response.json();
};

export const getPlayerPositions = async () => {
  const response = await fetch(URL_API_PLAYERS_POSITIONS);
  return await response.json();
};

export const addTeam = async (team) => {
  const response = await fetch(URL_API_USER_TEAM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  });
  return await response.json();
};
