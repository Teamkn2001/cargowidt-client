import { ItemPickRate } from "@/contexts/WarehouseContext";
import { GridPathfinder } from "./routeCalculation";
import { GridSize, Item, Position } from "@/types";
import { ItemData } from "@/components/homeComponents/DataInput";

export class runCarrier {
  public productList: ItemData[] = [];
  public RandomProductList: ItemPickRate[] = [];
  public WarehouseSize: GridSize = { width: 0, height: 0 };
  public itemInWarehouse: Item[] = [];
  public standByPosition: Position | null = null;
  public exitPosition: Position | null = null;
  public itemPickRate: ItemPickRate[] = [];

  /**
   * Class constructor
   * @param productList - List of items Data to be picked
   * @param RandomProductList - List of items to be picked
   * @param WarehouseSize - Size of the warehouse grid
   * @param itemInWarehouse - List of items in the warehouse(Grid)
   * @param standByPosition - Starting position of the carrier
   * @param exitPosition - Exit position of the carrier
   * @param itemPickRate - List of item pick rates
   */

  constructor(
    productList: ItemData[],
    RandomProductList: ItemPickRate[],
    WarehouseSize: GridSize,
    itemInWarehouse: Item[],
    standByPosition: Position | null = null,
    exitPosition: Position | null = null,
    itemPickRate: ItemPickRate[] = []
  ) {
    this.productList = productList;
    this.RandomProductList = RandomProductList;
    this.WarehouseSize = WarehouseSize;
    this.itemInWarehouse = itemInWarehouse;
    this.standByPosition = standByPosition;
    this.exitPosition = exitPosition;
    this.itemPickRate = itemPickRate;
  }

  private validateData() {
    if (!this.productList || this.productList.length === 0) {
      throw new Error("Product list is empty or not provided.");
    }
    if (!this.RandomProductList || this.RandomProductList.length === 0) {
      throw new Error("Random product list is empty or not provided.");
    }
    if (!this.WarehouseSize) {
      throw new Error("Warehouse size is not provided.");
    }
    if (!this.itemInWarehouse || this.itemInWarehouse.length === 0) {
      throw new Error("Item in warehouse is empty or not provided.");
    }
    if (!this.standByPosition) {
      throw new Error("Standby position is not provided.");
    }
    if (!this.exitPosition) {
      throw new Error("Exit position is not provided.");
    }
    if (!this.itemPickRate || this.itemPickRate.length === 0) {
      throw new Error("Item pick rate is empty or not provided.");
    }

    if (this.standByPosition.x < 0 || this.standByPosition.y < 0) {
      throw new Error("Standby position is out of bounds.");
    }
    if (this.exitPosition.x < 0 || this.exitPosition.y < 0) {
      throw new Error("Exit position is out of bounds.");
    }

    if (
      this.standByPosition.x >= this.WarehouseSize.width ||
      this.standByPosition.y >= this.WarehouseSize.height
    ) {
      throw new Error("Standby position is out of bounds.");
    }

    if (
      this.exitPosition.x >= this.WarehouseSize.width ||
      this.exitPosition.y >= this.WarehouseSize.height
    ) {
      throw new Error("Exit position is out of bounds.");
    }
    
    return true;
  }

  public testLog() {
    console.log(`RandomProductList - at runCarrier`, this.RandomProductList);
    console.log(`WarehouseSize - at runCarrier`, this.WarehouseSize);
    console.log(`itemInWarehouse - at runCarrier`, this.itemInWarehouse);
    console.log(
      `standByPosition and exit - at runCarrier`,
      this.standByPosition,
      this.exitPosition
    );
  }

  public getRouteData() {
    const isValidated = this.validateData();
    
    if (!isValidated) {
      throw new Error("Input validation failed.");
    }

    const routes = this.findPath();

    const productRoute = [] as Array<{
      productName: string;
      toItemCount: number;
      toExitCount: number;
      toStandByCount: number;
    }>;

    routes.map((route) => {
      const eachProductObject = {
        productName: route.productName,
        toItemCount: 0,
        toExitCount: 0,
        toStandByCount: 0,
      };

      const pathsArray = [
        route.paths.toItem,
        route.paths.toExit,
        route.paths.toStandBy,
      ];

      pathsArray.forEach((path, index) => {
        if (path) {
          switch (index) {
            case 0:
              eachProductObject.toItemCount = path.length - 1; // Subtract 1 to exclude the starting point (each start)
              break;
            case 1:
              eachProductObject.toExitCount = path.length - 1;
              break;
            case 2:
              eachProductObject.toStandByCount = path.length - 1;
              break;
          }
        }
      });

      productRoute.push(eachProductObject);
    });
    // console.log(`sumEachRoute`, productRoute);

    const totalStep = productRoute.reduce((acc, cmm) => {
      return acc + cmm.toItemCount + cmm.toExitCount + cmm.toStandByCount;
    }, 0);

    // console.log(`totalStep`, totalStep);

    return { productRoute, totalStep };
  }

