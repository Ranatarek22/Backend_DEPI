const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors"); // Import the cors package
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow React app from this origin
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    credentials: true, // Allow cookies or other credentials
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello from Express with MongoDB Atlas!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
