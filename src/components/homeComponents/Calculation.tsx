import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { RandomPickGenerator } from "@/utils/randomPickGenerator";

export default function Calculation() {
  const [pickingNumber, setPickingNumber] = useState<number>(0);

  const { state } = useWarehouse();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickingNumber(Number(value));
  };

  const handleSubmitRun = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Picking Number:", pickingNumber);
    console.log("Item Pick Rate:", state.itemPickRate);
    // Add your logic to handle the calculation here

    const randomPickGenerator = new RandomPickGenerator(
      state.itemPickRate,
      pickingNumber
    );
    // randomPickGenerator.testLog();
    const randomItems = randomPickGenerator.generateRandomPick();
    console.log(`randomItems from generateRandomPick`, randomItems);
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
