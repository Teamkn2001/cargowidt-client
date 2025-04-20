import bgImage from '../assets/bg-dotDotdot.webp';

export default function AboutPage() {

  return (
    <div className="mt-16" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)', backgroundBlendMode: 'overlay' }}>
      <div className="h-auto flex flex-col items-center justify-center gap-3 lg:gap-6 mb-2 p-6 lg:p-10 lg:px-[15rem]">
        <h1 className="font-bold text-2xl lg:text-4xl">Hello world!</h1>
        <p className="text-md lg:text-lg"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CargoWIDT is a warehouse optimization simulator that helps users model and analyze picking operations in a warehouse environment. The application allows users to create a customized warehouse layout by placing items, standby positions, and exit points on a grid. Users can define various product attributes including weight, picking amount, quantity, and price, with the system automatically calculating picking rates based on inventory distributions.</p>
        <p className="text-md lg:text-lg"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The simulator generates random picking scenarios based on the defined probability distributions, then calculates optimal paths for pickers to retrieve items, deliver them to exit points, and return to standby positions. Users can analyze performance metrics such as tile usage (movement counts), time efficiency, and value calculations. The path visualization feature displays the exact coordinates a picker would follow when retrieving each product, showing the complete journey from standby position to item location, to exit point, and back to standby.</p>
        <p className="text-md lg:text-lg"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CargoWIDT serves as an excellent planning tool for warehouse managers, logistics professionals, and supply chain analysts who want to test different warehouse configurations and picking strategies without disrupting actual operations. The interactive interface makes it easy to experiment with different layouts and immediately see the impact on efficiency metrics.</p>
      </div>

      <div className="h-auto flex flex-col items-end justify-center gap-1 lg:gap-2 pr-6 lg:pr-[22rem]">
       <div className="text-center">
       <p className="text-md lg:text-lg">Sudtipong (Team)</p>
       <h3 className="text-md lg:text-lg font-bold">Developer</h3>
       </div>
      </div>
    </div>
  )
}
