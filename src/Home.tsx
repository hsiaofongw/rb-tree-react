import { useEffect, useId, useRef } from "react";
import "./App.css";
import { Box, Button, Stack, Tooltip } from "@mui/material";
import { editor } from "monaco-editor";
import { Editor } from "./components/Editor";
import { useTreeNode } from "./hooks/useTreeNode";
import { useTsTemplateContent } from "./hooks/useTsTemplateContent";
import { Tree } from "./components/Tree";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { downloadFile, getEscapedTimestamp } from "./utils/downloadFile";
import { Resizable } from "re-resizable";
import IconButton from "@mui/material/IconButton";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

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
  const svgId = useId();

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box", display: "flex" }}>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Tree root={root} svgId={svgId} />
      </Box>
      <Resizable
        minWidth={540}
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
          <Box sx={{ height: "100px" }}>
            <Stack sx={{ padding: "20px" }} direction={"row"} spacing={2}>
              <LoadingButton
                loading={isLoading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={() => {
                  const value = editorRef.current?.getValue() ?? "";
                  setTsContent(value);
                }}
              >
                Execute
              </LoadingButton>
              <Button
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

              <Tooltip placement="top" title={"Click for help"}>
                <IconButton>
                  <HelpOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
      </Resizable>
    </Box>
  );
};
