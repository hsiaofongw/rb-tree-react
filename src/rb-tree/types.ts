export type Node<T> =
  | {
      isRed: boolean;
      left: Node<T>;
      right: Node<T>;
      key: T;
    }
  | null
  | undefined;

/** 红黑树的一些操作不需要知道 key 是什么类型 */
export type NodeT = Node<unknown>;
