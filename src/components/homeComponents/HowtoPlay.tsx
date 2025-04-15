import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PackagePlus, PackageX } from "lucide-react";

interface ItemData {
  itemName: string;
  weight: number;
  pickingAmount: number;
  amount: number;
  price?: number;
}

interface NewItemData {
  itemName: string;
  weight: string;
  pickingAmount: string;
  amount: string;
  price: string;
}

interface ItemPickRate {
  No: number;
  itemName: string;
  pickingRate: number;
  tileSpeed: number;
}

export default function HowtoPlay() {
  const [items, setItems] = useState<ItemData[]>([
    {
      itemName: "INV001",
      weight: 10.2,
      pickingAmount: 3,
      amount: 270,
      price: 15,
    },
    {
      itemName: "INV002",
      weight: 5.4,
      pickingAmount: 7,
      amount: 250,
      price: 15,
    },
    {
      itemName: "INV003",
      weight: 5.0,
      pickingAmount: 12,
      amount: 250,
      price: 15,
    },
    {
      itemName: "INV004",
      weight: 0,
      pickingAmount: 15,
      amount: 250,
      price: 15,
    },
    {
      itemName: "INV005",
      weight: 0,
      pickingAmount: 7,
      amount: 250,
      price: 15,
    },
  ]);

  const [newItem, setNewItem] = useState<NewItemData>({
    itemName: "",
    weight: "",
    pickingAmount: "",
    amount: "",
    price: "",
  });

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [itemPickRate, setItemPickRate] = useState<ItemPickRate[]>([]);

  const handleInputChange = (
    itemName: string,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.itemName == itemName ? { ...item, [field]: e.target.value } : item
      )
    );
  };

  const [errorLackOfData, setErrorLackOfData] = useState(false);

  const handleClearNewItem = () => {
    setNewItem({
      itemName: "",
      weight: "",
      pickingAmount: "",
      amount: "",
      price: "",
    });
  };

  const handleAddItem = () => {
    if (
      !newItem.itemName ||
      !newItem.weight ||
      !newItem.pickingAmount ||
      !newItem.amount ||
      !newItem.price
    ) {
      setErrorLackOfData(true);
      return;
    }
    if (items.find((item) => {
      let itemName = item.itemName.toLowerCase();
      let newItemName = newItem.itemName.toLowerCase();
      return itemName === newItemName;
    })) {
      setErrorLackOfData(true);
      return;
    }

    const readyItem: ItemData = {
      ...newItem,
      itemName: newItem.itemName,
      weight: Number(newItem.weight),
      pickingAmount: Number(newItem.pickingAmount),
      amount: Number(newItem.amount),
      price: Number(newItem.price),
    };
    setItems((prev) => [...prev, readyItem]);

    handleClearNewItem();
    setErrorLackOfData(false);
  };

  const handleDeleteItem = (itemName: string) => {
    setItems((prev) => prev.filter((item) => item.itemName !== itemName));
  };

  const handleSelectItem = (itemName: string) => {
    setSelectedItem(itemName === selectedItem ? null : itemName);
  };

  const handleCalculatePickRate = () => {
    setItemPickRate([])

    const totalAmount = items.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);
    console.log(":smile:", totalAmount);

    items.map((item, index) => {
      if (totalAmount == 0) return;
      if (item.amount == 0) return;

      setItemPickRate((prev) => [
        ...prev,
        {
          No: index + 1,
          itemName: item.itemName,
          pickingRate: (item.amount / totalAmount) * 100,
          tileSpeed: 1,
        },
      ]);
    });
  };

  const handleChangeTileSpeed = (
    itemName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setItemPickRate((prev) =>
      prev.map((item) =>
        item.itemName === itemName
          ? { ...item, tileSpeed: Number(e.target.value) }
          : item
      )
    );
  };

  useEffect(() => {
    handleCalculatePickRate();
  }, [items]);

  return (
    <div className="flex flex-col items-center justify-center mb-4  mt-[5rem] lg:mt-24 ">
      <div>
        <h1>CargoWIDT.v1</h1>
        <p>Hello, from dep talk about how to play this game</p>
      </div>

      <div className="p-1 lg:p-0">
        <Table>
          <TableCaption className="text-right">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Item</TableHead>
              <TableHead>weight (KG.)</TableHead>
              <TableHead>picking amount/time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.itemName}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectItem(item.itemName)}
              >
                <TableCell>
                  {selectedItem === item.itemName ? (
                    <Input
                      value={item.itemName}
                      onChange={(e) =>
                        handleInputChange(item.itemName, "itemName", e)
                      }
                      className="w-full"
                    />
                  ) : (
                    <span>{item.itemName}</span>
                  )}
                </TableCell>
                <TableCell>
                  {selectedItem === item.itemName ? (
                    <Input
                      type="number"
                      value={item.weight}
                      onChange={(e) =>
                        handleInputChange(item.itemName, "weight", e)
                      }
                      className="w-full"
                    />
                  ) : (
                    <span>{item.weight}</span>
                  )}
                </TableCell>
                <TableCell>
                  {selectedItem === item.itemName ? (
                    <Input
                      type="number"
                      value={item.pickingAmount}
                      onChange={(e) =>
                        handleInputChange(item.itemName, "pickingAmount", e)
                      }
                      className="w-full"
                    />
                  ) : (
                    <span>{item.pickingAmount}</span>
                  )}
                </TableCell>
                <TableCell>
                  {selectedItem === item.itemName ? (
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        handleInputChange(item.itemName, "amount", e)
                      }
                      className="w-full"
                    />
                  ) : (
                    <span>{item.amount}</span>
                  )}
                </TableCell>
                <TableCell>
                  {selectedItem === item.itemName ? (
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleInputChange(item.itemName, "price", e)
                      }
                      className="w-full"
                    />
                  ) : (
                    <span>{item.price}</span>
                  )}
                </TableCell>
                <TableCell
                  className="w-14 h-full flex justify-center text-red-600"
                  onClick={() => handleDeleteItem(item.itemName)}
                >
                  <PackageX />
                </TableCell>
              </TableRow>
            ))}

            {/*---------- New Item row */}
            <TableRow className="bg-gray-100">
              <TableCell>
                <Input
                  value={newItem.itemName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, itemName: e.target.value })
                  }
                  placeholder="Enter Name"
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={newItem.weight}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      weight: e.target.value,
                    })
                  }
                  placeholder="Enter weight"
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={newItem.pickingAmount}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      pickingAmount: e.target.value,
                    })
                  }
                  placeholder="per/times"
                  className="w-full text-center"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  value={newItem.amount}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                  className="w-full text-right"
                  type="number"
                  step="0.1"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: e.target.value,
                    })
                  }
                  placeholder="Enter price"
                  className="w-full text-right"
                  type="number"
                  step="0.1"
                />
              </TableCell>
              <TableCell className="text-center">
                <PackagePlus size={20} onClick={handleAddItem} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6}>
                {errorLackOfData && (
                  <p className="text-red-500 text-sm lg:text-lg mb-2">
                    Please fill all the fields and Use duplicate name !
                  </p>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button>generate runtime</Button>
      </div>

      <div className="w-auto mt-10 px-6 lg:px-0">
        <Table>
          <TableCaption>item pick-rate</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>picking-rate</TableHead>
              <TableHead className="text-right">tile/speed</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {itemPickRate.map((item) => (
              <TableRow key={item.itemName}>
                <TableCell>{item.No}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.pickingRate.toFixed(2)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    name="tileSpeed"
                    value={item.tileSpeed}
                    onChange={(e) => handleChangeTileSpeed(item.itemName, e)}
                    className="w-full"
                    step={0.1}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
