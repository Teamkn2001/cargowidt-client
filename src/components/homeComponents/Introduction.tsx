export default function Introduction() {
  return (
    <div className="flex flex-col items-center justify-center mb-4 mt-[4rem] lg:mt-20">

      <div className="my-4">
      <h1 className="font-extrabold text-3xl">This is CargoWIDT</h1>
      <p>A warehouse planing game style ~</p>
      </div>

      <div className="w-[92%] lg:w-[70%] flex flex-col items-center lg:items-start gap-3 lg:gap-4 mb-4 p-1 lg:p-4 rounded-md bg-sky-100">
        <h2 className="font-bold lg:text-xl">How to play?</h2>
        <ol className="list-decimal list-inside px-2">
          <li>
            Insert item to the list and it will generate the the change by item
            divided by total item
          </li>
          <li>
            You can adjust the speed of moving for each tile for specific item
            default is 1 per tile
          </li>
          <li>
            Click on Place StandBy Position / Place Exit Position then Click on
            grid position to place (change by just click other blank tile).
            <ul className="list-disc list-inside ml-4">
              <li>
                {" "}
                StandBy Position : this is the Position picker always stand
                waiting and after picked up item to exit picker wil comeback
                this position
              </li>
              <li>
                Exit Position (finish) : this is the Position picker after found
                item picker will goes
              </li>
            </ul>
          </li>
          <li>
            Select item to place on tile, click Place Item then you can place
            item on the grid you can delete it by clicking on it and click x
            button
          </li>
          <li>
            In Calculation part you pick number to let it pick item by the
            change on Item picking possibility table
          </li>
          <li>
            Click run it will create (1) the table of what number of tile used
            for pick-up, move to exit, and go back to standby position (2) the
            table of value of picking (by just multiply the amount with price!)
          </li>
        </ol>

        <h2 className="font-semibold text-red-800 text-sm lg:text-md ">
          Note: work best in computer screen !
        </h2>

      </div>
    </div>
  );
}
