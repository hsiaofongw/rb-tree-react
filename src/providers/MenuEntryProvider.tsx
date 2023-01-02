import React from "react";
import { MenuEntry } from "../types";

export const MenuEntryContext = React.createContext<MenuEntry[][]>([]);
