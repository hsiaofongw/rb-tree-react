export const useRevealLineIdx = (
  targetLinePrefix: string,
  textContent: string
) => {
  const lines = textContent.split("\n");
  let revealLine: undefined | number;
  for (let lineIdx = 0; lineIdx < lines.length; ++lineIdx) {
    const line = lines[lineIdx];
    if (line.indexOf(targetLinePrefix) === 0) {
      revealLine = lineIdx + 1;
      break;
    }
  }
  return { revealLine };
};
