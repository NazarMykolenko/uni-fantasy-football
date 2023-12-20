import React, { useState, useEffect } from "react";
import { getPlayers } from "../utils";
import { Button, Select, MenuItem } from "@mui/material";
import { getPlayerPositions } from "../utils";
function PlayerSelection() {
  const [players, setPlayers] = useState([]);
  const [playerPositions, setPlayerPositions] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const fetchedPlayers = await getPlayers();
        setPlayers(fetchedPlayers);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const fetchPlayerPositions = async () => {
      try {
        const fetchedPlayerPositions = await getPlayerPositions();
        setPlayerPositions(fetchedPlayerPositions);
      } catch (error) {
        console.error("Error fetching players positions:", error);
      }
    };

    fetchPlayerPositions();
  }, []);
  console.log("positions", playerPositions);

  const handleAddPlayer = () => {
    if (selectedPlayer) {
      // Check if the player is already selected
      const isPlayerSelected = selectedPlayers.some(
        (player) => player.player_id === selectedPlayer.player_id
      );

      // If the player is not selected, add them to the list
      if (!isPlayerSelected) {
        setSelectedPlayers([...selectedPlayers, selectedPlayer]);
      } else {
        console.log(`${selectedPlayer.name} is already selected.`);
      }
    }
  };
  const getPositionName = (player) => {
    console.log("player", player);
    const position = playerPositions.find(
      (position) => position.position_id === player.position_id
    );

    return position ? position.position_name_short : "";
  };

  return (
    <div>
      <h1>Fantasy Football League</h1>
      <h2>Available Players</h2>
      <Select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
      >
        {players.map((player) => (
          <MenuItem key={player._id} value={player}>
            {player.name} - {getPositionName(player)}
          </MenuItem>
        ))}
      </Select>
      <Button onClick={handleAddPlayer} disabled={!selectedPlayer}>
        Add to List
      </Button>

      <h2>Selected Players</h2>
      <ul>
        {selectedPlayers.map((player) => (
          <li key={player._id}>
            {player.name} - {getPositionName(player)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerSelection;
