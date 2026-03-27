import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-slate-50 via-white to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="flex flex-col justify-center max-w-2xl">

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            Smart Shopping
            <span className="block text-orange-500 font-bold">
              Simplified Everyday
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl">
            Discover laptops, smartphones, headphones, fashion, home essentials
            and much more — all at unbeatable prices with fast delivery.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/products">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Shop Now
              </button>
            </Link>

            <Link to="/products">
              <button className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1">
                Browse Categories
              </button>
            </Link>
          </div>

          {/* Quick Category Tags */}
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="px-4 py-1 bg-gray-100 rounded-full">💻 Laptops</span>
            <span className="px-4 py-1 bg-gray-100 rounded-full">📱 Mobiles</span>
            <span className="px-4 py-1 bg-gray-100 rounded-full">🎧 Headphones</span>
            <span className="px-4 py-1 bg-gray-100 rounded-full">⌚ Smart Gadgets</span>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="flex justify-center items-center relative">
          <img
            src="/delivery.png"
            alt="AllinOneBazar Products"
            className="w-full max-w-lg drop-shadow-2xl rounded-2xl"
            style={{ animation: "floatY 5s ease-in-out infinite" }}
          />

          <style>
            {`
              @keyframes floatY {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
              }
            `}
          </style>
        </div>
      </div>
    </section>
  );
};

export default Hero;