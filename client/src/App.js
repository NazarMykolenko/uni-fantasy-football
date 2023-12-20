import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Home, Menu, Money, Receipt, SportsSoccer } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import PlayerSelection from "./components/PlayerSelection";
import FootballFieldComponent from "./components/FootballField";
import "./App.css";
import Dropdown from "./components/Dropdown";
import ButtonDropdown from "./components/ButtonDropdown";

function App() {
  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const DrawerList = ({ anchor }) => {
    const location = useLocation();
    const menuItems = [
      { name: "Lorem ipsum", path: "/", icon: <Home /> },
      { name: "Lorem ipsum", path: "/draft", icon: <SportsSoccer /> },
      { name: "Lorem ipsum", path: "/page2", icon: <Money /> },
      { name: "Lorem ipsum", path: "/page3", icon: <Receipt /> },
    ];

    return (
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.name}
              disablePadding
              sx={{
                backgroundColor:
                  location.pathname === item.path ? "#9c27b0" : "inherit",
                color: location.pathname === item.path ? "#fff" : "inherit",
              }}
            >
              <Link
                to={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon
                    sx={{
                      color:
                        location.pathname === item.path ? "#fff" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    );
  };

  return (
    <BrowserRouter>
      <IconButton color="secondary" onClick={toggleDrawer("left", true)}>
        <Menu />
      </IconButton>
      <Drawer
        anchor="left"
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
      >
        <DrawerList anchor="left" />
      </Drawer>

      <Routes>
        <Route
          path="/draft"
          element={
            <div>
              <div className="draft">
                <div className="player-selection">
                  <PlayerSelection></PlayerSelection>
                </div>
                <div className="football-field">
                  <FootballFieldComponent />
                </div>
              </div>
            </div>
          }
        />
        <Route path="/page1" element={<div>Page ⚽️</div>} />
        <Route path="/page2" element={<div>Page ⚽️</div>} />
        <Route path="/page3" element={<div>Page ⚽️</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
