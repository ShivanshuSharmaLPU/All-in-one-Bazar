import React, { useState, useEffect } from "react";
import axios from "axios";
import {  AppWindowIcon, Loader2, LockIcon, ShoppingBagIcon } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userLogo from "../assets/userlogo.png";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const token = localStorage.getItem("accesstoken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/user/get-user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setForm({
            firstName: res.data.user.firstName || "",
            lastName: res.data.user.lastName || "",
            email: res.data.user.email || "",
            phoneNo: res.data.user.phoneNo || "",
            address: res.data.user.address || "",
            city: res.data.user.city || "",
            zipCode: res.data.user.zipCode || ""
          });
          setPreview(res.data.user.profilePic);
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchUser();
  }, [user, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const img = e.target.files[0];
    if (img) {
      setFile(img);
      setPreview(URL.createObjectURL(img));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));
      if (file) data.append("file", file);

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${user._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setPreview(res.data.user.profilePic);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="pt-24 min-h-screen flex justify-center items-center">
      <Loader2 className="animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="pt-24 min-h-screen flex justify-center bg-gradient-to-br from-orange-50 to-gray-100 px-4">
      <Tabs defaultValue="profile" className="w-full max-w-[720px]">
        <TabsList className="grid grid-cols-3 mb-6 bg-white border">
          <TabsTrigger value="profile">
            <AppWindowIcon size={16} className="mr-2" />Profile
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBagIcon size={16} className="mr-2" />Orders
          </TabsTrigger>
          <TabsTrigger value="password">
            <LockIcon size={16} className="mr-2" />Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-orange-600">Update Profile</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <img 
                  src={preview || userLogo}
                  className="w-28 h-28 rounded-full object-cover border-4 border-orange-500 shadow-md" 
                />
                <Label className="mt-4 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm transition shadow-sm">
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleFile} />
                </Label>
              </div>

              <form onSubmit={updateProfile} className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
                  <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
                </div>

                <Input value={form.email} disabled className="bg-gray-50 italic text-gray-400" />
                <Input name="phoneNo" placeholder="Phone Number" value={form.phoneNo} onChange={handleChange} />
                <Input name="address" placeholder="Shipping Address" value={form.address} onChange={handleChange} />

                <div className="grid grid-cols-2 gap-3">
                  <Input name="city" placeholder="City" value={form.city} onChange={handleChange} />
                  <Input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} />
                </div>

                <Button 
                  disabled={updating}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 transition-all rounded-lg"
                >
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>

        <TabsContent value="password">
           <Card className="shadow-lg border-none p-10 text-center">
              <p className="text-gray-500">Security settings coming soon.</p>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;










