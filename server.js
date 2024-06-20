import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dataBaseConnection } from "./config/database.js";
import { indexRoutes } from "./routes/index.js";

// Configuring the environmental variable
dotenv.config();

// Server Setup
const app = express();
const PORT = process.env.PORT || 9000;

// CORS Configuration
const corsOptions = {
  origin: 'https://agrpremiumplan.in', // allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // allowed HTTP methods
  credentials: true, // allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204 // response status for successful OPTIONS requests
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// Database Connection
dataBaseConnection();

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
