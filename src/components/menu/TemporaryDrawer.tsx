// TemporaryDrawer.tsx
import React from "react";
// import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./menu.scss";
import { menu } from "../../data";
import { Link } from "react-router-dom";
import {
  //   Box,
  Drawer,
  List,
  //   ListItem,
  //   ListItemButton,
  //   ListItemIcon,
  //   ListItemText,
} from "@mui/material";

type Anchor = "left";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <List
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="temp_menu_drawer">
        {menu.map((item) => (
          <div className="item" key={item.id}>
            <span className="title">{item.title}</span>
            {item.listItems.map((listItem) => (
              <Link to={listItem.url} className="listItem" key={listItem.id}>
                <img src={listItem.icon} alt="" className="listItem_icon" />
                {/* <ListItemText primary={listItem.title} /> */}
                <span className="listItemTitle">{listItem.title}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </List>
  );

  return (
    <div className="menuDrawer">
      <IconButton
        onClick={toggleDrawer("left", true)}
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer("left", false)}
      >
        <div style={{ background: "#F5F5F5" }}>{list("left")}</div>
      </Drawer>
    </div>
  );
}
