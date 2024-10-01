import { CELL_TYPES } from "./cell-types";

export const CELL_COLORS = {
  [CELL_TYPES.END]: "red",
  [CELL_TYPES.PATH]: "white",
  [CELL_TYPES.SOLUTION]: "yellow",
  [CELL_TYPES.START]: "green",
  [CELL_TYPES.VISITED]: "lightblue",
  [CELL_TYPES.WALL]: "black",
} as const;
