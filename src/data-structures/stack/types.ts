export type Stack<DataT> =
  | {
      storage: DataT[];
      index: number;
      size: number;
    }
  | null
  | undefined;
