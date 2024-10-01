import { useState } from "react";

// constants
import { CELL_TYPES, CellType } from "../../constants/cell-types";
import { INITIAL_MAZE, MAZE_END, MAZE_START } from "../../constants/maze";
import { DIRECTIONS } from "../../constants/movement-directions";
import { CELL_COLORS } from "../../constants/colors";

// utils
import { sleep } from "../../utils/sleep";

// styles
import "./maze-solver.css";

const getPath = (parent: Map<string, number[]>, end: number[]): number[][] => {
  const path: number[][] = [];
  let current: number[] | undefined = end;
  while (current) {
    path.unshift(current);
    const [y, x] = current;
    const key = `${x},${y}`;
    current = parent.get(key);
  }
  return path;
};

export function MazeSolver() {
  // state
  const [maze, setMaze] = useState(INITIAL_MAZE);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  // methods
  const searchMaze = async (
    maze: number[][],
    start: number[],
    end: number[]
  ): Promise<number[][] | null> => {
    const [startY, startX] = start;
    const [endY, endX] = end;
    const stack: number[][] = [[startY, startX]];
    const visited: Set<string> = new Set();
    const parent: Map<string, number[]> = new Map();

    while (stack.length > 0) {
      const [y, x] = stack.pop()!;
      const key = `${x},${y}`;

      // found the end
      if (x === endX && y === endY) {
        return getPath(parent, end);
      }

      // cell not visited
      if (!visited.has(key)) {
        // mark the cell as visited if it not the start or end
        visited.add(key);
        if (maze[y][x] !== CELL_TYPES.START && maze[y][x] !== CELL_TYPES.END) {
          maze[y][x] = CELL_TYPES.VISITED;
          setMaze([...maze]);
          await sleep(100);
        }

        // check all movement directions
        for (const [dx, dy] of DIRECTIONS) {
          const newX = x + dx;
          const newY = y + dy;
          if (
            // can we move in this direction?
            newX >= 0 &&
            newX < maze[0].length &&
            newY >= 0 &&
            newY < maze.length &&
            maze[newY][newX] !== CELL_TYPES.WALL &&
            // have we not visited this cell before?
            !visited.has(`${newX},${newY}`)
          ) {
            stack.push([newY, newX]);
            parent.set(`${newX},${newY}`, [y, x]);
          }
        }
      }
    }

    return null;
  };

  const solveMaze = async () => {
    setIsSolving(true);
    setIsSolved(false);
    const newMaze = maze.map((row) => [...row]);

    const solutionPath = await searchMaze(newMaze, MAZE_START, MAZE_END);

    // found a solution
    if (solutionPath) {
      // draw the solution path
      for (const [y, x] of solutionPath) {
        // don't update the start and end cells
        if (
          newMaze[y][x] !== CELL_TYPES.START &&
          newMaze[y][x] !== CELL_TYPES.END
        ) {
          newMaze[y][x] = CELL_TYPES.SOLUTION;
          setMaze([...newMaze]);
          await sleep(100);
        }
      }
      setIsSolved(true);
    }

    setIsSolving(false);
  };

  const resetMaze = () => {
    setMaze(INITIAL_MAZE);
    setIsSolved(false);
  };

  // render
  return (
    <div className="maze-solver">
      <h1 className="title">Maze Solver</h1>
      <div className="actions">
        <button onClick={solveMaze} disabled={isSolving || isSolved}>
          {isSolving ? "Solving..." : "Solve"}
        </button>
        <button onClick={resetMaze} disabled={isSolving}>
          Reset
        </button>
      </div>
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="maze-row">
            {row.map((cell, cellIndex) => (
              <div
                key={`cell-${rowIndex}-${cellIndex}`}
                style={{ backgroundColor: CELL_COLORS[cell as CellType] }}
                className="maze-cell"
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="results-container">
        {isSolved && <p className="success-text">Solved!</p>}
      </div>
    </div>
  );
}
