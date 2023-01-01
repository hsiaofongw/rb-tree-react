import { MutableRefObject, useEffect, useRef } from "react";
import "./App.css";
import { Box } from "@mui/material";
import { editor } from "monaco-editor";
import { useQuery } from "react-query";
import axios from "axios";

const Editor = (props: {
  editorRef?: MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
  initialValue?: string;
  onChange?: () => void;
}) => {
  const editorEleRef = useRef<HTMLDivElement>();
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor>();
  useEffect(() => {
    if (!editorInstanceRef.current) {
      if (editorEleRef.current) {
        const instance = editor.create(editorEleRef.current, {
          value: props.initialValue || "",
          language: "typescript",
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

export const Home = () => {
  useEffect(() => {
    const fileContent = "export default 1234;";
    const fileName = "myScript.js";
    const fileObject = new File([fileContent], fileName, {
      type: "text/javascript",
    });
    const myScriptUrl = URL.createObjectURL(fileObject);
    // see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
    import(/* webpackIgnore: true */ myScriptUrl).then((res) => {
      console.log("Script loaded:", res.default);
    });
  }, []);

  const templateFilename = "template.ts";
  const { data: templateData } = useQuery([], () =>
    axios.get(templateFilename).then((res) => res.data)
  );

  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box", display: "flex" }}>
      <Box sx={{ flex: 1 }}></Box>
      <Box sx={{ flex: 1 }}>
        <Editor
          onChange={() => {
            if (editorRef) {
              if (editorRef.current) {
                console.log("Changed:", editorRef.current.getValue());
              }
            }
          }}
          editorRef={editorRef}
          initialValue={templateData ?? ""}
        />
      </Box>
    </Box>
  );
};
