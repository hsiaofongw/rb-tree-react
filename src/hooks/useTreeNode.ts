import { useState } from "react";
import ts from "typescript";
import { TreeNode } from "../rb-tree/types";
import { loadScript } from "../utils/loadScript";

export const useTreeNode = (): {
  root: TreeNode<string, string>;
  setTsContent: (value: string) => void;
  isLoading: boolean;
} => {
  const [root, setRoot] = useState<TreeNode<string, string>>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const setTsContent = (tsContent: string) => {
    setIsLoading(true);
    if (tsContent) {
      const transpiledCode = ts.transpileModule(tsContent, {
        compilerOptions: { target: ts.ScriptTarget.ESNext },
      });
      if (transpiledCode && transpiledCode.outputText) {
        loadScript(transpiledCode.outputText)
          .then((res) => {
            setRoot(res.default);
          })
          .finally(() => {
            setIsLoading(false);
          });
        return;
      }
    }
    setRoot(undefined);
    setIsLoading(false);
  };
  return { root, setTsContent, isLoading: !!isLoading };
};
