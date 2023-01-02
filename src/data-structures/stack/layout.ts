import { svgNs } from "../../resources/namespace-resources";
import { Stack } from "./types";

const getTextElementWidth = (
  textElement: SVGTextElement
): { width: number; height: number } | undefined => {
  const measureSvgEle = window.document.createElementNS(svgNs, "svg");
  const measureSvgEleWidth = 100;
  const measureSvgEleHeight = 100;
  measureSvgEle.setAttribute(
    "style",
    `position: fixed; top: -${measureSvgEleHeight}px; left: -${measureSvgEleWidth}px`
  );
  measureSvgEle.setAttribute("width", measureSvgEleWidth.toString());
  measureSvgEle.setAttribute("height", measureSvgEleHeight.toString());
  window.document.body.appendChild(measureSvgEle);

  measureSvgEle.appendChild(textElement);

  const bbox = textElement.getBBox();

  if (bbox) {
    const box = { width: bbox.width, height: bbox.height };
    measureSvgEle.remove();
    return box;
  }

  measureSvgEle.remove();
};

const pointsToString = (points: number[][]): string => {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
};

const createArrowElement = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): SVGSVGElement => {
  const svgEle = window.document.createElementNS(svgNs, "svg");
  const defsEle = window.document.createElementNS(svgNs, "defs");
  const markerDefDele = window.document.createElementNS(svgNs, "marker");
  const arrowId = "arrow";
  markerDefDele.setAttribute("id", arrowId);
  markerDefDele.setAttribute("viewBox", "0 0 10 10");
  markerDefDele.setAttribute("refX", "10");
  markerDefDele.setAttribute("refY", "5");
  markerDefDele.setAttribute("markerWidth", "6");
  markerDefDele.setAttribute("markerHeight", "6");
  markerDefDele.setAttribute("orient", "auto-start-reverse");
  const arrowShapeEle = window.document.createElementNS(svgNs, "polyline");
  arrowShapeEle.setAttribute("stroke", "black");
  arrowShapeEle.setAttribute("fill", "none");
  arrowShapeEle.setAttribute(
    "points",
    pointsToString([
      [0, 0],
      [10, 5],
      [0, 10],
    ])
  );
  markerDefDele.appendChild(arrowShapeEle);
  defsEle.appendChild(markerDefDele);
  svgEle.appendChild(defsEle);

  const maxY = Math.max(y1, y2);
  const minY = Math.min(y1, y2);
  const maxX = Math.max(x1, x2);
  const minX = Math.min(x1, x2);
  const w = maxX - minX;
  const h = maxY - minY;
  svgEle.setAttribute("width", w.toString());
  svgEle.setAttribute("height", h.toString());
  svgEle.setAttribute("style", "overflow: visible;");

  const polyLineEle = window.document.createElementNS(svgNs, "polyline");
  polyLineEle.setAttribute(
    "points",
    pointsToString([
      [x1, y1],
      [x2, y2],
    ])
  );
  polyLineEle.setAttribute("fill", "none");
  polyLineEle.setAttribute("stroke", "black");
  polyLineEle.setAttribute("marker-start", `url(#${arrowId})`);
  polyLineEle.setAttribute("marker-end", `url(#${arrowId})`);

  svgEle.appendChild(polyLineEle);

  return svgEle;
};

const createLabelPointerElement = (
  textContent: string,
  width: number
): SVGSVGElement => {
  const svgElement = window.document.createElementNS(svgNs, "svg");
  svgElement.setAttribute("width", width.toString());

  const textElement = window.document.createElementNS(svgNs, "text");
  textElement.setAttribute("x", "0");
  textElement.setAttribute("y", "50%");
  textElement.setAttribute("alignment-baseline", "middle");
  textElement.textContent = textContent;

  const bbox = getTextElementWidth(textElement);
  const textWidth = bbox?.width ?? 0;
  const textHeight = bbox?.height ?? 0;

  const rectElement = window.document.createElementNS(svgNs, "rect");
  rectElement.setAttribute("x", "0");
  rectElement.setAttribute("y", "0");
  rectElement.setAttribute("width", (textWidth + 6).toString());
  rectElement.setAttribute("height", "100%");
  rectElement.setAttribute("stroke", "none");
  rectElement.setAttribute("fill", "#fff");

  const arrowElement = createArrowElement(
    0,
    textHeight / 2,
    width,
    textHeight / 2
  );

  svgElement.setAttribute("height", textHeight.toString());

  svgElement.appendChild(arrowElement);
  svgElement.appendChild(rectElement);
  svgElement.appendChild(textElement);

  return svgElement;
};

export const paint = (
  svgElement: SVGSVGElement,
  stack: Stack<any>,
  width: number,
  height: number,
  fontSizePx: number
) => {
  if (stack) {
    let basePtrTexts = ["$rbp"];
    if (stack.size === 0) {
      basePtrTexts.unshift("$rsp");
    }
    const basePtrText = basePtrTexts.join(", ");
    const basePtrTextEle = createLabelPointerElement(basePtrText, 100);

    svgElement.appendChild(basePtrTextEle);
  }
};
