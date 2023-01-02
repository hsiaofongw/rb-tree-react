import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { nameOfProduct } from "../resources/theme-resources";
import React, { useContext, useEffect } from "react";
import { DrawerEntry } from "./DrawerEntry";
import { MenuEntry } from "../types";
import { MenuEntryContext } from "../providers/MenuEntryProvider";

export const Layout = (props: { children: React.ReactNode }) => {
  const entryGroups = useContext<MenuEntry[][]>(MenuEntryContext);
  useEffect(() => {
    window.document.title = nameOfProduct;
  });

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
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          boxSizing: "border-box",
          padding: 2,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};
