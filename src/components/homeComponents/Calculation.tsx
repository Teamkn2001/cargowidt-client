import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { RandomPickGenerator } from "@/utils/randomPickGenerator";
import { runCarrier } from "@/utils/runCarrier";

export default function Calculation() {
  const [pickingNumber, setPickingNumber] = useState<number>(0);

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

    const Carrier = new runCarrier(state.productList ,randomItems, state.warehouseSize, state.itemInWarehouse, state.standByPosition, state.exitPosition, state.itemPickRate);
    // Carrier.findPath();
    const routeData = Carrier.getRouteData();
    const valueData = Carrier.getInformationValue();

    console.log(`routeData`, routeData);
    console.log(`valueData`, valueData);
  };

  return (
    <div className="flex flex-col items-center mx-2 lg:mx-0">
      <form
        onSubmit={(e) => handleSubmitRun(e)}
        className="flex flex-col lg:flex-row items-center gap-5 p-4 mb-4"
      >
        <h1 className="text-xl lg:text-2xl font-bold">Calculation</h1>
        <Input
          onChange={(e) => handleAmountChange(e)}
          value={pickingNumber}
          placeholder="number"
        />
        <Button>Run</Button>
      </form>
    </div>
  );
}