  public getInformationValue() {

    const isValidated = this.validateData();
    
    if (!isValidated) {
      throw new Error("Input validation failed.");
    }

    const routes = this.findPath();

    const routeData = this.getRouteData();

    const productListData = this.productList
    const productRate = this.itemPickRate

    const productsValue = [] as Array<{
      productName: string;
      pickAmount: number;
      totalValue: number;
      timeUsed: number;
      timePerUnit: number;
    }>;

    // insert amount of each product
    routes.forEach((route) => {

        const isAdded = productsValue.find((item) => item.productName == route.productName);

        if (isAdded) {
            productsValue.forEach((product) => {
                if (product.productName == route.productName) {
                    product.pickAmount += 1;

                    const pricePerUnit = productListData.find((item) => item.itemName == route.productName)?.price || 0;
                    const eachPickUpAmount = productListData.find((item) => item.itemName == route.productName)?.pickingAmount || 0;
                    const eachPickUpValue = pricePerUnit * eachPickUpAmount;

                    product.pickAmount += eachPickUpAmount;
                    product.totalValue += eachPickUpValue;

                    const movementSpeed = productRate.find((item) => item.itemName == route.productName)?.tileSpeed || 0;
                    const additionalSteps = routeData.productRoute.reduce((acc, cmm) => {
                        if (cmm.productName == route.productName) {
                            return acc + cmm.toItemCount + cmm.toExitCount + cmm.toStandByCount;
                        }
                        return acc;
                    }, 0);

                    product.timeUsed += additionalSteps * movementSpeed;
                    product.timePerUnit = product.timeUsed / product.pickAmount;
                }
              })
        } else {
            const movementSpeed = productRate.find((item) => item.itemName == route.productName)?.tileSpeed || 0;
            const totalStep = routeData.productRoute.reduce((acc, cmm) => {
                if (cmm.productName == route.productName) {
                   
                    return acc + cmm.toItemCount + cmm.toExitCount + cmm.toStandByCount;
                }
                return acc;
            }, 0);
            const timeUsed = totalStep * movementSpeed;
            const pickAmount = productListData.find((item) => item.itemName == route.productName)?.pickingAmount || 0

            const pricePerUnit = productListData.find((item) => item.itemName == route.productName)?.price || 0;
            const eachPickUpAmount = productListData.find((item) => item.itemName == route.productName)?.pickingAmount || 0;

            const eachPickUpValue = pricePerUnit * eachPickUpAmount;

            const eachProductObject = {
                productName: route.productName,
                pickAmount: pickAmount,
                totalValue: eachPickUpValue,
                timeUsed: timeUsed,
                timePerUnit: pickAmount > 0 ? timeUsed / pickAmount : 0,
            };
            productsValue.push(eachProductObject);
        }
    });
    return productsValue;
  }

  public findPath() {
    const ProductRoutes = [] as Array<{
      productName: string;
      paths: {
        toItem: Position[] | null;
        toExit: Position[] | null;
        toStandBy: Position[] | null;
      };
    }>;

    for (const product of this.RandomProductList) {
      const pathfinder = new GridPathfinder(
        this.WarehouseSize.width,
        this.WarehouseSize.height
      );

      const productItem = this.itemInWarehouse.find(
        (item) => product.itemName == item.type
      );

      const obstacleItems = this.itemInWarehouse.filter(
        (item) => product.itemName != item.type
      );

      // loop add obstacle items
      obstacleItems.forEach((item) => {
        pathfinder.addObstacle(item.x, item.y);
      });

      const routeObject = {
        productName: product.itemName,
        paths: {
          toItem: null as Position[] | null,
          toExit: null as Position[] | null,
          toStandBy: null as Position[] | null,
        },
      };

      if (this.standByPosition && this.exitPosition && productItem) {
        try {
          // from standBy to item
          const pathToItem = pathfinder.findPath(
            this.standByPosition.x,
            this.standByPosition.y,
            productItem?.x,
            productItem?.y
          );
          routeObject.paths.toItem = pathToItem;

          // after find item, move to exit
          const pathItemToExit = pathfinder.findPath(
            productItem.x,
            productItem.y,
            this.exitPosition.x,
            this.exitPosition.y
          );
          routeObject.paths.toExit = pathItemToExit;

          // after find exit, move to standBy
          const pathExitToStandBy = pathfinder.findPath(
            this.exitPosition.x,
            this.exitPosition.y,
            this.standByPosition.x,
            this.standByPosition.y
          );
          routeObject.paths.toStandBy = pathExitToStandBy;
        } catch (error) {
          console.error("Error finding path from standBy to item:", error);
        }
      }
      ProductRoutes.push(routeObject);
    }
    return ProductRoutes;
  }
}
