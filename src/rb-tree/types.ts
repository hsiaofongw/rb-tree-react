export type TreeNode<KeyT, ValueT> =
  | {
      isRed: boolean;
      left?: TreeNode<KeyT, ValueT>;
      right?: TreeNode<KeyT, ValueT>;
      key: KeyT;
      value: ValueT;
    }
  | null
  | undefined;

export type NodeToNode<KeyT, ValueT> = {
  (node: TreeNode<KeyT, ValueT>): TreeNode<KeyT, ValueT>;
};

export type NodeAndKeyToNode<KeyT, ValueT> = {
  (node: TreeNode<KeyT, ValueT>, key: KeyT): TreeNode<KeyT, ValueT>;
};

export type NodeAndKeyAndValueToNode<KeyT, ValueT> = {
  (node: TreeNode<KeyT, ValueT>, key: KeyT, value: ValueT): TreeNode<
    KeyT,
    ValueT
  >;
};

export type KeyAndValueToNode<KeyT, ValueT> = {
  (key: KeyT, value: ValueT): TreeNode<KeyT, ValueT>;
};
