export const getPositionName = (player, playerPositions) => {
  const position = playerPositions.find(
    (position) => position.position_id === player.position_id
  );

  return position ? position.position_name_short : "";
};
