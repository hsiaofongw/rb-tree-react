import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box } from "@mui/material";
import ts, { factory } from "typescript";

function App() {
  useEffect(() => {
    const fileContent = "export default 1234;";
    const fileName = "myScript.js";
    const fileObject = new File([fileContent], fileName, {
      type: "text/javascript",
    });
    const myScriptUrl = URL.createObjectURL(fileObject);
    // see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
    https: import(/* webpackIgnore: true */ myScriptUrl).then((res) => {
      console.log("Script loaded:", res);
    });
  }, []);

  return <Box>Hello</Box>;
}

export default App;
