require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Server Working 🚀");
});

// Careerjet API route
app.get("/jobs", async (req, res) => {
  try {
    const response = await axios.get(
      "http://public.api.careerjet.net/search",
      {
        params: {
          keywords: "developer",
          location: "India",
          page: 4,
          pagesize: 80,
          affid: process.env.API_KEY,

          // REQUIRED
          user_ip: req.ip || "127.0.0.1",
          user_agent: req.headers["user-agent"] || "Mozilla/5.0",
        },
        headers: {
          Referer: process.env.BASE_URL || ""
        }
      }
    );

    console.log("FULL DATA:", response.data);

    res.json(response.data);




  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "API Failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});
