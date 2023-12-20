import React from "react";
import SoccerLineUp from "react-soccer-lineup";

const FootballFieldComponent = () => {
  return (
    <div className="football-field">
      <SoccerLineUp size="big" color="lightseagreen" pattern="lines" squad />
    </div>
  );
};

export default FootballFieldComponent;
