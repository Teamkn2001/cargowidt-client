import { ItemData } from "@/components/homeComponents/DataInput";
import { GridSize, Item, Position } from "@/types";
import { createContext, useContext, useState, ReactNode } from "react";

export interface ItemPickRate {
  No: number;
  itemName: string;
  pickingRate: number;
  tileSpeed: number;
}

// export interface ProductList {
//   name: string;
// }

// Define an extensible context type with generic state
export interface WarehouseState {
  itemPickRate: ItemPickRate[];
  warehouseSize: GridSize;
  productList: ItemData [];
  itemInWarehouse: Item[];
  standByPosition: Position | null;
  exitPosition: Position | null;
}

// Create a type for the context that includes both state and setters
export interface WarehouseContextType {
  state: WarehouseState;

  // State setters
  setItemPickRate: React.Dispatch<React.SetStateAction<ItemPickRate[]>>;
  setWarehouseSize: React.Dispatch<React.SetStateAction<GridSize>>;
  setProductList: React.Dispatch<React.SetStateAction<ItemData[]>>;
  setItemInWarehouse: React.Dispatch<React.SetStateAction<Item[]>>;
  setStandByPosition: React.Dispatch<React.SetStateAction<Position | null>>;
  setExitPosition: React.Dispatch<React.SetStateAction<Position | null>>;
}

const initialState: WarehouseState = {
  itemPickRate: [],
  warehouseSize: { width: 10, height: 10 },
  productList: [],
  itemInWarehouse: [],
  standByPosition: null,
  exitPosition: null,
};

const initialContext: WarehouseContextType = {
  state: initialState,
  setItemPickRate: () => {
    console.warn("setItemPickRate was called outside of WarehouseProvider");
  },
  setWarehouseSize: () => {
    console.warn("setWarehouseSize was called outside of WarehouseProvider");
  },
  setProductList: () => {
    console.warn("setProductList was called outside of WarehouseProvider");
  },
  setItemInWarehouse: () => {
    console.warn("setItemInWarehouse was called outside of WarehouseProvider");
  },
  setStandByPosition: () => {
    console.warn("setStandByPosition was called outside of WarehouseProvider");
  },
  setExitPosition: () => {
    console.warn("setExitPosition was called outside of WarehouseProvider");
  },
};

// Create the context with the initial value
const WarehouseContext = createContext(initialContext);

// Create a provider component
export function WarehouseProvider({ children }: { children: ReactNode }) {
  // State declarations
  const [itemPickRate, setItemPickRate] = useState<ItemPickRate[]>([]);
  const [warehouseSize, setWarehouseSize] = useState<GridSize>({
    width: 10,
    height: 10,
  });

  const [productList, setProductList] = useState<ItemData[]>([]); // is it needed?
  const [itemInWarehouse, setItemInWarehouse] = useState<Item[]>([]);
  const [standByPosition, setStandByPosition] = useState<Position | null>(null);
  const [exitPosition, setExitPosition] = useState<Position | null>(null);

//   console.log(`itemInWarehouse - at context`, itemInWarehouse);
//   console.log(`productList - at context`, productList);
//   console.log(`itemPickRate - at context`, itemPickRate);
//   console.log(`stand by and exit - at context`, standByPosition, exitPosition);

  // Combine all state into a single object
  const state: WarehouseState = {
    itemPickRate,
    warehouseSize,
    productList,
    itemInWarehouse,
    standByPosition,
    exitPosition,
  };

  // Create the context value with state and setters
  const value: WarehouseContextType = {
    state,
    setItemPickRate,
    setWarehouseSize,
    setProductList,
    setItemInWarehouse,
    setStandByPosition,
    setExitPosition,
  };

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
}

// Create a custom hook for using this context
export function useWarehouse() {
  return useContext(WarehouseContext);
}
