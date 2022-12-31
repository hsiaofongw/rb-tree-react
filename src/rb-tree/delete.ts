import { TreeNode } from "./types";
import { isRed, moveRightSibilingToLeft, reconcile, unSplit } from "./utils";

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
