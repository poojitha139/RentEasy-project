const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./config/models/UserModel");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const admin = new User({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        type: "admin",
        isApproved: true,
      });

      await admin.save();
      console.log("🎉 Admin created successfully.");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    mongoose.disconnect();
  }
};

createAdmin();