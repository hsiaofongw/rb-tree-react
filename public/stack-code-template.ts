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

const popStack = <T>(stack: Stack<T>): Stack<T> => {
  if (stack) {
    if (stack.size) {
      return {
        storage: stack.storage.filter((_, idx) => idx !== stack.index),
        index: stack.index - 1,
        size: stack.size - 1,
      };
    }
  }

  return stack;
};

const getStackTop = <T>(stack: Stack<T>): T | undefined => {
  if (stack) {
    if (stack.size) {
      return stack.storage[stack.index];
    }
  }
};

// ========
// End basic utils

// Start user codes
// ========

let stack = makeStack<string>();
stack = pushStack(stack, "foo");
stack = pushStack(stack, "bar");
stack = pushStack(stack, "hello, world");
stack = pushStack(stack, "abc");
stack = pushStack(stack, "defg");

stack = popStack(stack);

// ========
// End user codes

export default stack;
