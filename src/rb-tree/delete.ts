import { getMax, getMin } from "./find";
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

const getSuccessorLeft = <KeyT, ValueT>(
  root: NonNullable<TreeNode<KeyT, ValueT>>
): TreeNode<KeyT, ValueT> => {
  const lhsMax = getMax(root.left) as NonNullable<typeof root>;
  lhsMax.left = deleteMax(root.left);
  lhsMax.right = root.right;
  lhsMax.isRed = root.isRed;
  return reconcile(lhsMax);
};

const getSuccessorRight = <KeyT, ValueT>(
  root: NonNullable<TreeNode<KeyT, ValueT>>
): TreeNode<KeyT, ValueT> => {
  const rhsMin = getMin(root.right) as NonNullable<typeof root>;
  rhsMin.right = deleteMin(root.right);
  rhsMin.left = root.left;
  rhsMin.isRed = root.isRed;
  return reconcile(rhsMin);
};

export const deleteRootNode = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (root?.left && root?.right) {
    if (isRed(root.left)) {
      return getSuccessorLeft(root);
    } else if (isRed(root.right)) {
      return getSuccessorRight(root);
    } else if (isRed(root.left.left)) {
      return getSuccessorLeft(root);
    } else if (isRed(root.right.left)) {
      return getSuccessorRight(root);
    } else {
      return getSuccessorLeft(unSplit(root) as any);
    }
  } else if (root?.left) {
    root.left.isRed = root.isRed;
    return root.left;
  } else if (root?.right) {
    root.right.isRed = root.isRed;
    return root.right;
  }
};
