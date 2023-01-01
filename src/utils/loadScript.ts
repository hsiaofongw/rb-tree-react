export const loadScript = (fileContent: string) => {
  const fileName = "editorContent.js";
  const fileObject = new File([fileContent], fileName, {
    type: "text/javascript",
  });
  const moduleUrl = URL.createObjectURL(fileObject);
  // see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  return import(/* webpackIgnore: true */ moduleUrl);
};
