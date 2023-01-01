import { MutableRefObject, useEffect, useRef, useState } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { editor } from "monaco-editor";
import { useQuery } from "react-query";
import axios from "axios";
import { Editor } from "./components/editor";
import ts from "typescript";
import { TreeNode } from "./rb-tree/types";

const loadScript = (fileContent: string) => {
  const fileName = "editorContent.js";
  const fileObject = new File([fileContent], fileName, {
    type: "text/javascript",
  });
  const moduleUrl = URL.createObjectURL(fileObject);
  // see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  return import(/* webpackIgnore: true */ moduleUrl);
};

const useTreeNode = (): [TreeNode<string, string>, (value: string) => void] => {
  const [root, setRoot] = useState<TreeNode<string, string>>();
  const setTsContent = (tsContent: string) => {
    if (tsContent) {
      const transpiledCode = ts.transpileModule(tsContent, {
        compilerOptions: { target: ts.ScriptTarget.ESNext },
      });
      if (transpiledCode && transpiledCode.outputText) {
        loadScript(transpiledCode.outputText).then((res) => {
          setRoot(res.default);
        });
        return;
      }
    }
    setRoot(undefined);
  };
  return [root, setTsContent];
};

export const Home = () => {
  const templateFilename = "template.ts";
  const { data: templateData } = useQuery([templateFilename], () =>
    axios.get(templateFilename).then((res) => res.data)
  );

  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [root, setTsContent] = useTreeNode();

  useEffect(() => {
    setTsContent(templateData);
  }, [templateData]);

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box", display: "flex" }}>
      <Box sx={{ flex: 1 }}></Box>
      <Box sx={{ flex: 1 }}>
        <Editor
          editorRef={editorRef}
          initialValue={templateData ?? ""}
          onChange={() => {
            const value = editorRef.current?.getValue() ?? "";
            setTsContent(value);
          }}
        />
      </Box>
    </Box>
  );
};
