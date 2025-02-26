// src/app.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { SupabaseService } from "./supabase.service";

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server and initialize services
const startServer = async () => {
  try {
    // Initialize Supabase service when server starts
    const supabaseService = SupabaseService.getInstance();
    await supabaseService.start();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
