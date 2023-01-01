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

const root: TreeNode<string, string> = {
  isRed: false,
  key: "c",
  value: "",
  left: {
    isRed: true,
    key: "b",
    value: "",
  },
  right: {
    isRed: false,
    key: "d",
    value: "",
  },
};

export default root;
