import React, { useState, useEffect } from "react";
import { getPlayers } from "../utils";
function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  useEffect(() => {
    (async () => {
      const players = await getPlayers();
      setPlayers(players);
    })();
  }, []);

  const handleAddPlayer = (player) => {
    // Add the selected player to the list
    setSelectedPlayers([...selectedPlayers, player]);
  };

  return (
    <div>
      <h1>Fantasy Football League</h1>
      <h2>Available Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player._id}>
            {player.name} - {player.position}
            <button onClick={() => handleAddPlayer(player)}>Add to List</button>
          </li>
        ))}
      </ul>

      <h2>Selected Players</h2>
      <ul>
        {selectedPlayers.map((player) => (
          <li key={player._id}>
            {player.name} - {player.position}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
