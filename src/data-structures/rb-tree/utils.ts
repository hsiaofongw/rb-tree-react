import { TreeNode } from "./types";

export const isRed = <KeyT, ValueT>(node: TreeNode<KeyT, ValueT>): boolean =>
  !!node?.isRed;

export const rotateRight = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (root?.left) {
    let newRoot = root.left;
    root.left = newRoot.right;
    newRoot.right = root;
    newRoot.isRed = root.isRed;
    root.isRed = true;
    return newRoot;
  }
};

export const rotateLeft = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (root?.right) {
    let newRoot = root.right;
    root.right = newRoot.left;
    newRoot.left = root;
    newRoot.isRed = root.isRed;
    root.isRed = true;
    return newRoot;
  }
};

export const split = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (root) {
    root.isRed = true;
    if (root.left) {
      root.left.isRed = false;
    }
    if (root.right) {
      root.right.isRed = false;
    }
    return root;
  }
};

export const reconcile = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (!isRed(root?.left) && isRed(root?.right)) {
    root = rotateLeft(root);
  }
  if (isRed(root?.left) && isRed(root?.left?.left)) {
    root = rotateRight(root);
  }
  if (isRed(root?.left) && isRed(root?.right)) {
    root = split(root);
  }

  return root;
};

export const unSplit = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (root) {
    root.isRed = false;
    if (root.left) {
      root.left.isRed = true;
    }
    if (root.right) {
      root.right.isRed = true;
    }
    return root;
  }
};

export const moveLeftSibilingToRight = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  root = unSplit(root);
  root = rotateRight(root);
  root = split(root);
  if (root?.right) {
    root.right = rotateLeft(root.right);
  }
  return root;
};

export const moveRightSibilingToLeft = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (root) {
    root.right = rotateLeft(root.left);
    root = unSplit(root);
    root = rotateLeft(root);
    root = split(root);
    return root;
  }
};
