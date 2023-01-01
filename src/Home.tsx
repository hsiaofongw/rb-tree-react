import { useEffect, useRef } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { editor } from "monaco-editor";
import { useQuery } from "react-query";
import axios from "axios";
import { Editor } from "./components/editor";
import { useTreeNode } from "./hooks/useTreeNode";

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
