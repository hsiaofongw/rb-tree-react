import { useEffect, useRef } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { editor } from "monaco-editor";
import { Editor } from "./components/Editor";
import { useTreeNode } from "./hooks/useTreeNode";
import { useTsTemplateContent } from "./hooks/useTsTemplateContent";
import { Tree } from "./components/Tree";

export const Home = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [root, setTsContent] = useTreeNode();
  const { data: templateData } = useTsTemplateContent();
  useEffect(() => {
    setTsContent(templateData);
  }, [templateData]);

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box", display: "flex" }}>
      <Box sx={{ flex: 1 }}>
        <Tree root={root} />
      </Box>
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
