import { TreeNode } from "./types";
import { isRed } from "./utils";
import { select } from "d3";
import { svgNs } from "../resources/namespaces";

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

/** 布局算法确定每一个节点的坐标 */
const doLayout = (
  initX: number,
  initY: number,
  width: number,
  height: number,
  rowGap: number,
  layoutContainer: LayoutContainer,
  path: Direction[]
): void => {
  if (layoutContainer?.node) {
    const node = layoutContainer.node;
    if (isRed(node.left) && isRed(node.right)) {
      layoutContainer.box = {
        x: initX + width / 3,
        y: initY,
        width: width / 3,
        height: height,
      };

      if (
        isRed(node.left?.left) ||
        isRed(node.left?.right) ||
        isRed(node.right?.left) ||
        isRed(node.right?.right)
      ) {
        logInvalidNode(path);
      }

      layoutContainer.left = { node: node.left };
      doLayout(
        initX,
        initY,
        width / 3,
        height,
        rowGap,
        layoutContainer.left,
        path.concat(["left"])
      );

      layoutContainer.right = { node: node.right };
      doLayout(
        initX + (2 * width) / 3,
        initY,
        width / 3,
        height,
        rowGap,
        layoutContainer.right,
        path.concat(["right"])
      );
    } else if (isRed(node.left)) {
      layoutContainer.box = {
        x: initX + width / 2,
        y: initY,
        width: width / 2,
        height: height,
      };

      if (isRed(node.left?.left) || isRed(node.left?.right)) {
        logInvalidNode(path);
      }

      layoutContainer.left = { node: node.left };
      doLayout(
        initX,
        initY,
        width / 2 + width / 4,
        height,
        rowGap,
        layoutContainer.left,
        path.concat(["left"])
      );
      layoutContainer.right = { node: node.right };
      doLayout(
        initX + width / 2 + width / 4,
        initY + rowGap,
        width / 2,
        height,
        rowGap,
        layoutContainer.right,
        path.concat(["right"])
      );
    } else if (isRed(node.right)) {
      layoutContainer.box = {
        x: initX,
        y: initY,
        width: width / 2,
        height: height,
      };

      if (isRed(node.right?.left) || isRed(node.right?.left)) {
        logInvalidNode(path);
      }

      layoutContainer.left = { node: node.left };
      doLayout(
        initX,
        initY + rowGap,
        width / 2,
        height,
        rowGap,
        layoutContainer.left,
        path.concat(["left"])
      );

      layoutContainer.right = { node: node.right };
      doLayout(
        initX + width / 2,
        initY,
        width / 2,
        height,
        rowGap,
        layoutContainer.right,
        path.concat(["right"])
      );
    } else {
      layoutContainer.box = { x: initX, y: initY, width, height };
      layoutContainer.left = { node: node.left };
      doLayout(
        initX,
        initY + rowGap,
        width / 2,
        height,
        rowGap,
        layoutContainer.left,
        path.concat(["left"])
      );
      layoutContainer.right = { node: node.right };
      doLayout(
        initX + width / 2,
        initY + rowGap,
        width / 2,
        height,
        rowGap,
        layoutContainer.right,
        path.concat(["right"])
      );
    }
  }
};

const createLayoutContainer = (
  node: TreeNode<any, any>,
  initX: number,
  initY: number,
  width: number,
  height: number,
  rowGap: number
): LayoutContainer => {
  const container: LayoutContainer = { node };
  doLayout(initX, initY, width, height, rowGap, container, []);
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
  rowGap: number,
  fontSizePx: number
): void => {
  const layoutContainer = createLayoutContainer(
    node,
    0,
    0,
    width,
    height,
    rowGap
  );

  const flatLayout = createFlatLayout(layoutContainer);

  const graph = createGraph(flatLayout);

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
          circleEle.setAttribute("stroke", "none");
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
