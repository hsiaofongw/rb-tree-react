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

const root: TreeNode<string, string> = {
  isRed: false,
  key: "d",
  left: {
    isRed: true,
    key: "b",
    left: {
      isRed: false,
      key: "a",
    },
    right: {
      isRed: false,
      key: "c",
    },
  },
  right: {
    isRed: false,
    key: "f",
    left: {
      key: "e",
      isRed: true,
    },
  },
};

export default root;
