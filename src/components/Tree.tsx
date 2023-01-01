import { Box } from "@mui/material";
import { create, select } from "d3";
import { useEffect, useRef } from "react";
import { paint } from "../rb-tree/layout";
import { TreeNode } from "../rb-tree/types";
import { svgNs } from "../resources/namespaces";

export const Tree = (props: { root: TreeNode<string, string> }) => {
  const divRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const svgSelection = create("svg");
    const svgElement = svgSelection.node() as SVGSVGElement;
    paint(svgElement, props.root, 200, 200, 30, 16);

    divRef.current?.appendChild(svgElement);

    return () => {
      svgSelection.remove();
    };
  });
  return <Box ref={divRef} sx={{ height: "100%" }}></Box>;
};
