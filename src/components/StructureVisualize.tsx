import { Box, Button } from "@mui/material";
import { create } from "d3";
import { MutableRefObject, useEffect, useRef } from "react";
import { downloadFile, getEscapedTimestamp } from "../utils/downloadFile";
import { asNonNullable } from "../utils/typeUtils";

export const StructureVisualizeBySVG = (props: {
  paint: (
    svgElement: SVGSVGElement,
    containerRef: MutableRefObject<HTMLDivElement | undefined>
  ) => void;
}) => {
  const divRef = useRef<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>();
  useEffect(() => {
    const svgSelection = create("svg");
    const svgElement = asNonNullable(svgSelection.node());
    props.paint(svgElement, divRef);

    divRef.current?.appendChild(svgElement);
    svgRef.current = svgElement;

    return () => {
      svgSelection.remove();
      svgRef.current = undefined;
    };
  });

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box ref={divRef} sx={{ flex: "1", overflow: "auto" }}></Box>
      <Box sx={{ padding: "20px", boxSizing: "content-box" }}>
        <Button
          sx={{ flexShrink: 0 }}
          variant="outlined"
          onClick={() => {
            const svgEle = svgRef.current;
            if (svgEle) {
              const serializer = new XMLSerializer();
              const svgContent = serializer.serializeToString(svgEle);
              if (svgContent) {
                const timestamp = getEscapedTimestamp();
                const svgFileName = `svg-${timestamp}.svg`;
                downloadFile(svgContent, svgFileName);
              }
            }
          }}
        >
          Export SVG
        </Button>
      </Box>
    </Box>
  );
};
