import { NodeToNode, TreeNode } from "./types";
import {
  isRed,
  moveLeftSibilingToRight,
  moveRightSibilingToLeft,
  reconcile,
  rotateRight,
  unSplit,
} from "./utils";

export const deleteMin = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  const deleteLeft = (root: TreeNode<KeyT, ValueT>) => {
    if (root?.left) {
      root.left = deleteMin(root.left);
      return reconcile(root);
    }
  };

  if (root?.left) {
    if (isRed(root.left) || isRed(root.left?.left)) {
      return deleteLeft(root);
    }

    if (isRed(root.right?.left)) {
      return deleteLeft(moveRightSibilingToLeft(root));
    }

    return deleteLeft(unSplit(root));
  }
};

export const deleteMax = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  const deleteRight: NodeToNode<KeyT, ValueT> = (root) => {
    if (root?.right) {
      root.right = deleteMax(root.right);
      return reconcile(root);
    }
  };

  if (root?.right) {
    if (isRed(root?.right) || isRed(root?.right?.left)) {
      return deleteRight(root);
    }

    if (isRed(root?.left)) {
      return deleteRight(rotateRight(root));
    }

    if (isRed(root?.left?.left)) {
      return deleteRight(moveLeftSibilingToRight(root));
    }

    return deleteRight(unSplit(root));
  }
};
