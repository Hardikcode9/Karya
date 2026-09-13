require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");
const CustomerProfile = require("./models/CustomerProfile");

async function seedCustomers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const targetNames = ["Hardik", "Subhankar", "Sumit"];
    
    // Find all users who are customers
    const users = await User.find({ role: "customer" });
    
    let createdCount = 0;
    
    for (const user of users) {
      if (targetNames.some(name => user.name.toLowerCase().includes(name.toLowerCase()))) {
        // Create customer profile if it doesn't exist
        const exists = await CustomerProfile.findOne({ user: user._id });
        if (!exists) {
          await CustomerProfile.create({
            user: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            address: user.address,
          });
          console.log(`Created CustomerProfile for ${user.name}`);
          createdCount++;
        } else {
          console.log(`CustomerProfile already exists for ${user.name}`);
        }
      }
    }
    
    console.log(`Finished. Created ${createdCount} CustomerProfiles.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding customers:", error);
    process.exit(1);
  }
}

seedCustomers();
