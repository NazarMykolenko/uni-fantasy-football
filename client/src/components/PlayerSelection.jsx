import React, { useState, useEffect } from "react";
import { getPositionName, getPlayerPositions, getPlayers } from "../utils";
import FootballField from "../components/FootballField";
import "./PlayerSelection.css";

const INITIAL_BUDGET = 100;

function PlayerSelection() {
  const [players, setPlayers] = useState([]);
  const [playerPositions, setPlayerPositions] = useState([]);
  const [selectedPlayersWithNumber, setSelectedPlayersWithNumber] = useState(
    []
  );
  console.log("selected", selectedPlayersWithNumber);
  const [budget, setBudget] = useState(INITIAL_BUDGET);

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

  return (
    <div className="container">
      <h1>Fantasy football ⚽️</h1>
      <h2>Choose your team 👇</h2>
      <div className="content">
        <div className="team-list">
          <h3>Your team 💪</h3>
          {!!selectedPlayersWithNumber.length && (
            <ul>
              {selectedPlayersWithNumber.map(({ player, number }) => (
                <li>
                  {player.name} - {getPositionName(player, playerPositions)} -{" "}
                  {number}
                </li>
              ))}
            </ul>
          )}
          <h3>Your budget:</h3>
          {budget}
        </div>
        <div className="field">
          <FootballField
            players={players}
            positions={playerPositions}
            selectedPlayersWithNumber={selectedPlayersWithNumber}
            onSelectedPlayersWithNumberChange={(playerWithNumber) => {
              setSelectedPlayersWithNumber([
                ...selectedPlayersWithNumber,
                playerWithNumber,
              ]);
              console.log("player", playerWithNumber);
              setBudget(budget - playerWithNumber.player.price);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayerSelection;
