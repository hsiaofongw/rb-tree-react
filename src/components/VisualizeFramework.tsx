import { useId, useRef } from "react";
import { Box, Button, Paper } from "@mui/material";
import { editor } from "monaco-editor";
import { Editor } from "../components/Editor";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { downloadFile, getEscapedTimestamp } from "../utils/downloadFile";
import { Resizable } from "re-resizable";
import { HelpEntry } from "../components/HelpEntry";
import { useRevealLineIdx } from "../hooks/useRevealLineIdx";

export const VisualizeFrameWork = (props: {
  visualization: React.ReactNode;
  initialCode: string;
  onCodeUpdate?: (code: string) => void;
  isLoading?: boolean;
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const isLoading = !!props.isLoading;

  const targetLinePrefix = "// Start user codes";
  const { revealLine } = useRevealLineIdx(targetLinePrefix, props.initialCode);
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
      <Box sx={{ flex: 1, overflow: "hidden" }}>{props.visualization}</Box>
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
            initialValue={props.initialCode}
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
                  props.onCodeUpdate?.(value);
                }}
                sx={{ flexShrink: 0 }}
              >
                Execute
              </LoadingButton>

              <Button
                sx={{ flexShrink: 0 }}
                variant="outlined"
                onClick={() => {
                  const codeContent = editorRef.current?.getValue() ?? "";
                  const timestamp = getEscapedTimestamp();
                  const codeFileName = `code-${timestamp}.ts`;
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
