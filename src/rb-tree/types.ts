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

/** 红黑树的一些操作不需要知道 key 是什么类型 */
export type TreeNodeT = TreeNode<any, any>;
