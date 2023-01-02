import { useEffect } from "react";
import { useJavaScriptDynamicModule } from "../hooks/useJavaScriptDynamicModule";
import { useTextContent } from "../hooks/useTsTemplateContent";
import { StructureVisualizeBySVG } from "../components/StructureVisualize";
import { VisualizeFrameWork } from "../components/VisualizeFramework";
import { Stack } from "../data-structures/stack/types";
import { paint } from "../data-structures/stack/layout";

export const StackVisualize = () => {
  const {
    defaultExport: stack,
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
            const boxHeight = 30;
            const fontSizePx = 16;
            paint(
              svgElement,
              stack,
              divRef.current?.clientWidth || 100,
              boxHeight,
              fontSizePx
            );
          }}
        />
      }
    />
  );
};
