import { useEffect, useId, useRef } from "react";
import { Box, Button, Paper, Stack } from "@mui/material";
import { editor } from "monaco-editor";
import { Editor } from "../components/Editor";
import { useTreeNode } from "../hooks/useTreeNode";
import { useTsTemplateContent } from "../hooks/useTsTemplateContent";
import { StructureVisualizeBySVG } from "../components/StructureVisualize";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { downloadFile, getEscapedTimestamp } from "../utils/downloadFile";
import { Resizable } from "re-resizable";
import { HelpEntry } from "../components/HelpEntry";
import { paint } from "../rb-tree/layout";

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

export const RBTree = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const { root, setTsContent, isLoading } = useTreeNode();
  const { data: templateData } = useTsTemplateContent();
  useEffect(() => {
    setTsContent(templateData);
  }, [templateData]);

  const targetLinePrefix = "// Start user codes";
  const { revealLine } = useRevealLineIdx(targetLinePrefix, templateData ?? "");
  const svgId = useId();

  return (
    <Paper
      sx={{
        minHeight: "100%",
        height: "100%",
        padding: "10px",
        boxSizing: "border-box",
        display: "flex",
      }}
    >
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <StructureVisualizeBySVG
          paint={(svgElement, divRef) => {
            paint(svgElement, root, divRef.current?.clientWidth ?? 100, 80, 16);
            svgElement.setAttribute("id", svgId);
          }}
        />
      </Box>
      <Resizable
        minWidth={420}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        defaultSize={{ width: window.innerWidth * 0.4, height: "100%" }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Editor
            revealLine={revealLine}
            editorRef={editorRef}
            initialValue={templateData ?? ""}
          />
          <Box sx={{ height: "auto", display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                boxSizing: "content-box",
                padding: "20px",
                display: "flex",
                flexDirection: "row",
                columnGap: 2,
                rowGap: 2,
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <LoadingButton
                loading={isLoading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={() => {
                  const value = editorRef.current?.getValue() ?? "";
                  setTsContent(value);
                }}
                sx={{ flexShrink: 0 }}
              >
                Execute
              </LoadingButton>
              <Button
                sx={{ flexShrink: 0 }}
                variant="outlined"
                onClick={() => {
                  const svgEle = window.document.getElementById(svgId);
                  if (svgEle) {
                    const serializer = new XMLSerializer();
                    const svgContent = serializer.serializeToString(svgEle);
                    if (svgContent) {
                      const timestamp = getEscapedTimestamp();
                      const svgFileName = `svg-${timestamp}.svg`;
                      downloadFile(svgContent, svgFileName);
                    }
                  }
                }}
              >
                Export SVG
              </Button>
              <Button
                sx={{ flexShrink: 0 }}
                variant="outlined"
                onClick={() => {
                  const codeContent = editorRef.current?.getValue() ?? "";
                  const timestamp = getEscapedTimestamp();
                  const codeFileName = `red-black-tree-code-${timestamp}.ts`;
                  downloadFile(codeContent, codeFileName);
                }}
              >
                Export Code
              </Button>

              <HelpEntry />
            </Box>
          </Box>
        </Box>
      </Resizable>
    </Paper>
  );
};
