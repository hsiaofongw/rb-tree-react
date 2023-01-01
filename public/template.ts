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
  key: "d",
  value: "",
  left: {
    isRed: true,
    key: "b",
    value: "",
    left: {
      isRed: false,
      key: "a",
      value: "",
    },
    right: {
      isRed: false,
      key: "c",
      value: "",
    },
  },
  right: {
    isRed: false,
    key: "f",
    value: "",
    left: {
      key: "e",
      value: "",
      isRed: true,
    },
  },
};

export default root;
