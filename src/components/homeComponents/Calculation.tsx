import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { RandomPickGenerator } from "@/utils/randomPickGenerator";
import { runCarrier } from "@/utils/runCarrier";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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

export default function Calculation() {
  const [pickingNumber, setPickingNumber] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [routeData, setRouteData] = useState<RouteData[]>([]);
  const [valueData, setValueData] = useState<ValueData[]>([]);

    console.log(`value to render`, valueData);
  const { state } = useWarehouse();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickingNumber(Number(value));
  };

  const handleSubmitRun = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      // Carrier.findPath();
      const routeData = Carrier.getRouteData();
      const valueData = Carrier.getInformationValue();
      console.log(`routeData`, routeData);
      console.log(`valueData`, valueData);

      setRouteData(routeData.productRoute);
      setValueData(valueData);
    } catch (error) {
      console.error("Error in runCarrier:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mx-2 lg:mx-0">
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
        <div>
          <h1 className="font-bold lg:text-2xl text-red-500">
            {" "}
            ! {errorMessage}
          </h1>
        </div>
      )}

      {routeData.length > 0 && (
        <div className="mb-4 lg:mb-8">
            <h1 className="font-bold text-center lg:text-xl">Tile usage</h1>
          <Table>
            <TableCaption>Routes Data(tile usage)</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>pick Item</TableHead>
                <TableHead>item exit</TableHead>
                <TableHead>back stand</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
                {routeData.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-center">{item.toItemCount}</TableCell>
                        <TableCell className="text-center">{item.toExitCount}</TableCell>
                        <TableCell className="text-center">{item.toStandByCount}</TableCell>
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
                    <TableHead>time/unit</TableHead>
                    <TableHead>total time</TableHead>
                    <TableHead>total value</TableHead>
                </TableRow>
                </TableHeader>
    
                <TableBody>
                {valueData.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell className="text-center">{item.pickAmount}</TableCell>
                    <TableCell className="text-center">{item.timePerUnit.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.timeUsed}</TableCell>
                    <TableCell className="text-center">{item.totalValue}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
      )}
    </div>
  );
}
