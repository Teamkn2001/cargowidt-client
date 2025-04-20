import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { RandomPickGenerator } from "@/utils/randomPickGenerator";
import { runCarrier } from "@/utils/runCarrier";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Position } from "@/types";
import ShowPath from "./ShowPath";

interface RouteData {
  productName: string;
  toExitCount: number;
  toItemCount: number;
  toStandByCount: number;
}

interface ValueData {
  pickAmount: number;
  productName: string;
  timePerUnit: number;
  timeUsed: number;
  totalValue: number;
}

interface MovementPath {
  toItem: Position[] | null;
  toExit: Position[] | null;
  toStandBy: Position[] | null;
}

interface PathList {
  productName: string;
  paths: MovementPath;
}

export default function Calculation() {
  const [pickingNumber, setPickingNumber] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [routeData, setRouteData] = useState<RouteData[]>([]);
  const [valueData, setValueData] = useState<ValueData[]>([]);
  const [pathList, setPathList] = useState<PathList[]>([]);

  const { state } = useWarehouse();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickingNumber(Number(value));
  };

  const isAllItemOnGird = () => {
    const allItemInProductList = state.productList
    const allItemInWarehouse = state.itemInWarehouse

    const isInGrid = (currentProduct: string) => {
      return allItemInWarehouse.some((item) => item.type === currentProduct);
    }

    const isAllItemExistInGrid = allItemInProductList.every((item) => {
      const isItemInWarehouse = isInGrid(item.itemName);
      if (!isItemInWarehouse) {
        return false;
      }
      return true;
    })

    if (isAllItemExistInGrid) {
      return true;
    } else {
      console.log(`Not all items are in the warehouse !`);
      return false;
    }
  }

  const handleSubmitRun = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRouteData([]);
    setValueData([]);
    setPathList([]);
    setErrorMessage("");

    const isReady = isAllItemOnGird()
    console.log(`isReady check`, isReady)
    if (!isReady) {
      setErrorMessage("Please make sure all items are in the warehouse.");
      return;
    }

    const randomPickGenerator = new RandomPickGenerator(
      state.itemPickRate,
      pickingNumber
    );
    const randomItems = randomPickGenerator.generateRandomPick();

    try {
      const Carrier = new runCarrier(
        state.productList,
        randomItems,
        state.warehouseSize,
        state.itemInWarehouse,
        state.standByPosition,
        state.exitPosition,
        state.itemPickRate
      );
      const routeDataList = Carrier.getRouteData();
      const valueData = Carrier.getInformationValue();
      const pathData = Carrier.findPath();

      const uniqueRouteData = routeDataList.productRoute.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.productName === item.productName)
        // the self(3rd parameter) is the array itself (just full array of routeDataList.productRoute)
      );

      const uniquePathData = pathData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.productName === item.productName)
      );

      setPathList(uniquePathData);
      setRouteData(uniqueRouteData);
      setValueData(valueData);
    } catch (error) {
      console.error("Error in runCarrier:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mx-2 mb-4 lg:mx-0">
      <form
        onSubmit={(e) => handleSubmitRun(e)}
        className="flex flex-col lg:flex-row items-center gap-5 p-4 mb-4"
      >
        <h1 className="text-xl lg:text-xl font-bold">Calculation</h1>
        <Input
          onChange={(e) => handleAmountChange(e)}
          value={pickingNumber}
          placeholder="number"
        />
        <Button>Run</Button>
      </form>

      {errorMessage && (
        <div className="mb-4">
          <h1 className="font-bold lg:text-2xl text-red-500">
            {" "}
            {errorMessage}
          </h1>
        </div>
      )}

      {routeData.length > 0 && (
        <div className="mb-4 lg:mb-8">
          <h1 className="font-bold text-center lg:text-xl">Tile Usage</h1>
          <Table>
            <TableCaption>Routes Data(tile usage)</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Pick Item</TableHead>
                <TableHead>Item exit</TableHead>
                <TableHead>Back stand</TableHead>
                <TableHead>Total Step</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {routeData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-center">
                    {item.toItemCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.toExitCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.toStandByCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.toItemCount +
                      item.toExitCount +
                      item.toStandByCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {valueData.length > 0 && (
        <div>
          <h1 className="font-bold text-center lg:text-xl">Value Data</h1>
          <Table>
            <TableCaption>Value Data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time/Unit</TableHead>
                <TableHead>Total time</TableHead>
                <TableHead>Total value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {valueData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-center">
                    {item.pickAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.timePerUnit.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">{item.timeUsed}</TableCell>
                  <TableCell className="text-center">
                    {item.totalValue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {pathList.length > 0 && (
        <div className="my-6">
          <h1 className="font-bold lg:text-xl">Tile Movement for Product</h1>
        </div>
      )}

      {pathList.length > 0 &&
        pathList.map((productPath, index) => {
          const toItemPath = productPath.paths.toItem || [];
          const toExitPath = productPath.paths.toExit || [];
          const toStandByPath = productPath.paths.toStandBy || [];

          return (
            <div className="w-full lg:w-[70%] flex flex-col items-center lg:items-start gap-3 lg:gap-5 mb-4 p-1 lg:p-4 rounded-md bg-gray-200" key={index}>
              <h1 className="font-semibold">{productPath.productName}</h1>

              <h1>Pick item(s)</h1>

              {toItemPath && toItemPath.length > 0 ? (
               <ShowPath path={toItemPath} index={index} />
              ) : (
                <p>No path to item</p>
              )}

                <h1>move to Exit</h1>

              {toExitPath &&toExitPath.length > 0 ? (
                  <ShowPath path={toExitPath} index={index} />
                ) : (
                    <p>No path to exit</p>
                )}

                <h1>back to Stand by</h1>

              {toStandByPath && toStandByPath.length > 0 ? (
                   <ShowPath path={toStandByPath} index={index} />
                ) : (
                    <p>No path to stand by</p>
                )}
            
            </div>
          );
        })}
    </div>
  );
}
