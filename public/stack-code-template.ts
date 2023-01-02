// Start type definitions
// ========
export type Stack<DataT> =
  | {
      storage: DataT[];
      index: number;
      size: number;
    }
  | null
  | undefined;
// ========
// End type definitions

// Start basic utils
// ========
const makeStack = <T>(): Stack<T> => {
  return { storage: [], index: -1, size: 0 };
};

const pushStack = <T>(stack: Stack<T>, item: NonNullable<T>): Stack<T> => {
  if (stack) {
    return {
      storage: stack.storage.concat([item]),
      index: stack.index + 1,
      size: stack.size + 1,
    };
  }
  return stack;
};

const popStack = <T>(stack: Stack<T>): [Stack<T>, T | undefined] => {
  if (stack) {
    if (stack.size) {
      return [
        {
          storage: stack.storage.filter((_, idx) => idx !== stack.index),
          index: stack.index - 1,
          size: stack.size - 1,
        },
        stack.storage[stack.index],
      ] as [Stack<T>, T | undefined];
    }
  }
  return [stack, undefined];
};
// ========
// End basic utils

// Start user codes
// ========

let rsp0 = makeStack<string>();
let rsp1 = pushStack(rsp0, "a");
let rsp2 = pushStack(rsp1, "b");
let rsp3 = pushStack(rsp2, "c");

let [rsp4, _] = popStack(rsp3);

let stack = rsp4;

// ========
// End user codes

export default stack;
