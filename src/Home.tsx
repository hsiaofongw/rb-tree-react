import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { editor } from "monaco-editor";
import { Editor } from "./components/Editor";
import { useTreeNode } from "./hooks/useTreeNode";
import { useTsTemplateContent } from "./hooks/useTsTemplateContent";
import { Tree } from "./components/Tree";

export const useRevealLineIdx = (
  targetLinePrefix: string,
  textContent: string
) => {
  const lines = textContent.split("\n");
  let revealLine: undefined | number;
  for (let lineIdx = 0; lineIdx < lines.length; ++lineIdx) {
    const line = lines[lineIdx];
    if (line.indexOf(targetLinePrefix) === 0) {
      revealLine = lineIdx + 1;
      break;
    }
  }
  return { revealLine };
};

export const Home = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const { root, setTsContent, isLoading } = useTreeNode();
  const { data: templateData } = useTsTemplateContent();
  useEffect(() => {
    setTsContent(templateData);
  }, [templateData]);

  const targetLinePrefix = "// Start user codes";
  const { revealLine } = useRevealLineIdx(targetLinePrefix, templateData ?? "");

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box", display: "flex" }}>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Tree root={root} />
      </Box>
      <Box sx={{ width: `${window.innerWidth * 0.4}px` }}>
        <Editor
          revealLine={revealLine}
          isLoading={isLoading}
          editorRef={editorRef}
          initialValue={templateData ?? ""}
          onExecute={() => {
            const value = editorRef.current?.getValue() ?? "";
            setTsContent(value);
          }}
        />
      </Box>
    </Box>
  );
};
