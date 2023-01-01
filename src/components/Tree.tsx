import { Box } from "@mui/material";
import { create } from "d3";
import { useEffect, useRef } from "react";
import { paint } from "../rb-tree/layout";
import { TreeNode } from "../rb-tree/types";
import { asNonNullable } from "../utils/typeUtils";

export const Tree = (props: {
  root: TreeNode<string, string>;
  svgId: string;
}) => {
  const divRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const svgSelection = create("svg").attr("id", props.svgId);
    const svgElement = asNonNullable(svgSelection.node());
    paint(svgElement, props.root, divRef.current?.clientWidth ?? 100, 80, 16);

    divRef.current?.appendChild(svgElement);

    return () => {
      svgSelection.remove();
    };
  });
  return <Box ref={divRef} sx={{ height: "100%", overflow: "auto" }}></Box>;
};
