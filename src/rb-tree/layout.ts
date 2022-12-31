import { TreeNode } from "./types";
import { isRed } from "./utils";

export type Box = {
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

const logInvalidNode = (path?: Direction[]) => {
  console.error("Invalid node, path is:", path);
  throw new Error("Invalid node");
};

/** 布局算法确定每一个节点的坐标 */
export const doLayout = (
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
        width / 2,
        height,
        rowGap,
        layoutContainer.left,
        path.concat(["left"])
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
        initY,
        width / 2,
        height + rowGap,
        rowGap,
        layoutContainer.left,
        path.concat(["left"])
      );
      layoutContainer.right = { node: node.right };
      doLayout(
        initX + width / 2,
        initY,
        width / 2,
        height + rowGap,
        rowGap,
        layoutContainer.right,
        path.concat(["right"])
      );
    }
  }
};

export const layout = (
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
