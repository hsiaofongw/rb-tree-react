import { useState } from "react";
import ts from "typescript";
import { TreeNode } from "../rb-tree/types";
import { loadScript } from "../utils/loadScript";

export const useTreeNode = (): [
  TreeNode<string, string>,
  (value: string) => void
] => {
  const [root, setRoot] = useState<TreeNode<string, string>>();
  const setTsContent = (tsContent: string) => {
    if (tsContent) {
      const transpiledCode = ts.transpileModule(tsContent, {
        compilerOptions: { target: ts.ScriptTarget.ESNext },
      });
      if (transpiledCode && transpiledCode.outputText) {
        loadScript(transpiledCode.outputText).then((res) => {
          setRoot(res.default);
        });
        return;
      }
    }
    setRoot(undefined);
  };
  return [root, setTsContent];
};
