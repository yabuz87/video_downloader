import dotenv from 'dotenv';
import express from 'express';
import Router from './route/route.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());             // Enable CORS
app.use(express.json());     // Parse JSON bodies (important for POST!)
app.use(express.urlencoded({ extended: false })); // Optional: support URL-encoded forms

app.use(Router);

// Default homepage route
app.get("/", (req, res) => {
  res.json({ message: "hey friend! here is your YouTube video downloader" });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
