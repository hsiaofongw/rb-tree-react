import { MutableRefObject, useEffect, useRef } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { editor } from "monaco-editor";
import { useQuery } from "react-query";
import axios from "axios";
import { Editor } from "./components/editor";
import ts from "typescript";

const loadScript = (fileContent: string) => {
  const fileName = "editorContent.js";
  const fileObject = new File([fileContent], fileName, {
    type: "text/javascript",
  });
  const moduleUrl = URL.createObjectURL(fileObject);
  // see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  return import(/* webpackIgnore: true */ moduleUrl);
};

export const Home = () => {
  const templateFilename = "template.ts";
  const { data: templateData } = useQuery([], () =>
    axios.get(templateFilename).then((res) => res.data)
  );

  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box", display: "flex" }}>
      <Box sx={{ flex: 1 }}></Box>
      <Box sx={{ flex: 1 }}>
        <Editor
          editorRef={editorRef}
          initialValue={templateData ?? ""}
          onChange={() => {
            const value = editorRef.current?.getValue() ?? "";
            if (value) {
              const transpiledCode = ts.transpileModule(value, {
                compilerOptions: { target: ts.ScriptTarget.ESNext },
              });
              if (transpiledCode && transpiledCode.outputText) {
                loadScript(transpiledCode.outputText).then((res) => {
                  console.log({ value: res.default });
                });
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};
