import React, { useState, useMemo, useCallback } from "react";
import SoccerLineUp from "react-soccer-lineup";
import DialogAddPlayerToTeam from "./dialogs/DialogAddPlayerToTeam";

const FootballField = ({
  players,
  positions,
  selectedPlayersWithNumber,
  onSelectedPlayersWithNumberChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPostionId, setSelectedPositionId] = useState(1);
  const [playerNumber, setPlayerNumber] = useState(1);

  const onClick = useCallback((positionId, number) => {
    setOpen(true);
    setSelectedPositionId(positionId);
    setPlayerNumber(number);
  }, []);

  const findPlayerNameByNumber = useCallback(
    (obj) => {
      return selectedPlayersWithNumber.find(
        ({ number }) => number === obj.number
      )?.player?.name;
    },
    [selectedPlayersWithNumber]
  );

  const homeTeam = useMemo(() => {
    return {
      squad: {
        gk: {
          name: findPlayerNameByNumber({ number: 1 }),
          color: "#04ff00",
          number: 1,
          onClick: () => onClick(1, 1),
        },
        df: [{ number: 2 }, { number: 3 }, { number: 4 }, { number: 5 }].map(
          (obj) => ({
            ...obj,
            onClick: () => onClick(2, obj.number),
            name: findPlayerNameByNumber(obj),
          })
        ),
        cm: [{ number: 6 }, { number: 7 }, { number: 8 }, { number: 11 }].map(
          (obj) => {
            return {
              ...obj,
              name: findPlayerNameByNumber(obj),
              onClick: () => onClick(3, obj.number),
            };
          }
        ),
        fw: [{ number: 9 }, { number: 10 }].map((obj) => ({
          ...obj,
          onClick: () => onClick(4, obj.number),
          name: findPlayerNameByNumber(obj),
        })),
      },
      style: {
        color: `#0077ff`,
      },
    };
  }, [findPlayerNameByNumber, onClick]);

  return (
    <div>
      <SoccerLineUp
        size="responsive"
        color="#346334"
        pattern="lines"
        homeTeam={homeTeam}
      />
      <DialogAddPlayerToTeam
        open={open}
        players={players}
        positions={positions}
        onClose={() => setOpen(false)}
        selectedPostionId={selectedPostionId}
        onSubmit={onSelectedPlayersWithNumberChange}
        number={playerNumber}
      />
    </div>
  );
};

export default FootballField;
