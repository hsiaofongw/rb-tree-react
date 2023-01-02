import { Paper, Typography } from "@mui/material";
import { nameOfProduct } from "../resources/theme-resources";

export const Home = () => {
  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h5">Welcome to {nameOfProduct}!</Typography>
      </Paper>
    </>
  );
};
