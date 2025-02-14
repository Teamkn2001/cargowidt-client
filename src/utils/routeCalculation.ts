interface Point {
  x: number;
  y: number;
}

interface PathNode extends Point {
  cost: number; // g-score (cost from start)
  heuristic: number; // h-score (estimated cost to goal)
  f: number; // f-score (total estimated cost)
  parent: PathNode | null;
}

type GridPosition = `${number},${number}`;

class Node implements PathNode {
  public readonly x: number;
  public readonly y: number;
  public cost: number;
  public readonly heuristic: number;
  public f: number;
  public parent: PathNode | null;

  constructor(x: number, y: number, cost: number, heuristic: number) {
    this.x = x;
    this.y = y;
    this.cost = cost;
    this.heuristic = heuristic;
    this.f = cost + heuristic;
    this.parent = null;
  }
}

// A* pathfinding implementation for a 2D grid
export class GridPathfinder {
  private readonly width: number;
  private readonly height: number;
  private readonly obstacles: Set<GridPosition>;
  /**
   * Creates a new pathfinder instance
   * @param width - Grid width
   * @param height - Grid height
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.obstacles = new Set();
  }
  /**
   * Adds an obstacle at the specified coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  public addObstacle(x: number, y: number): void {
    this.obstacles.add(`${x},${y}`);
    // console.log("obstacles", this.obstacles);
  }
  
  // Removes all obstacles from the grid
  public clearObstacles(): void {
    this.obstacles.clear();
  }

  // Calculates the Manhattan distance between two points ===> get the closest distance
  // heuristic (h) = |x1 - x2| + |y1 - y2| or |dx| + |dy|
  private heuristic(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  // Gets neighboring position moving in 4 directions (up, down, left, right)
  private getNeighbors(x: number, y: number): Point[] {
    const neighbors: Point[] = []; // create empty array to store the neighbors

    // [number, number][] is like array [0, 1] and can have multiple in array [] || array of arrays(number, number)
    // >> [ [number, number], [number, number], [number, number], [number, number] ... ]
    const directions: [number, number][] = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0], // up
    ];

    for (const [dx, dy] of directions) {  
      const newX = x + dx;
      const newY = y + dy;

      // Check if within grid bounds and not an obstacle
      if (
        this.isValidPosition(newX, newY) &&
        !this.obstacles.has(`${newX},${newY}`)
      ) {
        neighbors.push({ x: newX, y: newY });
      }
    }

    return neighbors;
  }

  // Checks if a position is within grid bounds
  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Finds the shortest path between two points
   * @param startX - Starting X coordinate
   * @param startY - Starting Y coordinate
   * @param goalX - Goal X coordinate
   * @param goalY - Goal Y coordinate
   * @returns Array of coordinates representing the path, or null if no path exists
   */
  public findPath(
    startX: number,
    startY: number,
    goalX: number,
    goalY: number
  ): Point[] | null {
    // Validate input coordinates
    if (
      !this.isValidPosition(startX, startY) ||
      !this.isValidPosition(goalX, goalY)
    ) {
      throw new Error("Invalid start or goal position");
    }

    const openSet = new Set<PathNode>();
    const closedSet = new Set<GridPosition>();
    const startNode = new Node(
      startX,
      startY,
      0,
      this.heuristic(startX, startY, goalX, goalY)
    );

    openSet.add(startNode);
    const nodeMap = new Map<GridPosition, PathNode>();
    nodeMap.set(`${startX},${startY}`, startNode);

    while (openSet.size > 0) {
      // Find node with lowest f-score
      const current = Array.from(openSet).reduce((a, b) => (a.f < b.f ? a : b));

      // Check if we reached the goal
      if (current.x === goalX && current.y === goalY) {
        return this.reconstructPath(current);
      }

      openSet.delete(current);
      closedSet.add(`${current.x},${current.y}`);

      // Check all neighbors
      for (const neighbor of this.getNeighbors(current.x, current.y)) {
        const neighborKey: GridPosition = `${neighbor.x},${neighbor.y}`;

        if (closedSet.has(neighborKey)) {
          continue;
        }

        const tentativeCost = current.cost + 1;
        let neighborNode = nodeMap.get(neighborKey);

        if (!neighborNode) {
          neighborNode = new Node(
            neighbor.x,
            neighbor.y,
            tentativeCost,
            this.heuristic(neighbor.x, neighbor.y, goalX, goalY)
          );
          nodeMap.set(neighborKey, neighborNode);
          openSet.add(neighborNode);
        } else if (tentativeCost >= neighborNode.cost) {
          continue;
        }

        // This path is better, record it
        neighborNode.parent = current;
        neighborNode.cost = tentativeCost;
        neighborNode.f = neighborNode.cost + neighborNode.heuristic;
      }
    }
    // No path found
    return null;
  }

  // Reconstructs the path from the goal node back to the start
  private reconstructPath(goalNode: PathNode): Point[] {
    const path: Point[] = [];
    let current: PathNode | null = goalNode;

    while (current !== null) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }

    return path;
  }
}






// -------------------------------------Example usage:
// const pathfinder = new GridPathfinder(10, 10); // set grid size

// // Add obstacles from the image
// pathfinder.addObstacle(0, 0);
// pathfinder.addObstacle(5, 0);
// pathfinder.addObstacle(8, 0);

// try {
//     // Find path from bottom-left to top-right
//     const path = pathfinder.findPath(0, 9, 9, 0);
//     console.log("Path:", path);
// } catch (error) {
//     console.error("Error finding path:", error);
// }
