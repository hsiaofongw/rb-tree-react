import { select } from "d3";
import { svgNs } from "../../resources/namespace-resources";
import { Stack } from "./types";

const defaultHorizontalGap = 6;
const defaultStrokeWidth = 1;

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

const createLineElement = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): SVGLineElement => {
  const lineElement = window.document.createElementNS(svgNs, "line");
  lineElement.setAttribute("x1", x1.toString());
  lineElement.setAttribute("y1", y1.toString());
  lineElement.setAttribute("x2", x2.toString());
  lineElement.setAttribute("y2", y2.toString());
  lineElement.setAttribute("stroke", "black");
  lineElement.setAttribute("stroke-width", defaultStrokeWidth.toString());
  return lineElement;
};

const createPolylineElement = (points: number[][]): SVGPolylineElement => {
  const polyLineEle = window.document.createElementNS(svgNs, "polyline");
  polyLineEle.setAttribute("points", pointsToString(points));
  polyLineEle.setAttribute("fill", "none");
  polyLineEle.setAttribute("stroke", "black");
  polyLineEle.setAttribute("stroke-width", defaultStrokeWidth.toString());
  return polyLineEle;
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

  const polyLineEle = createLineElement(x1, y1, x2, y2);
  polyLineEle.setAttribute("marker-end", `url(#${arrowId})`);

  svgEle.appendChild(polyLineEle);

  return svgEle;
};

const createLabelPointerElement = (
  textContent: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  placement: "start" | "end"
): SVGGElement => {
  const textElement = window.document.createElementNS(svgNs, "text");
  textElement.setAttribute("alignment-baseline", "middle");
  if (placement === "start") {
    textElement.setAttribute("x", x1.toString());
    textElement.setAttribute("y", y1.toString());
    textElement.setAttribute("text-anchor", "end");
    textElement.setAttribute("dx", `-${defaultHorizontalGap}`);
  } else if (placement === "end") {
    textElement.setAttribute("x", x2.toString());
    textElement.setAttribute("y", y2.toString());
    textElement.setAttribute("text-anchor", "start");
    textElement.setAttribute("dx", `-${defaultHorizontalGap}`);
  }
  textElement.textContent = textContent;

  const arrowElement = createArrowElement(x1, y1, x2, y2);

  const gElement = window.document.createElementNS(svgNs, "g");
  gElement.appendChild(textElement);
  gElement.appendChild(arrowElement);

  return gElement;
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
    const basePtrStartX = 90;
    const basePtrStartY = 20;
    const basePtrLength = 70;
    const basePtrEndX = basePtrStartX + basePtrLength;
    const basePtrEndY = basePtrStartY;
    const basePtrTextEle = createLabelPointerElement(
      basePtrText,
      basePtrStartX,
      basePtrStartY,
      basePtrEndX,
      basePtrEndY,
      "start"
    );

    const stackItemWidth = 120;
    const stackItemHeight = 40;
    const stackItemStrokeWidth = defaultStrokeWidth;
    const stackBaseLineX1 = basePtrEndX + defaultHorizontalGap;
    const stackBaseLineY1 = basePtrEndY;

    const stackBaseLineEle = createLineElement(
      stackBaseLineX1,
      stackBaseLineY1,
      stackBaseLineX1 + stackItemWidth - stackItemStrokeWidth,
      stackBaseLineY1
    );

    const cellClassName = "cell";
    const cellSelector = `.${cellClassName}`;
    select(svgElement)
      .selectAll(cellSelector)
      .data(stack.storage)
      .join((enter) =>
        enter
          .append(function (datum, idx) {
            const gElement = window.document.createElementNS(svgNs, "g");
            const x = stackBaseLineX1;
            const y = stackBaseLineY1 + idx * stackItemHeight;
            const polylineElement = createPolylineElement([
              [x, y],
              [x, y + stackItemHeight],
              [x + stackItemWidth - stackItemStrokeWidth, y + stackItemHeight],
              [x + stackItemWidth - stackItemStrokeWidth, y],
            ]);
            gElement.appendChild(polylineElement);
            return gElement;
          })
          .classed(cellClassName, true)
      );

    svgElement.appendChild(basePtrTextEle);
    svgElement.appendChild(stackBaseLineEle);
  }
};
