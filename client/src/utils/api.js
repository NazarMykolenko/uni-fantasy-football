export const URL_API = "http://localhost:8000";
export const URL_API_PLAYERS = `${URL_API}/players`;
export const URL_API_PLAYERS_POSITIONS = `${URL_API}/player-positions`;
export const URL_API_USERTEAM = `${URL_API}/user-team`;

export const getPlayers = async () => {
  const response = await fetch(URL_API_PLAYERS);
  return await response.json();
};

export const getPlayerPositions = async () => {
  const response = await fetch(URL_API_PLAYERS_POSITIONS);
  return await response.json();
};

export const addTeam = async (team) => {
  const response = await fetch(URL_API_USERTEAM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  });
  return await response.json();
};
