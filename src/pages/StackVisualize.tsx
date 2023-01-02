import { useEffect } from "react";
import { useJavaScriptDynamicModule } from "../hooks/useJavaScriptDynamicModule";
import { useTextContent } from "../hooks/useTsTemplateContent";
import { StructureVisualizeBySVG } from "../components/StructureVisualize";
import { VisualizeFrameWork } from "../components/VisualizeFramework";
import { Stack } from "../stack/types";

export const StackVisualize = () => {
  const {
    defaultExport: root,
    setTypeScriptCode: setTsContent,
    isLoading,
  } = useJavaScriptDynamicModule<Stack<string>>();

  const templateFilename = "stack-code-template.ts";
  const { data: templateData } = useTextContent(templateFilename);
  useEffect(() => {
    setTsContent(templateData);
  }, [templateData]);

  return (
    <VisualizeFrameWork
      initialCode={templateData ?? ""}
      onCodeUpdate={setTsContent}
      isLoading={isLoading}
      visualization={
        <StructureVisualizeBySVG
          paint={(svgElement, divRef) => {
            // paint(svgElement, root, divRef.current?.clientWidth ?? 100, 80, 16);
          }}
        />
      }
    />
  );
};
