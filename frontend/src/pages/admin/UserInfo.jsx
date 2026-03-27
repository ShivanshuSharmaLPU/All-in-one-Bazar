import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import userLogo from "../../assets/userlogo.png";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "user"
  });

  const token = localStorage.getItem("accesstoken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/user/get-user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          const u = res.data.user;
          setForm({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email || "",
            phoneNo: u.phoneNo || "",
            address: u.address || "",
            city: u.city || "",
            zipCode: u.zipCode || "",
            role: u.role || "user"
          });
          setPreview(u.profilePic);
        }
      } catch (err) {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id, token]);

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
    setUpdating(true);

    try {
      const data = new FormData();
      data.append("firstName", form.firstName);
      data.append("lastName", form.lastName);
      data.append("phoneNo", form.phoneNo);
      data.append("address", form.address);
      data.append("city", form.city);
      data.append("zipCode", form.zipCode);
      data.append("role", form.role);

      if (file) data.append("file", file);

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("User updated successfully");
        navigate("/dashboard/users"); // Redirect back to list
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="pt-24 min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="pt-5 pb-10 min-h-screen flex flex-col items-center bg-gray-50">
      <div className="w-full max-w-[720px] px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft size={18} />
          </Button>
          <h1 className="font-bold text-2xl text-gray-800">Update User</h1>
        </div>

        <Card className="border-none shadow-lg">
          {/* <CardHeader className="bg-pink-50 rounded-t-lg border-b border-pink-100">
            <CardTitle className="text-pink-600">User Settings</CardTitle>
            <CardDescription>Modify account details and permissions</CardDescription>
          </CardHeader> */}
          
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            
            {/* Profile Picture Column */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img 
                  src={preview || userLogo} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-200" 
                />
                <Label className="absolute bottom-1 right-1 bg-orange-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-orange-700 transition-colors">
                  <Edit size={14} />
                  <input type="file" hidden accept="image/*" onChange={handleFile} />
                </Label>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase">Profile Photo</p>
            </div>

            {/* Form Column */}
            <form onSubmit={updateProfile} className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500">First Name</Label>
                  <Input name="firstName" value={form.firstName} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500">Last Name</Label>
                  <Input name="lastName" value={form.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500">Email Address</Label>
                <Input value={form.email} disabled className="bg-gray-100 cursor-not-allowed" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500">Phone Number</Label>
                <Input name="phoneNo" value={form.phoneNo} onChange={handleChange} />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-500">Home Address</Label>
                <Input name="address" value={form.address} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500">City</Label>
                  <Input name="city" value={form.city} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500">Zip Code</Label>
                  <Input name="zipCode" value={form.zipCode} onChange={handleChange} />
                </div>
              </div>

              {/* Role Radio Group */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                <Label className="text-sm font-bold text-gray-700">Account Permission (Role)</Label>
                <RadioGroup 
                  value={form.role} 
                  onValueChange={(value) => setForm({...form, role: value})}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" className="text-orange-600" />
                    <Label htmlFor="user" className="cursor-pointer">Regular User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" className="text-orange-600" />
                    <Label htmlFor="admin" className="cursor-pointer font-bold text-orange-600">Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                disabled={updating} 
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-11"
              >
                {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Save User Changes"}
              </Button>
            </form>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInfo;