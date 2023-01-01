import { MutableRefObject, useEffect, useRef } from "react";
import { editor } from "monaco-editor";
import { Box, Button, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

export const Editor = (props: {
  indentSize?: number;
  editorRef?: MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
  initialValue?: string;
  onChange?: () => void;
  onLoaded?: () => void;
  onExecute?: () => void;
  isLoading?: boolean;
}) => {
  const indentSize = props.indentSize ?? 2;
  const editorEleRef = useRef<HTMLDivElement>();
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor>();
  useEffect(() => {
    if (!editorInstanceRef.current) {
      if (editorEleRef.current) {
        const instance = editor.create(editorEleRef.current, {
          value: props.initialValue || "",
          language: "typescript",
          tabSize: indentSize,
          automaticLayout: true,
        });

        editorInstanceRef.current = instance;
        if (props.editorRef) {
          props.editorRef.current = instance;
        }

        instance.getModel()?.onDidChangeContent(() => props.onChange?.());
        props.onLoaded?.();
      }
    }
  });

  useEffect(() => {
    editorInstanceRef.current?.setValue(props.initialValue || "");
  }, [props.initialValue]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: "1", minHeight: "100px" }} ref={editorEleRef}></Box>
      <Box sx={{ height: "100px" }}>
        <Stack sx={{ padding: "20px" }} direction={"row"} spacing={2}>
          <LoadingButton
            loading={props.isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={() => props.onExecute?.()}
          >
            Execute
          </LoadingButton>
        </Stack>
      </Box>
    </Box>
  );
};
