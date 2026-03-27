import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackagePlus, 
  PackageSearch, 
  Users, 
  ClipboardList,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const navLinkStyles = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-base w-full mb-1 ` +
    `${isActive 
      ? "bg-orange-500 text-white shadow-md shadow-orange-200" 
      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-4 flex flex-col sticky top-0">
      <div className="mb-8 px-4 py-2">
        <h1 className="text-2xl font-black text-orange-600 tracking-tight italic">
          STORE<span className="text-gray-800 not-italic">HUB</span>
        </h1>
      </div>

      <nav className="flex-1">
        <NavLink to="/dashboard" end className={navLinkStyles}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>

        <NavLink to="/dashboard/sales" className={navLinkStyles}>
          <BarChart3 size={20} />
          <span>Sales Analytics</span>
        </NavLink>

        <NavLink to="/dashboard/add-product" className={navLinkStyles}>
          <PackagePlus size={20} />
          <span>Add Product</span>
        </NavLink>

        <NavLink to="/dashboard/products" className={navLinkStyles}>
          <PackageSearch size={20} />
          <span>Manage Products</span>
        </NavLink>

        <NavLink to="/dashboard/orders" className={navLinkStyles}>
          <ClipboardList size={20} />
          <span>Customer Orders</span>
        </NavLink>

        <NavLink to="/dashboard/users" className={navLinkStyles}>
          <Users size={20} />
          <span>User Management</span>
        </NavLink>
      </nav>

      {/* <div className="mt-auto border-t border-gray-100 pt-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl text-white shadow-lg">
          <p className="text-xs opacity-80 font-medium">Logged in as</p>
          <p className="text-sm font-bold truncate text-white">Administrator</p>
          <button className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
            View Website
          </button>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;