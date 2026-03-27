import React from "react";
import { Headphones, Shield, Truck } from "lucide-react";

const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid md:grid-cols-3 gap-8">

          {/* Feature 1 */}
          <div className="flex items-center space-x-4">

            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">Free Shipping</h3>
              <p className="text-muted-foreground">
                On orders over $50
              </p>
            </div>

          </div>


          {/* Feature 2 */}
          <div className="flex items-center space-x-4">

            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">Secure Payment</h3>
              <p className="text-muted-foreground">
                100% secure transactions
              </p>
            </div>

          </div>


          {/* Feature 3 */}
          <div className="flex items-center space-x-4">

            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Headphones className="h-6 w-6 text-purple-600" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">24/7 Support</h3>
              <p className="text-muted-foreground">
                Always here to help
              </p>
            </div>

          </div>


        </div>

      </div>
    </section>
  );
};

export default Features;





//       {/* Feature */}
// {/* 
//       <div className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
//             <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
//               🚴‍♂️
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 text-lg">Under 20 Minutes</h4>
//               <p className="text-gray-500 text-sm">Lightning-fast delivery, every time!</p>
//             </div>
//           </div>


//           <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
//             <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
//               ✅
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 text-lg">100% Reliable</h4>
//               <p className="text-gray-500 text-sm">Exactly what you ordered, guaranteed!</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
//             <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
//               💰
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-900 text-lg">Best Prices</h4>
//               <p className="text-gray-500 text-sm">Incredible deals, daily offers!</p>
//             </div>
//           </div>
