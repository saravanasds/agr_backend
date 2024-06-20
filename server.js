import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dataBaseConnection } from "./config/database.js";
import { indexRoutes } from "./routes/index.js";
// import { initializeCounter } from "./config/initializeCounter.js";

// Configuring the environmental variable
dotenv.config();

// Server Setup
const app = express();
const PORT = process.env.PORT || 9000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE,OPTIONS', 
  allowedHeaders: 'Content-Type, Authorization' 
};

app.use(cors(corsOptions));

app.use("/uploads", express.static("uploads"));

// Database Connection
dataBaseConnection();

// await initializeCounter();

// Test Route
app.get("/", async (req, res) => {
  return res.status(200).send("This is AGR App Backend");
});

// Routes
app.use("/api", indexRoutes);

// Listening the Server
app.listen(PORT, () => {
  console.log(`Server Started on localhost:${PORT}`);
});
