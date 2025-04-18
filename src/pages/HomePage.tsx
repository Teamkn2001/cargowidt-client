import DataInput from "@/components/homeComponents/DataInput";
import WarehousePlanner from "../components/homeComponents/WarehousePlanner";
import { WarehouseProvider } from "@/contexts/WarehouseContext";
import Calculation from "@/components/homeComponents/Calculation";
import Introduction from "@/components/homeComponents/Introduction";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <WarehouseProvider>
        <Introduction />
        <DataInput />
        <WarehousePlanner />
        <Calculation />
      </WarehouseProvider>
    </div>
  );
}
