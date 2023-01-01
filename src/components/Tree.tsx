import { Box } from "@mui/material";
import { select } from "d3";
import { useEffect, useRef } from "react";
import { paint } from "../rb-tree/layout";
import { TreeNode } from "../rb-tree/types";

export const Tree = (props: { root: TreeNode<string, string> }) => {
  const divRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const nodes = [props.root];
    if (divRef.current) {
      const divEle = divRef.current;
      const svgSelection = select(divEle)
        .selectAll("svg")
        .data(nodes)
        .join((enter) => enter.append("svg"));

      const svgEle = svgSelection.node();
      if (svgEle) {
        paint(svgEle as any, props.root, 200, 100, 30, 16);
      }
    }
  });
  return <Box ref={divRef} sx={{ height: "100%" }}></Box>;
};
