import { GridPathfinder } from "@/utils/routeCalculation";
import { useEffect } from "react";

export default function AboutPage() {

  useEffect(() => {
    const pathfinder = new GridPathfinder(3, 3); // set grid size

    // Add obstacles from the image
    pathfinder.addObstacle(2, 1);
 

    try {
      // Find path from bottom-left to top-right
      const path = pathfinder.findPath(0, 0, 2, 2);
      console.log("Path:", path);
    } catch (error) {
      console.error("Error finding path :", error);
    }
  }, []);

  return (
    <div className=" mt-16">This page use o log to test the pathfinding algorithm
    </div>
  )
}
