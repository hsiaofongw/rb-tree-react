import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { nameOfProduct } from "./resources/theme-resources";
import React, { useState } from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const queryClient = new QueryClient();

type MenuEntry = {
  text: string;
  icon: React.ReactNode;
};

const DrawerEntry = (props: { entryGroups: MenuEntry[][] }) => {
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
                  <ListItem key={entryItem.text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>{entryItem.icon}</ListItemIcon>
                      <ListItemText primary={entryItem.text} />
                    </ListItemButton>
                  </ListItem>
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box
        sx={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#eee",
        }}
      >
        <Box>
          <AppBar position="static">
            <Toolbar>
              <DrawerEntry
                entryGroups={[
                  [
                    {
                      text: "Inbox",
                      icon: <InboxIcon />,
                    },
                    {
                      text: "Starred",
                      icon: <MailIcon />,
                    },
                  ],
                  [
                    {
                      text: "All mail",
                      icon: <InboxIcon />,
                    },
                  ],
                ]}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, marginLeft: 1 }}
              >
                {nameOfProduct}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box sx={{ flex: 1, overflow: "hidden" }}>123</Box>
      </Box>
    </QueryClientProvider>
  );
}

export default App;
