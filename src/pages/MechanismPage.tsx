import bgImage from '../assets/bg-dotDotdot.webp';

export default function MechanismPage() {
  return (
    <div className="h-[50rem] flex flex-col justify-start items-center mt-12 lg:mt-16" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', backgroundBlendMode: 'overlay' }}>
      <div className="lg:w-[70%] flex flex-col items-center justify-center m-8 gap-2 lg:gap-4 ">
        <h1 className="font-bold text-2xl lg:text-3xl">Mechanism</h1>
        <div className="w-full lg:text-lg">
          <p>
            <strong>picking-rate</strong> : item divided by sum all of the
            amount multiply by 100
          </p>
        </div>

        <h2 className="font-bold lg:text-xl">Tile Usage Table</h2>
        <div className="w-full lg:text-lg">
          <p>
            <strong>position count</strong> : Calculation by exclude the current
            standing tile, for picking item it exclude the stand by tile
            (finish: stand at item tile), after picked up item move to exit it
            exclude the item tile(finish: stand at exit tile), goes back to
            stand by tile exclude the exit tile(finish: stand at stand by tile)
          </p>
          <p>
            <strong>Total Step</strong> : Sum of all movement used
          </p>
        </div>

        <h2 className="font-bold lg:text-xl">Value Data Table</h2>
        <div className="w-full lg:text-lg">
          <p>
            {" "}
            <strong>Amount</strong> : The picking amount/time multiply by the
            number of item getting pick
          </p>
          <p>
            <strong>Time/Unit</strong> : Total Time divided by amount
          </p>
          <p>
            <strong>Total Time</strong> : Total step usage in (Tile usage table)
            multiply by tile speed of that item
          </p>
          <p>
            <strong>total value</strong> : Amount multiply by item's price
          </p>
        </div>
      </div>
    </div>
  );
}
