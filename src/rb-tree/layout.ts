import { TreeNode } from "./types";
import { isRed } from "./utils";
import { select } from "d3";
import { svgNs } from "../resources/namespaces";
import { asNonNullable } from "../utils/typeUtils";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Direction = "left" | "right";

type LayoutContainer =
  | {
      node: TreeNode<any, any>;
      box?: Box;
      left?: LayoutContainer;
      right?: LayoutContainer;
    }
  | undefined;

type TextBox = {
  x: number;
  y: number;
  text: string;
};

type Point = { x: number; y: number };

type Connection = {
  from: Point;
  to: Point;
  color: string;
};

type Graph = { textBoxes: TextBox[]; connections: Connection[] };

type Vertex = LayoutContainer;

type Edge = { from: Vertex; to: Vertex };

type FlatLayout = {
  vertices: Vertex[];
  edges: Edge[];
};

const logInvalidNode = (path?: Direction[]) => {
  console.error("Invalid node, path is:", path);
  throw new Error("Invalid node");
};

type LayoutContainerCreateOptions = {
  node: TreeNode<any, any>;
  initX: number;
  initY: number;
  width: number;
  height: number;
  fontSizePx: number;
};

type InternalLayoutContainerCreateOptions = LayoutContainerCreateOptions & {
  path: Direction[];
  layoutContainer: LayoutContainer;
};

/** 布局算法确定每一个节点的坐标 */
const doLayout = (option: InternalLayoutContainerCreateOptions): void => {
  const diameter = option.fontSizePx * 2;
  const halfWidth = (option.width - diameter) / 2;
  if (option.layoutContainer?.node) {
    const node = option.layoutContainer.node;
    if (isRed(node.left) && isRed(node.right)) {
      option.layoutContainer.box = {
        x: option.initX + halfWidth,
        y: option.initY,
        width: diameter,
        height: option.height,
      };

      if (
        isRed(node.left?.left) ||
        isRed(node.left?.right) ||
        isRed(node.right?.left) ||
        isRed(node.right?.right)
      ) {
        logInvalidNode(option.path);
      }

      option.layoutContainer.left = { node: node.left };
      doLayout({
        ...option,
        width: halfWidth,
        path: option.path.concat(["left"]),
        layoutContainer: option.layoutContainer.left,
      });

      option.layoutContainer.right = { node: node.right };
      doLayout({
        ...option,
        initX: option.initX + halfWidth + diameter,
        width: halfWidth,
        path: option.path.concat(["right"]),
        layoutContainer: option.layoutContainer.right,
      });
    } else if (isRed(node.left)) {
      option.layoutContainer.box = {
        x: option.initX + halfWidth,
        y: option.initY,
        width: diameter,
        height: option.height,
      };

      if (isRed(node.left?.left) || isRed(node.left?.right)) {
        logInvalidNode(option.path);
      }

      option.layoutContainer.left = { node: node.left };
      doLayout({
        ...option,
        width: halfWidth,
        layoutContainer: option.layoutContainer.left,
        path: option.path.concat(["left"]),
      });
      option.layoutContainer.right = { node: node.right };
      doLayout({
        ...option,
        initX: option.initX + halfWidth + diameter,
        initY: option.initY + option.height,
        width: halfWidth,
        path: option.path.concat(["right"]),
        layoutContainer: option.layoutContainer.right,
      });
    } else if (isRed(node.right)) {
      option.layoutContainer.box = {
        x: option.initX + halfWidth,
        y: option.initY,
        width: diameter,
        height: option.height,
      };

      if (isRed(node.right?.left) || isRed(node.right?.left)) {
        logInvalidNode(option.path);
      }

      option.layoutContainer.left = { node: node.left };
      doLayout({
        ...option,
        initY: option.initY + option.height,
        width: halfWidth,
        layoutContainer: option.layoutContainer.left,
        path: option.path.concat(["left"]),
      });

      option.layoutContainer.right = { node: node.right };
      doLayout({
        ...option,
        initX: option.initX + halfWidth + diameter,
        width: halfWidth,
        layoutContainer: option.layoutContainer.right,
        path: option.path.concat(["right"]),
      });
    } else {
      option.layoutContainer.box = {
        x: option.initX,
        y: option.initY,
        width: option.width,
        height: option.height,
      };
      option.layoutContainer.left = { node: node.left };
      doLayout({
        ...option,
        initY: option.initY + option.height,
        width: halfWidth,
        layoutContainer: option.layoutContainer.left,
        path: option.path.concat(["left"]),
      });
      option.layoutContainer.right = { node: node.right };
      doLayout({
        ...option,
        initX: option.initX + halfWidth + diameter,
        initY: option.initY + option.height,
        width: halfWidth,
        layoutContainer: option.layoutContainer.right,
        path: option.path.concat(["right"]),
      });
    }
  }
};

const createLayoutContainer = (
  option: LayoutContainerCreateOptions
): LayoutContainer => {
  const container: LayoutContainer = { node: option.node };
  doLayout({ ...option, path: [], layoutContainer: container });
  return container;
};

