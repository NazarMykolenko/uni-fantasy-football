import React, { useState, useEffect } from "react";
import { getPositionName, getPlayerPositions, getPlayers } from "../utils";
import FootballField from "../components/FootballField";
import "./PlayerSelection.css";
import { addTeam } from "../utils";
import { Button, CircularProgress } from "@mui/material";
import { getUserTeam, notify } from "../utils";
import Card from "./Card";
import { getUserTeamSchema } from "../utils";
import { getUserTeamBudget } from "../utils";

const NUMBER_OF_PLAYERS_IN_TEAM = 11;
const INITIAL_BUDGET = 60;

function PlayerSelection() {
  const [players, setPlayers] = useState([]);
  const [playerPositions, setPlayerPositions] = useState([]);
  const [selectedPlayersWithNumber, setSelectedPlayersWithNumber] =
    useState(null);
  const [budget, setBudget] = useState(INITIAL_BUDGET);
  const [buttonState, setButtonState] = useState(false);
  const [kof, setKof] = useState(0);

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const fetchedUserTeam = await getUserTeam();
        //setSelectedPlayersWithNumber(fetchedUserTeam);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchUserTeam();
  }, []);

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
    const fetchSchema = async () => {
      try {
        const schema = await getUserTeamSchema();

        if (schema.length) {
          setButtonState(true);
        }
        setSelectedPlayersWithNumber(
          schema.map(({ player_id, position_number }) => {
            return {
              player: players.find((player) => player.player_id === player_id),
              number: position_number,
            };
          })
        );
      } catch (error) {
        notify("Error fetching players:", error);
      }
    };

    if (players.length) {
      fetchSchema();
    }
  }, [players]);

  useEffect(() => {
    const fetchUserBudget = async () => {
      try {
        const fetchedUserBudget = await getUserTeamBudget();
        console.log("!!!!!", fetchedUserBudget);
        console.log("coeff", fetchedUserBudget[0].total_coefficient);
        setBudget(+fetchedUserBudget[0].budget);
        setKof(+fetchedUserBudget[0].total_coefficient);

        //setSelectedPlayersWithNumber(fetchedUserTeam);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchUserBudget();

    // if ({ budget }.length) {
    //   setBudget({ budget });
    // }
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

  const handleSubmission = async () => {
    try {
      // Add logic to format the team data as needed
      const playersData = selectedPlayersWithNumber.map(
        ({ player, number }) => ({
          player_id: player.player_id,
          total_points: +player.rating,
          nuber: number, // You can replace this with the actual value you want for total points
        })
      );
      const teamData = { ...playersData, budget };
      const totalRating = selectedPlayersWithNumber.reduce(
        (sum, { player }) => sum + +player.rating,
        0
      );

      // Call your addTeam function to submit the team to the database
      const response = await addTeam(teamData);
      setButtonState(true);
    } catch (error) {
      console.error("Error submitting team:", error);
    }
  };

  return (
    <div className="container">
      <h1>Fantasy football ⚽️</h1>
      <h2>Choose your team 👇</h2>
      {!players.length || !selectedPlayersWithNumber ? (
        <CircularProgress />
      ) : (
        <div className="content">
          <Card className="team-list">
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
            <div class="budget-container">
              <div>
                <h3>Your budget:</h3>
                {budget.toFixed(2)}
              </div>
              <div>
                <h3>Your coeff:</h3>
                {kof}
              </div>
            </div>
            <div>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmission}
                disabled={
                  selectedPlayersWithNumber.length !==
                    NUMBER_OF_PLAYERS_IN_TEAM || buttonState
                }
              >
                Submit Team
              </Button>
            </div>
          </Card>

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
                setPlayers(players);

                setBudget(budget - playerWithNumber.player.price / 10);
                setKof(kof + +playerWithNumber.player.rating);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerSelection;
