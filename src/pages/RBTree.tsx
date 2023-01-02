import { useEffect } from "react";
import { useTreeNode } from "../hooks/useTreeNode";
import { useTsTemplateContent } from "../hooks/useTsTemplateContent";
import { StructureVisualizeBySVG } from "../components/StructureVisualize";
import { paint } from "../rb-tree/layout";
import { VisualizeFrameWork } from "../components/VisualizeFramework";

export const RBTree = () => {
  const { root, setTsContent, isLoading } = useTreeNode();
  const { data: templateData } = useTsTemplateContent();
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
