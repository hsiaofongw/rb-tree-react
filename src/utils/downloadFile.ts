export const downloadFile = (content: string, name: string): void => {
  const anchorEle = window.document.createElement("a");
  const fileObject = new File([content], name);
  const svgFileUrl = URL.createObjectURL(fileObject);
  anchorEle.href = svgFileUrl;
  anchorEle.download = name;
  anchorEle.click();
};

export const getEscapedTimestamp = () => {
  return new Date().toLocaleString().replace(" ", "-");
};
