import { TreeNode } from "./types";

export const findNodeByKey = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>,
  key: KeyT
): TreeNode<KeyT, ValueT> => {
  if (!root) {
    return root;
  }

  if (key < root.key) {
    return findNodeByKey(root.left, key);
  } else if (key > root.key) {
    return findNodeByKey(root.right, key);
  } else {
    return root;
  }
};

export const getMin = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => (root?.left ? getMin(root?.left) : root);
