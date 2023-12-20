import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { getPositionName } from "../../utils";

export const DialogAddPlayerToTeam = ({
  open,
  onClose,
  onSubmit,
  players,
  positions,
  selectedPostionId,
  number,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState();
  const handleSubmit = useCallback(() => {
    onSubmit({ player: selectedPlayer, number });
    onClose();
  }, [number, onClose, onSubmit, selectedPlayer]);

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Calculate risk</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            <Select>
              {players
                .filter(({ position_id }) => position_id === selectedPostionId)
                .map((player) => (
                  <MenuItem
                    key={player._id}
                    value={player}
                    onClick={() => {
                      setSelectedPlayer(player);
                    }}
                  >
                    {player.name} - {getPositionName(player, positions)}
                  </MenuItem>
                ))}
            </Select>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAddPlayerToTeam;
