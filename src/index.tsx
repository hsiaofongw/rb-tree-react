import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { RBTree } from "./pages/RBTree";
import { RedirectToExternalSite } from "./components/RedirectToExternalSite";
import { Box } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ViewStreamIcon from "@mui/icons-material/ViewStream";

import HomeIcon from "@mui/icons-material/Home";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  linkOfGithubRepo,
  nameOfGithubRepo,
  ownerOfGithubRepo,
} from "./resources/github-resources";
import { MenuEntry } from "./types";
import { MenuEntryContext } from "./providers/MenuEntryProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/rb-tree",
    element: (
      <Layout>
        <RBTree />
      </Layout>
    ),
  },
  {
    path: "/stack",
    element: (
      <Layout>
        <Box>Stack</Box>
      </Layout>
    ),
  },
  {
    path: "redirect-to-external-site",
    element: <RedirectToExternalSite />,
  },
]);

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

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MenuEntryContext.Provider value={entryGroups}>
        <RouterProvider router={router} />
      </MenuEntryContext.Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
