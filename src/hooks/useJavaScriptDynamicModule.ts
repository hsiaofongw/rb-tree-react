import { useState } from "react";
import ts from "typescript";
import { loadScript } from "../utils/loadScript";

export const useJavaScriptDynamicModule = <T extends any>(): {
  defaultExport: T | undefined;
  setTypeScriptCode: (value: string) => void;
  isLoading: boolean;
} => {
  const [root, setRoot] = useState<T>();
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

  return {
    defaultExport: root,
    setTypeScriptCode: setTsContent,
    isLoading: !!isLoading,
  };
};
