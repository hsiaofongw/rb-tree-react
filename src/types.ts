import { Path } from "react-router-dom";

export type MenuEntry = {
  text: string;
  icon: React.ReactNode;
  to: string | Partial<Path>;
  target?: string;
};
