# CargoWIDT
#### Video Demo: https://youtu.be/q7BAyEo_ofg
#### Description:
CargoWIDT project build on VITE a build tool and use typescript, CSS, TailWind to use CSS easier and HTML. by default we just use 1 div with id root to start writing DOM like to create other pages, component by TypeScript XML that make me can write HTML directly in my typescript code

src/asset : store webp background

main.tsx : React createRoot by using DOM to get the root div and render the App.tsx (CSS applied)

App.tsx : just render the AppRouter component

src/route/AppRouter : create react router by react-router-dom, so i can manage my page path here like default page, /about and /mechanism and use HomeLayout to be the parent component by now just to add header that stick to all other page

layouts/HomeLayout : render the Header component and other outlet (like HomePage, AboutPage)

homeComponent/Header.tsx : render header of the web for mobile designed to use hamburger menu that can toggle(by use useSate setIsMenuOpen) use Link to navigate to component (a tag cause react app reload and reset page state)

scr/pages : store home, about, mechanism page's template the About page and Mechanism is to show some web information and how it work and the main function is HomePage component

let talk about other detail
types: store types script type that frequently use in this web like position item interface

pages/HomePage : main function that render Introduction, DataInput, WarehousePlaner Calculation components wrapped with WarehouseProvider react context

context/WarehouseContext : Use this component to store variable that need to share in the DataInput, WarehousePlaner Calculation component, so these component can access variable/ set some State variable here (the state in WarehouseContextType here just use for flexibility on (if)further development now just use only WarehouseState) by wrapped component in HomePage.Create function useWarehouse for other useContext I am gonna use.

Main Component
#### DataInput.tsx : 
main for handle input the item data render the table from shadcn ui. The table row will have input row that user can fill the data and press icon to add(update state) item by handleAddItem that check all the input must be filled and the item name must not the duplicate if it invalid I have errorLackOfData state to render below by setErrorLackOfData, if the row item input is valid it will updated the Items list by create copy of items array and insert this new Item data in it after success to set item it clear input by handleClearNewItem(just make it blank) and set errorLackOfData state to false (if previously I click and it lack data it will display warning) and it not render
// {errorLackOfData && (div)} if the errorLackOfData is not False it will render the div
The data in the row can toggle to be Input by clicking at that row and it use handleSelectItem and it sent the Item name to function to set that Item to be in selectedItem state, so if Item being in selectedItem the Table cell will change to input like this

<TableCell> {selectedItem === item.itemName ? (render as Input) : (just render at normal value)}</TableCell>

Each Table row have delete Item Icon when click it will run handleDeleteItem and sent ItemName to use for set Items state by filter that only left Item except item that have name sent to this function 

the item pick-rate table will auto generate and adjust table cell value if items state change because of useEffect and it will run handleCalculatePickRate that calculate by just use reduce to loop through items array and sum the totalAmount and use this variable for calculate picking change for this web logic  and set Item information that required to use in other component and it can change tile speed if it change it will set state at warehouseContext that it create variable there, I can access it by
const { state, setItemPickRate, setProductList } = useWarehouse(); so I pull setItemPickRate to use in this component

#### WarehousePlanner.tsx :
 Render the grid div 10 by 10 to make virtual position for 0,0 to 9,9 as x,y position for place item, stand by, exit position by clicking the button first it will select mode to know what to be place by placementMode state. the grid is render on div styled scc with aspectRatio 1/1 (square relative div) and render as above (absolute) and inset match the square after create grid there are blank so mapped the div to display each tile (same amount as grid size) it show position on each grid div 100 tiles and have variable x as row and y as column index. After that add handleTileClick on that mapped tiles when being click it sent (x,y) as item other position by use selectMode that being click as button above for item it will check isValidPosition to check item position must in the grid length and not overlapped with items by for loop (current function can handle the item that size not equal to 1) if valid it added to items (and the useEffect track this items state to store at context by setItemInWarehouse)
