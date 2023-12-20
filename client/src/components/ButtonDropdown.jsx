import React, { useState, useEffect } from "react";
import { getPlayers } from "../utils";

const ErrorBoundary = ({ error, children }) => {
  if (error) {
    console.error("Error:", error);
    return <div>Помилка завантаження гравців.</div>;
  }
  return children;
};

const PlayerList = ({ players, onAddPlayer }) => (
  <ul>
    {players.map((player) => (
      <li key={player.id}>
        {player.name}
        <button onClick={() => onAddPlayer(player)}>Додати до списку</button>
      </li>
    ))}
  </ul>
);

const SelectedPlayersList = ({ selectedPlayers }) => (
  <div>
    <h2>Список вибраних гравців:</h2>
    <ul>
      {selectedPlayers.map((selectedPlayer, index) => (
        <li key={index}>{selectedPlayer.name}</li>
      ))}
    </ul>
  </div>
);

const ButtonDropdown = () => {
  const [players, setPlayers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const fetchPlayers = async () => {
    try {
      const fetchedPlayers = await getPlayers();
      setPlayers(fetchedPlayers);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const addPlayerToList = (player) => {
    if (
      !selectedPlayers.find((selectedPlayer) => selectedPlayer.id === player.id)
    ) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div>
      <button onClick={toggleDropdown}>Вибрати гравця</button>
      <ErrorBoundary error={error}>
        {showDropdown && (
          <PlayerList players={players} onAddPlayer={addPlayerToList} />
        )}
      </ErrorBoundary>
      <SelectedPlayersList selectedPlayers={selectedPlayers} />
    </div>
  );
};

export default ButtonDropdown;
