import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullname: String,
  role: String,
  refreshToken: String
}, { timestamps: true });

const Admin = mongoose.model("Admin", AdminSchema);

const testLogin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    await mongoose.connect(`${mongoUri}/RemedyEaseDB`);
    console.log("✅ Connected to MongoDB");

    const admin = await Admin.findOne({ email: "yadaavatul7@gmail.com" });
    
    if (!admin) {
      console.log("❌ Admin not found in database");
      process.exit(1);
    }

    console.log("✅ Admin found:");
    console.log("Email:", admin.email);
    console.log("Fullname:", admin.fullname);
    console.log("Role:", admin.role);
    console.log("Password hash:", admin.password.substring(0, 20) + "...");

    // Test password
    const testPassword = "pass:@Atura07";
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    console.log("\n🔐 Password Test:");
    console.log("Testing password:", testPassword);
    console.log("Password matches:", isMatch ? "✅ YES" : "❌ NO");

    if (!isMatch) {
      console.log("\n⚠️ Password does not match! The stored hash is incorrect.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testLogin();
