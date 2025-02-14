import { GridPathfinder } from "@/utils/routeCalculation";

export default function Temporary() {
  const pathfinder = new GridPathfinder(10, 10); // set grid size

  // Add obstacles from the image
  pathfinder.addObstacle(0, 0);
  pathfinder.addObstacle(5, 0);
  pathfinder.addObstacle(8, 0);

  try {
    // Find path from bottom-left to top-right
    const path = pathfinder.findPath(0, 9, 9, 0);
    console.log("Path:", path);
  } catch (error) {
    console.error("Error finding path:", error);
  }

  return <div>Temporary</div>;
}
