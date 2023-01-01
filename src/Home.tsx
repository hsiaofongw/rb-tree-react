import { MutableRefObject, useEffect, useRef } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { editor } from "monaco-editor";
import { useQuery } from "react-query";
import axios from "axios";
import { Editor } from "./components/editor";

export const Home = () => {
  useEffect(() => {
    const fileContent = "export default 1234;";
    const fileName = "myScript.js";
    const fileObject = new File([fileContent], fileName, {
      type: "text/javascript",
    });
    const myScriptUrl = URL.createObjectURL(fileObject);
    // see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
    import(/* webpackIgnore: true */ myScriptUrl).then((res) => {
      console.log("Script loaded:", res.default);
    });
  }, []);

  // const templateFilename = "template.ts";
  // const { data: templateData } = useQuery([], () =>
  //   axios.get(templateFilename).then((res) => res.data)
  // );

  // const editorRef = useRef<editor.IStandaloneCodeEditor>();

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box", display: "flex" }}>
      <Box sx={{ flex: 1 }}></Box>
      <Box sx={{ flex: 1 }}></Box>
    </Box>
  );
};
