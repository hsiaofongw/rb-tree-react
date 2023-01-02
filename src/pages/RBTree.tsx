import { useEffect } from "react";
import { useJavaScriptDynamicModule } from "../hooks/useJavaScriptDynamicModule";
import { useTextContent } from "../hooks/useTsTemplateContent";
import { StructureVisualizeBySVG } from "../components/StructureVisualize";
import { paint } from "../rb-tree/layout";
import { VisualizeFrameWork } from "../components/VisualizeFramework";
import { TreeNode } from "../rb-tree/types";

export const RBTree = () => {
  const {
    defaultExport: root,
    setTypeScriptCode: setTsContent,
    isLoading,
  } = useJavaScriptDynamicModule<TreeNode<string, string>>();

  const templateFilename = "template.ts";
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
            paint(svgElement, root, divRef.current?.clientWidth ?? 100, 80, 16);
          }}
        />
      }
    />
  );
};
