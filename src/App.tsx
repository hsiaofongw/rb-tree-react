import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box } from "@mui/material";
import ts, { factory } from "typescript";

function utf8_to_b64(str: string) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function createDataUrl(str: string) {
  return `data:text/javascript,${str}`;
}

function App() {
  useEffect(() => {
    const prevAnchor = window.document.getElementById("123");
    if (prevAnchor) {
      prevAnchor.remove();
    }
    const scriptEle = window.document.createElement("script");
    scriptEle.setAttribute("id", "123");
    scriptEle.text = `
      import("./myFile.js").then((res) => {
        console.log("Res:", res.default);
      });
    `;
    window.document.head.appendChild(scriptEle);
  }, []);

  return <Box>Hello</Box>;
}

export default App;
