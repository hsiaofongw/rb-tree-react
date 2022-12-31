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
    const scriptImportMapEle = window.document.querySelector(
      "script[type=importmap]"
    );
    const moduleAlias = "myScripts";
    if (scriptImportMapEle) {
      try {
        if (scriptImportMapEle.textContent) {
          const mapObject = JSON.parse(scriptImportMapEle.textContent);
          if (mapObject && mapObject.imports) {
            if (mapObject.imports[moduleAlias] === myScriptUrl) {
              return;
            }
            mapObject.imports[moduleAlias] = myScriptUrl;
            scriptImportMapEle.textContent = JSON.stringify(mapObject);
            window.setTimeout(() => {
              import("./" + fileName).then((res) => {
                console.log("load:", res);
              });
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return <Box>Hello</Box>;
}

export default App;
