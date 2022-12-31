import { TreeNode } from "./types";
import { reconcile } from "./utils";

export const makeNode = <KeyT, ValueT>(
  key: KeyT,
  value: ValueT
): TreeNode<KeyT, ValueT> => ({
  isRed: true,
  key,
  value,
});

export const insertPair = <KeyT, ValueT>(
  node: TreeNode<KeyT, ValueT>,
  key: KeyT,
  value: ValueT
): TreeNode<KeyT, ValueT> => {
  if (!node) {
    return makeNode(key, value);
  }
  if (key < node.key) {
    node.left = insertPair(node.left, key, value);
  } else if (key > node.key) {
    node.right = insertPair(node.right, key, value);
  } else {
    node.value = value;
  }

  return reconcile(node);
};
