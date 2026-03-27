import React, { useEffect, useState } from "react";
import { Edit, Eye, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserLogo from "../../assets/userlogo.png";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accesstoken");

  const getAllUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/v1/user/all-user`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => { getAllUsers(); }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const url = `${import.meta.env.VITE_URL}/api/v1/user/delete/${userId}`;
    alert("Calling: " + url + " | Token: " + (accessToken ? "YES" : "NO"));
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User deleted successfully");
        setUsers(prev => prev.filter(u => u._id !== userId));
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    }
  };

  const filteredUsers = users?.filter((user) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-gray-800">User Management</h1>
          <p className="text-gray-500">View and manage registered users</p>
        </div>

        <div className="flex relative w-[400px] mt-6">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5 z-10" />
          <Input
            className="pl-10 bg-white border-gray-200 shadow-sm"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="relative bg-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                
                {/* Delete X button - show for everyone except self */}
                {user._id !== loggedInUserId && (
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white transition-all z-10"
                    title="Delete user"
                  >
                    <X size={14} />
                  </button>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.profilePic || UserLogo}
                      alt="Profile"
                      className="rounded-full w-16 h-16 aspect-square object-cover border-2 border-orange-600 p-0.5 bg-white"
                    />
                    <div className="min-w-0 flex-1 pr-6">
                      <h2 className="font-bold text-gray-800 truncate text-lg">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-xs text-gray-500 truncate mb-1">{user.email}</p>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "admin" ? "bg-purple-600 text-white" : "bg-pink-600 text-white"
                      }`}>
                        {user.role || "user"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-pink-100">
                    <Button
                      onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white hover:bg-orange-100 text-orange-600 border-pink-200 h-9"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
                      size="sm"
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-9"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Orders
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400 italic bg-white rounded-xl border-2 border-dashed">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;