after item add to item state item will being mapped over the gird (that show x,y) render box item/standBy/exit div. for item that rendered when it being click it will show the X or delete button at top-right(absolute top-0 right-0) when click it sent ItemId of that mapped item to handleDeleteItem and setItems by filter left only the item that is not the id sent to this function and clear selectedItem.The selective option of item is default as item index 0 from all item list at context and it render firstly at useEffect

#### Calculation.tsx :
 Render the input for generate item route table and  Value Table data by using runCarrier class and set to state routeData, valueData, pathList to render as table and ShowPath component which render each path mapped if it available if invalid set the errorMessage and render it instead.

utils folder
#### RandomPickGenerator.ts :
 class that required productList and amount to random it it will create a array that have the length of amount that construct this class instance and use the randomValue by Math.random that fall into that pickingRate length (if fall into range push to array then break and loop till match array length) return the array of random item(s) in productList by pickrate.

#### routeCalculation.ts :
 Make GridPathfinder class (A*) that required grid width, height the class initial by that width, height and blank obstacles (list of string of (x,y) obstacle) the obstacle will be added at class function addObstacle 

addObstacle function : required position(x,y) and add to obstacle set 

##### heuristic function : 
required 4 parameters like start position and goal position return absolute(startX - goalX) + absolute(startY - goalY) the rough distant between start position and goal

##### isValidPosition function : 
required position(x,y) return true if the item is in grid length by both width and height

##### getNeighbors function : 
required position(x,y) and it will return the array of nearby position by move up/down/left/right that is valid by use isValidPosition

##### findPath function : 
required 4 parameters (startX, startY, goalX, goalY) the start position and goal position check if the function not have these parameters return error 
create 

- variable openSet : store set of PathNode type that contain Position (x,y), cost (the step use), heuristic (how close to goal), f (f-score that is cost + heuristic) and parent itself node
- variable closedSet : store set of position that have been used to evaluate data
- variable startNode : store Node class instance that have structure like PathNode interface.Start by add the startX, startY (start position), cost 0, heuristic (how far this start position to goal position) after initialized these add the start node to openSet for use loop
- variable nodeMap : store Map data type store key-value pair of GridPosition key and PathNode and set the start position to it (`startX,startY`, PathNode) 
after initialized openSet it loop till the current position start from startNode if found the goal position it break and return the node position goal node (parent is previous node back to startNode), if not goal position it remove current pathNode from openSet and add current pathNode position to close set and use getNeighbors check nearby position if it in closedSet(evaluated) pass this node, if not make tentativeCost (step cost + 1 /move 1 position) and look at node map and if this neighbor position already exist and have cost more that this evaluation update to this node because this path use less step. if the this position not exist create new Node for this neighbor position add it to node map with position and created node, add this created node to openSet to evaluate next, and set parent of this node to current node (being evaluate).

##### reconstructPath function : 
required PathNode. it will use after the findPath success and return the goal node that have parent to start node. this function reverse it and use only position (x,y) to create array of step position from start to goal  

#### runCarrier.ts : 
Class for summary data by using function routeCalculation class. it check valid parameters and do function 
##### findPath function : 
use GridPathfinder class function findPath for each of randomGenerate class. It create new GridPathfinder instance for each of it and return the productName and path step of this random item picked the step have type 1.step start to item 2.item to exit 3. exit to start

##### getRouteData function :
 use findPath from this class to get the steps list of all item loop it to sum each of type in each item step type and loop(reduce) sum all the step return both list of each item step and total step 

##### getInformationValue function : 
use use findPath from this class to get the steps and productListData, productRate that sent to this function the component that called this can access this by warehouseContext wrapped and pass to this function it return sum of each item(product) value. pickAmount this from the item count multiply by pickrate/time. totalValue is price multiply by amount item being pick. timeUsed use tile speed multiply by that item steps timePerUnit is just the timeUsed divided by pickAmount. Return all of this to map table show all information in Calculation.tsx