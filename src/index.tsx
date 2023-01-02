import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { Box } from "@mui/material";
import { Home } from "./pages/Home";
import { RBTree } from "./pages/RBTree";

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
]);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
