import React, { useState } from "react";
import { Forklift, Grid, Package2, Truck, Warehouse, X } from "lucide-react";
import { Position, GridSize, Item, ItemType, ToolType } from "../../types";

const WarehousePlanner: React.FC = () => {
  const [tileSize, setTileSize] = useState<number>(1);
  const [gridSize, setGridSize] = useState<GridSize>({ width: 10, height: 10 });
  const [selectedTool, setSelectedTool] = useState<ToolType>("shelf");
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const itemTypes: Record<ToolType, ItemType> = {
    shelf: { width: 1, height: 1, color: "bg-blue-500", icon: Package2 },
    forklift: { width: 1, height: 1, color: "bg-yellow-500", icon: Forklift},
  };

  const checkOverlap = (item1: Item, item2: Item): boolean => {
    return !(
      item1.x + item1.width <= item2.x ||
      item1.x >= item2.x + item2.width ||
      item1.y + item1.height <= item2.y ||
      item1.y >= item2.y + item2.height
    );
  };

  const isValidPosition = (newItem: Item): boolean => {
    if (
      newItem.x + newItem.width > gridSize.width ||
      newItem.y + newItem.height > gridSize.height ||
      newItem.x < 0 ||
      newItem.y < 0
    ) {
      setError("Item would be outside the grid!");
      return false;
    }

    for (const existingItem of items) {
      if (checkOverlap(newItem, existingItem)) {
        setError("Items cannot overlap!");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const calculateDistance = (item1: Item, item2: Item): number => {
    // Find the edges of each item
    const item1Right = item1.x + item1.width;
    const item1Bottom = item1.y + item1.height;
    const item2Right = item2.x + item2.width;
    const item2Bottom = item2.y + item2.height;

    // Calculate horizontal distance
    let dx = 0;
    if (item1Right <= item2.x) {
      // item1 is to the left of item2
      dx = item2.x - item1Right;
    } else if (item2Right <= item1.x) {
      // item1 is to the right of item2
      dx = item1.x - item2Right;
    }

    // Calculate vertical distance
    let dy = 0;
    if (item1Bottom <= item2.y) {
      // item1 is above item2
      dy = item2.y - item1Bottom;
    } else if (item2Bottom <= item1.y) {
      // item1 is below item2
      dy = item1.y - item2Bottom;
    }

    // Total distance is the sum of horizontal and vertical gaps
    return Math.round((dx + dy) * tileSize * 100) / 100;
  };

  const handleTileClick = (x: number, y: number): void => {
    console.log("get x and y =", x, y);
    if (selectedTool) {
      console.log(selectedTool);
      const typeInfo = itemTypes[selectedTool];
      console.log(typeInfo);
      const newItem: Item = {
        id: Date.now(),
        type: selectedTool,
        x,
        y,
        ...typeInfo,
      };
      console.log("newItem to add :", newItem);

      if (isValidPosition(newItem)) {
        setItems([...items, newItem]);
        setSelectedItem(null);
        setDistance(null);
      }
    }
  };

  const handleItemClick = (clickedItem: Item, e: React.MouseEvent): void => {
    e.stopPropagation();
    console.log("clicked at item", clickedItem);
    if (selectedItem) {
      if (selectedItem.id !== clickedItem.id) {
        const dist = calculateDistance(selectedItem, clickedItem);
        setDistance(dist);
        setSelectedItem(null);
      } else {
        setSelectedItem(null);
        setDistance(null);
      }
    } else {
      setSelectedItem(clickedItem);
      setDistance(null);
    }
    setError(null);
  };

  const handleDeleteItem = (itemId: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    console.log("delete item clicked on item =", itemId);
    setItems(items.filter((item) => item.id !== itemId)); // remove item from items array (filter what is not the Id)
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
      setDistance(null);
    }
  };

  return (
    <div className="flex flex-col items-center mx-2 lg:mx-0">
      <div className="flex flex-col lg:flex-row items-center gap-5 p-4 mb-4  ">
        <div className="">
          <Warehouse />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tile Size (meters)
          </label>
          <input
            type="number"
            value={tileSize}
            onChange={(e) => setTileSize(Number(e.target.value))}
            className="border rounded p-1"
            min="0.1"
            step="0.1"
          />
        </div>

        <div className="flex flex-col lg:block w-full">
          <label className="block text-sm font-medium mb-1 ">Tool</label>
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value as ToolType)}
            className="border rounded p-1 flex-grow w-full"
          >
            <option value="shelf">Shelf (1x1)</option>
            <option value="forklift">Forklift (1x1)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {distance !== null && (
        <div className="mb-4 p-2 bg-blue-100 rounded">
          Distance between items: {distance} meters
        </div>
      )}

      {/* this is main grid */}
      <div
        className="relative w-full bg-pink-300" //make square container size 600 px
        style={{ aspectRatio: "1/1", maxWidth: "600px" }}
      >
        <div
          className="grid absolute inset-0 border border-gray-300  bg-green-300" // fill square container with grid
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`, // 1fr = each cell takes equal space
            gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
          }} // create grid with gridTemplateColumns x gridTemplateRows each item will be place in each cell first to last
        >
          {/* this created grid line and each block */}
          {Array.from({ length: gridSize.height * gridSize.width }).map(
            (_, index) => {
              const x = index % gridSize.width; // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 = 0-9 by width
              const y = Math.floor(index / gridSize.width); // = 0 - 9 by hight
              return (
                <div
                  key={`${x}-${y}`}
                  className="border border-gray-200 relative hover:bg-gray-100 cursor-pointer "
                  onClick={() => handleTileClick(x, y)}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                    <Grid className="w-4 h-4" />
                    {/* <div className="text-lg">{x},{y}</div> */}
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
          }}
        >
          {items.map((item) => {
            const ItemIcon = itemTypes[item.type as ToolType].icon;
            return (
              <div
                key={item.id}
                className={`${
                  item.color
                } cursor-pointer relative transition-all duration-200 
                ${selectedItem?.id === item.id ? "ring-2 ring-red-500" : ""}`}
                style={{
                  gridColumn: `${item.x + 1} / span ${item.width}`,
                  gridRow: `${item.y + 1} / span ${item.height}`,
                  pointerEvents: "auto",
                }}
                onClick={(e) => handleItemClick(item, e)}
              >
                <button
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  onClick={(e) => handleDeleteItem(item.id, e)}
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="flex items-center justify-center h-full">
                  <ItemIcon />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 mx-8 lg:mx-0  text-sm text-gray-600 gap-2">
        <h1 className="font-bold">
          Click on grid to place items. Click two items to measure the distance
          between them.
        </h1>
        <ul className="list-inside list-disc">
          <li> Forklift takes 1x1 tile</li>
          <li> Shelf takes 2x1 tiles</li>
          <li> Click the X button to delete an item</li>
        </ul>
      </div>
    </div>
  );
};

export default WarehousePlanner;
