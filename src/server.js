import dns from "node:dns";
// Set Node to use Cloudflare DNS
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import "dotenv/config";
import app from "./app.js";
import connectDB from "./utils/connectDB.js";

const PORT = process.env.PORT || 3031;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.log(`MongoDB connection error`);
  });
