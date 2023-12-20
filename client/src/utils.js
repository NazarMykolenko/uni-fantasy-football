export const URL_API = "http://localhost:8000";
export const URL_API_PLAYERS = `${URL_API}/players`;
export const URL_API_PLAYERSPOSITIONS = `${URL_API}/player-positions`;

export const getPlayers = async () => {
  const response = await fetch(URL_API_PLAYERS);
  return await response.json();
};

export const getPlayerPositions = async () => {
  const response = await fetch(URL_API_PLAYERSPOSITIONS);
  return await response.json();
};
