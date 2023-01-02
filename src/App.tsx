import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { nameOfProduct } from "./resources/theme-resources";
import React from "react";
import { DrawerEntry } from "./components/DrawerEntry";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import { MenuEntry } from "./types";

const entryGroups: MenuEntry[][] = [
  [
    {
      text: "Red Black Tree",
      icon: <AccountTreeIcon />,
    },
    {
      text: "Stack",
      icon: <ViewStreamIcon />,
    },
  ],
];

export const Layout = (props: { children: React.ReactNode }) => {
  return (
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
            <DrawerEntry entryGroups={entryGroups} />
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
      <Box sx={{ flex: 1, overflow: "hidden" }}>{props.children}</Box>
    </Box>
  );
};

function App() {
  return <></>;
}

export default App;
