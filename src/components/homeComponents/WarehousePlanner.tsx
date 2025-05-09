import React, { useEffect, useState } from "react";
import { Goal, Package2, PersonStanding, Warehouse, X } from "lucide-react";
import { GridSize, Item } from "../../types";
import { Button } from "../ui/button";
import { useWarehouse } from "@/contexts/WarehouseContext";

type PlacementMode = "item" | "exit" | "standby" | null;

export default function WarehousePlanner() {
  const [gridSize, _setGridSize] = useState<GridSize>({ width: 10, height: 10 }); // default grid size, _ avoid type error not used it yet
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);

  const [placementMode, setPlacementMode] = useState<PlacementMode>(null);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    state,
    setWarehouseSize,
    setItemInWarehouse,
    setStandByPosition,
    setExitPosition,
  } = useWarehouse();

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

  const handleTileClick = (x: number, y: number): void => {
    // console.log("%c get x and y =", "background: yellow", x, y);
    if (placementMode === "item") {
      if (selectedProduct) {
        const newItem: Item = {
          id: Date.now(),
          type: selectedProduct,
          x,
          y,
          width: 1,
          height: 1,
          color: "bg-blue-500",
          icon: Package2,
        };

        if (isValidPosition(newItem)) {
          setItems([...items, newItem]);
          setSelectedItem(null);
        }
      }
    } else if (placementMode === "exit") {
      setExitPosition({ x, y });
    } else if (placementMode === "standby") {
      setStandByPosition({ x, y });
    }
  };

  const handleItemClick = (clickedItem: Item, e: React.MouseEvent): void => {
    e.stopPropagation();
    console.log("clicked at item", clickedItem);
    if (selectedItem) {
      if (selectedItem.id !== clickedItem.id) {
        setSelectedItem(null);
      } else {
        setSelectedItem(null);
      }
    } else {
      setSelectedItem(clickedItem);
    }
    setError(null);
  };

  const handleDeleteItem = (itemId: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    // console.log("delete item clicked on item =", itemId);
    setItems(items.filter((item) => item.id !== itemId)); // remove item from items array (filter what is not the Id)
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    setWarehouseSize(gridSize); // update warehouse size in context
    setItemInWarehouse(items); // update items in context
  }, [gridSize, items]);

  useEffect(() => {
    // Set the first product as selected product when list loads or changes
    if (state.productList.length > 0 && !selectedProduct) {
      setSelectedProduct(state.productList[0].itemName);
    }
  }, [state.productList, selectedProduct]);

  return (
    <div className="flex flex-col items-center mx-2 lg:mx-0 ">
      <div className="flex flex-col items-center gap-5 p-4 mb-4 ">
        <div>
          <Warehouse />
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-2  lg:items-center">
          <label className="text-sm font-medium mb-1">Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border rounded p-1 flex-grow w-full"
          >
            {state.productList && state.productList.length > 0 ? (
              state.productList.map((product) => (
                <option key={product.itemName} value={product.itemName}>
                  {product.itemName}
                </option>
              ))
            ) : (
              <option value="">No products available</option>
            )}
          </select>
          <Button
            onClick={() => setPlacementMode("item")}
            disabled={!selectedProduct || placementMode === "item"}
            className={placementMode === "item" ? "active" : ""}
          >
            Place Item
          </Button>
        </div>

        <div className="flex gap-2 lg:gap-6">
          <div>
            <Button
              onClick={() => setPlacementMode("standby")}
              disabled={placementMode === "standby"}
              className={placementMode === "standby" ? "active" : ""}
            >
              Place Standby Position
            </Button>
          </div>

          <div>
            <Button
              onClick={() => setPlacementMode("exit")}
              disabled={placementMode === "exit"}
              className={placementMode === "exit" ? "active" : ""}
            >
              Place Exit Position
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* this is main grid */}
      <div
        className="relative w-full" //make square container size 600 px
        style={{ aspectRatio: "1/1", maxWidth: "600px" }}
      >
        <div
          className="grid absolute inset-0 border border-gray-400 bg-gray-100 " // fill square container with grid
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`, // 1fr = each cell takes equal space
            gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
          }} // create grid with gridTemplateColumns x gridTemplateRows each item will be place in each cell first to last
        >
          {/* this created grid line and each block */}
          {Array.from({ length: gridSize.height * gridSize.width }).map(
            (_, index) => {
              const x = index % gridSize.width; // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 = 0-9 by width
              const y = Math.floor(index / gridSize.width); // = 0 - 9 by hight index 25/10 = y = 2
              return (
                <div
                  key={`${x}-${y}`}
                  className="border border-gray-200 relative hover:bg-gray-100 cursor-pointer "
                  onClick={() => handleTileClick(x, y)}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                    <div className="text-lg">
                      {x},{y}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* map item to grid */}
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
          }}
        >
          {items.map((item) => (
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
              {selectedItem?.id === item.id && (
                <button
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  onClick={(e) => handleDeleteItem(item.id, e)}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <div className="flex items-center justify-center h-full">
                <Package2 />
                <span className="text-xs absolute bottom-0 left-0 right-0 text-center bg-black bg-opacity-50 text-white truncate px-1">
                  {item.type}
                </span>
              </div>
            </div>
          ))}

          {/* Exit position */}
          {state.exitPosition && (
            <div
              className="bg-red-200 cursor-pointer relative transition-all duration-200 border-2 border-red-500 "
              style={{
                gridColumn: `${state.exitPosition.x + 1} / span 1`,
                gridRow: `${state.exitPosition.y + 1} / span 1`,
                pointerEvents: "auto",
              }}
            >
              <div className="flex items-center justify-center h-full">
                <Goal className="w-6 h-6 text-red-600" />
                <span className="text-xs absolute bottom-0 left-0 right-0 text-center bg-red-600 text-white truncate px-1">
                  Exit
                </span>
              </div>
            </div>
          )}

          {/* StandBy position */}
          {state.standByPosition && (
            <div
              className="bg-blue-200 cursor-pointer relative transition-all duration-200 border-2 border-blue-500"
              style={{
                gridColumn: `${state.standByPosition.x + 1} / span 1`,
                gridRow: `${state.standByPosition.y + 1} / span 1`,
                pointerEvents: "auto",
              }}
            >
              <div className="flex items-center justify-center h-full">
                <PersonStanding className="w-6 h-6 text-blue-600" />
                <span className="text-xs absolute bottom-0 left-0 right-0 text-center bg-blue-600 text-white truncate px-1">
                  Standby
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
