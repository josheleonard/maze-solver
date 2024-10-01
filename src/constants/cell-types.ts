export const CELL_TYPES = {
  WALL: 1,
  PATH: 0,
  START: 2,
  END: 3,
  VISITED: 4,
  SOLUTION: 5,
} as const;

export type CellType = (typeof CELL_TYPES)[keyof typeof CELL_TYPES];
