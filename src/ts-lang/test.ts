import ts from "typescript";

const file = "a";
let program = ts.createProgram([file], { allowJs: true });
const sourceFile = program.getSourceFile(file);

ts.forEachChild(sourceFile as any, (node) => {
  if (ts.isTypeLiteralNode(node)) {
    node.members.forEach((member) => {
      member.name?.getText();
    });
  }
});

type A = ts.TypeLiteralNode;
