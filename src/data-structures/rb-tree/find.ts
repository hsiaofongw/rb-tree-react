import { TreeNode } from "./types";

export const findNode = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>,
  key: KeyT
): TreeNode<KeyT, ValueT> => {
  if (!root) {
    return root;
  }

  if (key < root.key) {
    return findNode(root.left, key);
  } else if (key > root.key) {
    return findNode(root.right, key);
  } else {
    return root;
  }
};

export const getMin = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => (root?.left ? getMin(root?.left) : root);

export const getMax = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => (root?.right ? getMax(root?.right) : root);
