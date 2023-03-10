import { MutableRefObject, useEffect, useRef } from "react";
import { editor } from "monaco-editor";
import { Box } from "@mui/material";

export const Editor = (props: {
  indentSize?: number;
  editorRef?: MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
  initialValue?: string;
  onChange?: () => void;
  onLoaded?: () => void;
  revealLine?: number;
}) => {
  const indentSize = props.indentSize ?? 2;
  const editorEleRef = useRef<HTMLDivElement>();
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor>();
  useEffect(() => {
    let instance: editor.IStandaloneCodeEditor | undefined;

    if (editorEleRef.current) {
      instance = editor.create(editorEleRef.current, {
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

      if (props.revealLine !== undefined) {
        instance.revealLineNearTop(props.revealLine);
      }

      props.onLoaded?.();
    }

    return () => {
      instance?.dispose();
    };
  }, [props.indentSize, props.initialValue, props.revealLine]);

  return <Box sx={{ flex: "1", minHeight: "100px" }} ref={editorEleRef}></Box>;
};
