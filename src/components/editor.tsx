import { MutableRefObject, useEffect, useRef } from "react";
import { editor } from "monaco-editor";
import { Box } from "@mui/material";

export const Editor = (props: {
  indentSize?: number;
  editorRef?: MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
  initialValue?: string;
  onChange?: () => void;
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
        });

        editorInstanceRef.current = instance;
        if (props.editorRef) {
          props.editorRef.current = instance;
        }

        instance.getModel()?.onDidChangeContent(() => props.onChange?.());
      }
    }
  });

  useEffect(() => {
    editorInstanceRef.current?.setValue(props.initialValue || "");
  }, [props.initialValue]);

  return <Box sx={{ height: "100%" }} ref={editorEleRef}></Box>;
};
