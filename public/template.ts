// Start type definitions
// ========
export type TreeNode<KeyT, ValueT> =
  | {
      isRed: boolean;
      left?: TreeNode<KeyT, ValueT>;
      right?: TreeNode<KeyT, ValueT>;
      key: KeyT;
      value?: ValueT;
    }
  | null
  | undefined;
// ========
// End type definitions

// Start basic utils
// ========
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
    root.right = rotateRight(root.right);
    root = unSplit(root);
    root = rotateLeft(root);
    root = split(root);
    return root;
  }
};
// ========
// End basic utils

// Start insert functions
// ========
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
// ========
// End insert functions

// Start search functions
// ========

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

// ========
// End search functions

// Start deletion functions
// ========

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

const deleteRight = <KeyT, ValueT>(root: TreeNode<KeyT, ValueT>) => {
  if (root?.right) {
    root.right = deleteMax(root.right);
    return reconcile(root);
  }
};

export const deleteMax = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>
): TreeNode<KeyT, ValueT> => {
  if (root?.right) {
    if (isRed(root?.right) || isRed(root?.right?.left)) {
      return deleteRight(root);
    }

    if (isRed(root?.left)) {
      return deleteMax(rotateRight(root));
    }

    if (isRed(root?.left?.left)) {
      return deleteRight(moveLeftSibilingToRight(root));
    }

    return deleteRight(unSplit(root));
  } else if (root?.left) {
    root.left.isRed = false;
    return root.left;
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

export const deleteNode = <KeyT, ValueT>(
  root: TreeNode<KeyT, ValueT>,
  key: KeyT
): TreeNode<KeyT, ValueT> => {
  if (root) {
    if (key < root.key) {
      const goLeft = (node: TreeNode<KeyT, ValueT>) => {
        if (node) {
          node.left = deleteNode(node.left, key);
          return reconcile(node);
        }
      };

      if (isRed(root.left) || isRed(root.left?.left)) {
        return goLeft(root);
      }

      if (isRed(root.right?.left)) {
        return goLeft(moveRightSibilingToLeft(root));
      }

      return goLeft(unSplit(root));
    } else if (key > root.key) {
      const goRight = (node: TreeNode<KeyT, ValueT>) => {
        if (node) {
          node.right = deleteNode(node.right, key);
          return reconcile(node);
        }
      };

      if (isRed(root.right) || isRed(root.right?.left)) {
        return goRight(root);
      }

      if (isRed(root.left)) {
        return goRight(rotateRight(root));
      }

      if (isRed(root.left?.left)) {
        return goRight(moveLeftSibilingToRight(root));
      }

      return goRight(unSplit(root));
    } else {
      return deleteRootNode(root);
    }
  }
};

// ========
// End deletion functions

// Start user codes
// ========

let root: TreeNode<string, string> = {
  isRed: false,
  key: "c",
  left: {
    isRed: false,
    key: "b",
    left: {
      isRed: true,
      key: "a",
    },
  },
  right: {
    isRed: false,
    key: "d",
  },
};

// ========
// End user codes

export default root;