const doFlatten = (container: LayoutContainer, flatLayout: FlatLayout) => {
  if (container?.node) {
    flatLayout.vertices.push(container);
    if (container.node.left) {
      flatLayout.edges.push({ from: container, to: container.left });
    }
    if (container.node.right) {
      flatLayout.edges.push({ from: container, to: container.right });
    }
    doFlatten(container.left, flatLayout);
    doFlatten(container.right, flatLayout);
  }
};

const createFlatLayout = (container: LayoutContainer): FlatLayout => {
  const flatLayout: FlatLayout = { vertices: [], edges: [] };
  doFlatten(container, flatLayout);
  return flatLayout;
};

const getCenter = (box: Box): Point => {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

const createGraph = (flatLayout: FlatLayout): Graph => {
  const graph: Graph = { textBoxes: [], connections: [] };

  for (const vertex of flatLayout.vertices) {
    if (vertex?.node && vertex.box) {
      const center = getCenter(vertex.box);
      graph.textBoxes.push({
        ...center,
        text: String(vertex.node.key),
      });
    }
  }

  for (const edge of flatLayout.edges) {
    if (edge.from?.box && edge.to?.box) {
      graph.connections.push({
        from: getCenter(edge.from.box),
        to: getCenter(edge.to.box),
        color: edge.to.node?.isRed ? "red" : "black",
      });
    }
  }

  return graph;
};

export const paint = (
  svgElement: SVGElement,
  node: TreeNode<any, any>,
  width: number,
  height: number,
  fontSizePx: number
): void => {
  let layoutContainer: LayoutContainer;
  let flatLayout: FlatLayout;
  let graph: Graph;

  while (true) {
    layoutContainer = createLayoutContainer({
      node: node,
      initX: 0,
      initY: 0,
      width: width,
      height: height,
      fontSizePx: fontSizePx,
    });
    flatLayout = createFlatLayout(layoutContainer);

    graph = createGraph(flatLayout);

    let boxX = graph.textBoxes.map((tb) => tb.x);
    boxX.sort((a, b) => a - b);
    if (boxX.length < 2) {
      break;
    }

    let boxGaps: number[] = [];
    for (let i = 0; i < boxX.length - 1; ++i) {
      boxGaps.push(boxX[i + 1] - boxX[i]);
    }
    const minBoxGap = Math.min(...boxGaps);

    const requiredMinGap = fontSizePx * 2;

    if (minBoxGap < requiredMinGap) {
      width += 500;
      continue;
    }

    break;
  }

  const maxHeight = Math.max(
    flatLayout.vertices
      .filter((vertex) => !!vertex?.box)
      .map((vertex) => {
        const v = asNonNullable(vertex);
        const box = asNonNullable(v.box);
        return box.y + box.height;
      })
      .reduce((a, b) => (a >= b ? a : b), 0 - Infinity),
    0
  );
  svgElement.setAttribute("height", maxHeight.toString());
  svgElement.setAttribute("width", width.toString());

  const arrowClassName = "arrow";
  const arrowSelector = `.${arrowClassName}`;
  select(svgElement)
    .selectAll(arrowSelector)
    .data(graph.connections)
    .join((enter) =>
      enter
        .append(function (connection: Connection) {
          const arrowElement = window.document.createElementNS(svgNs, "line");
          arrowElement.setAttribute("x1", connection.from.x.toString());
          arrowElement.setAttribute("y1", connection.from.y.toString());
          arrowElement.setAttribute("x2", connection.to.x.toString());
          arrowElement.setAttribute("y2", connection.to.y.toString());
          arrowElement.setAttribute("stroke", connection.color);
          return arrowElement;
        })
        .classed(arrowClassName, true)
    );

  const circleClassName = "circle";
  const circleSelector = `.${circleClassName}`;
  select(svgElement)
    .selectAll(circleSelector)
    .data(graph.textBoxes)
    .join((enter) =>
      enter
        .append(function (tb: TextBox) {
          const circleEle = window.document.createElementNS(svgNs, "circle");
          circleEle.setAttribute("cx", tb.x.toString());
          circleEle.setAttribute("cy", tb.y.toString());
          circleEle.setAttribute("r", fontSizePx.toString());
          circleEle.setAttribute("stroke", "black");
          circleEle.setAttribute("stroke-width", "1");
          circleEle.setAttribute("fill", "#ffffff");
          return circleEle;
        })
        .classed(circleClassName, true)
    );

  const textBoxClassName = "textbox";
  const textBoxSelector = `.${textBoxClassName}`;
  select(svgElement)
    .selectAll(textBoxSelector)
    .data(graph.textBoxes)
    .join((enter) =>
      enter
        .append(function (tb: TextBox) {
          const textElement = window.document.createElementNS(svgNs, "text");
          textElement.setAttribute("x", tb.x.toString());
          textElement.setAttribute("y", tb.y.toString());
          textElement.textContent = tb.text;
          textElement.setAttribute("text-anchor", "middle");
          textElement.setAttribute("alignment-baseline", "central");
          textElement.setAttribute(
            "style",
            `font-size: ${fontSizePx}px; cursor: inherit;`
          );
          return textElement;
        })
        .classed(textBoxSelector, true)
    );
};
