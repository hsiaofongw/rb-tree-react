import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { MenuEntry } from "../types";
import { Link } from "react-router-dom";

export const DrawerEntry = (props: { entryGroups: MenuEntry[][] }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          {props.entryGroups.map((group, groupIdx, groups) => (
            <React.Fragment key={groupIdx}>
              <List>
                {group.map((entryItem) => (
                  <Link
                    key={entryItem.text}
                    to={entryItem.to}
                    onClick={() => setOpen(false)}
                    style={{ textDecoration: "none", color: "inherit" }}
                    target={entryItem.target}
                  >
                    <ListItem key={entryItem.text} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>{entryItem.icon}</ListItemIcon>
                        <ListItemText primary={entryItem.text} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                ))}
              </List>
              {groupIdx < groups.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Drawer>
    </>
  );
};
