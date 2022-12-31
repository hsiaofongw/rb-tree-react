import { TreeNodeT } from "./types";

export const isRed = (node: TreeNodeT): boolean => !!node?.isRed;

export const rotateRight = (root: TreeNodeT): TreeNodeT => {
  if (root?.left) {
    let newRoot = root.left;
    root.left = newRoot.right;
    newRoot.right = root;
    newRoot.isRed = root.isRed;
    root.isRed = true;
    return newRoot;
  }
};

export const rotateLeft = (root: TreeNodeT): TreeNodeT => {
  if (root?.right) {
    let newRoot = root.right;
    root.right = newRoot.left;
    newRoot.left = root;
    newRoot.isRed = root.isRed;
    root.isRed = true;
    return newRoot;
  }
};

export const split = (root: TreeNodeT): TreeNodeT => {
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

export const reconcile = (root: TreeNodeT): TreeNodeT => {
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

export const unSplit = (root: TreeNodeT): TreeNodeT => {
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

export const moveLeftSibilingToRight = (root: TreeNodeT): TreeNodeT => {
  root = unSplit(root);
  root = rotateRight(root);
  root = split(root);
  if (root?.right) {
    root.right = rotateLeft(root.right);
  }
  return root;
};

export const moveRightSibilingToLeft = (root: TreeNodeT): TreeNodeT => {
  if (root) {
    root.right = rotateLeft(root.left);
    root = unSplit(root);
    root = rotateLeft(root);
    root = split(root);
    return root;
  }
};
