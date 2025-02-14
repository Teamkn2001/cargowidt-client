import Temporary from "@/components/homeComponents/Temporary";
import HowtoPlay from "../components/homeComponents/HowtoPlay";
import WarehousePlanner from "../components/homeComponents/WarehousePlanner";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HowtoPlay />
      <WarehousePlanner />
      <Temporary />
    </div>
  );
}
