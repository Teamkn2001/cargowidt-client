import { ItemPickRate } from "@/contexts/WarehouseContext";

export class RandomPickGenerator {
  public productList: ItemPickRate[] = [];
  public RandomAmount: number = 0;

  constructor(productList: ItemPickRate[], amount: number) {
    this.productList = productList;
    this.RandomAmount = amount;
  }

  public testLog() {
    console.log(`productList - at randomPickGenerator`, this.productList);
    console.log(`RandomAmount - at randomPickGenerator`, this.RandomAmount);
  }

  public generateRandomPick(): ItemPickRate[] {
    const resultList = [] as ItemPickRate[];

    const totalPickRate = this.productList.reduce((acc, item) => acc + item.pickingRate, 0);

    while (resultList.length < this.RandomAmount) {
        const randomValue = Math.random() * totalPickRate;
      
        let cumulative = 0;
        for (const item of this.productList) {
            cumulative += item.pickingRate;
            if (randomValue <= cumulative) {
                resultList.push(item)
                break; // Exit the loop once we find the item
            }
        }
    }
    return resultList;
  }
}
