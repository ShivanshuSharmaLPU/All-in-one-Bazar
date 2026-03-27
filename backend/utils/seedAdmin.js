import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@allinonebazar.com";
    const existing = await User.findOne({ email: adminEmail });

    if (!existing) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
        isLoggedIn: false,
      });
      console.log("✅ Admin account created:");
      console.log("   Email   : admin@allinonebazar.com");
      console.log("   Password: Admin@123");
    } else if (existing.role !== "admin") {
      existing.role = "admin";
      existing.isVerified = true;
      await existing.save();
      console.log("✅ Existing admin account updated");
    } else {
      console.log("✅ Admin account already exists");
    }
  } catch (error) {
    console.error("❌ Admin seed error:", error.message);
  }
};

export default seedAdmin;