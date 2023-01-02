import { Box } from "@mui/material";
import { create } from "d3";
import { MutableRefObject, useEffect, useRef } from "react";
import { asNonNullable } from "../utils/typeUtils";

export const StructureVisualize = (props: {
  paint: (
    svgElement: SVGSVGElement,
    containerRef: MutableRefObject<HTMLDivElement | undefined>
  ) => void;
}) => {
  const divRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const svgSelection = create("svg");
    const svgElement = asNonNullable(svgSelection.node());
    props.paint(svgElement, divRef);

    divRef.current?.appendChild(svgElement);

    return () => {
      svgSelection.remove();
    };
  });
  return <Box ref={divRef} sx={{ height: "100%", overflow: "auto" }}></Box>;
};
