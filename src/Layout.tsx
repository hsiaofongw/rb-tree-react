import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { nameOfProduct } from "./resources/theme-resources";
import React from "react";
import { DrawerEntry } from "./components/DrawerEntry";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import { MenuEntry } from "./types";
import HomeIcon from "@mui/icons-material/Home";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  linkOfGithubRepo,
  nameOfGithubRepo,
  ownerOfGithubRepo,
} from "./resources/github-resources";

const entryGroups: MenuEntry[][] = [
  [
    {
      text: "Home",
      icon: <HomeIcon />,
      to: "/",
    },
  ],
  [
    {
      text: "Red Black Tree",
      icon: <AccountTreeIcon />,
      to: "/rb-tree",
    },
    {
      text: "Stack",
      icon: <ViewStreamIcon />,
      to: "/stack",
    },
  ],
  [
    {
      text: "Repo",
      icon: <GitHubIcon />,
      to: {
        pathname: "/redirect-to-external-site",
        search:
          "?" +
          new URLSearchParams({
            url: linkOfGithubRepo(ownerOfGithubRepo, nameOfGithubRepo),
          }).toString(),
      },
      target: "_blank",
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
