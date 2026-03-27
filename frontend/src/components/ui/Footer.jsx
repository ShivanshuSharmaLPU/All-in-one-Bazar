import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebook,
    FaInstagram,
    FaPinterest,
    FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 py-10">

            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">

                {/* Company Info */}
                <div>
                    <Link to="/">
                        <img
                            src="/allinonebazar.png"
                            alt="Allinonebazar Logo"
                            className="w-32"
                        />
                    </Link>

                    <p className="mt-3 text-sm">
                        Powering Your World with the Best Products at Allinonebazar.
                    </p>

                    <p className="text-sm mt-2">
                        123 Market Street, India
                    </p>

                    <p className="text-sm">
                        Email: support@allinonebazar.com
                    </p>

                    <p className="text-sm">
                        Phone: +91 9876543210
                    </p>
                </div>


                {/* Customer Service */}
                <div>

                    <h3 className="text-xl font-semibold text-yellow-400">
                        Customer Service
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm">

                        <li className="hover:text-green-400 cursor-pointer">
                            Contact Us
                        </li>

                        <li className="hover:text-green-400 cursor-pointer">
                            Shipping & Returns
                        </li>

                        <li className="hover:text-green-400 cursor-pointer">
                            FAQs
                        </li>

                        <li className="hover:text-green-400 cursor-pointer">
                            Order Tracking
                        </li>

                        <li className="hover:text-green-400 cursor-pointer">
                            Size Guide
                        </li>

                    </ul>

                </div>


                {/* Social Media */}
                <div>

                    <h3 className="text-xl font-semibold text-yellow-400">
                        Follow Us
                    </h3>

                    <div className="flex space-x-4 mt-4 text-2xl">

                        <FaFacebook className="cursor-pointer hover:text-orange-500" />

                        <FaInstagram className="cursor-pointer hover:text-orange-500" />

                        <FaTwitterSquare className="cursor-pointer hover:text-orange-500" />

                        <FaPinterest className="cursor-pointer hover:text-orange-500" />

                    </div>

                </div>


                {/* Newsletter */}
                <div>

                    <h3 className="text-xl font-semibold text-yellow-400">
                        Stay in the Loop
                    </h3>

                    <p className="mt-3 text-sm">
                        Subscribe to get special offers and updates
                    </p>


                    <form className="mt-4 flex">

                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full p-2 rounded-l-md text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />



                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-green-600 px-4 text-white rounded-r-md transition"
                        >
                            Subscribe
                        </button>

                    </form>

                </div>


            </div>



            {/* Bottom Section */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">

                <p>
                    © {new Date().getFullYear()}{" "}
                    <span className="text-orange-500 font-semibold">
                        Allinonebazar
                    </span>{" "}
                    . All Rights Reserved.
                </p>

            </div>

        </footer>
    );
};

export default Footer;
