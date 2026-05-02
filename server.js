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

// 🔥 Adzuna Jobs API (India)
app.get("/jobs", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.adzuna.com/v1/api/jobs/in/search/1",
      {
        params: {
          app_id: process.env.APP_ID,
          app_key: process.env.APP_KEY,
          results_per_page: 50,
          what: "developer",
          where: "India",
        },
          headers: {
          Referer: process.env.BASE_URL || ""
    }
      }
    );

    console.log("FULL DATA:", response.data);

    // 🔥 Convert to YOUR frontend format
    const jobs = response.data.results.map((job) => ({
      title: job.title,
      company: job.company?.display_name || "Unknown",
      locations: job.location?.display_name || "India",
      url: job.redirect_url,
      description: job.description,
      salary: job.salary_min
        ? `₹${job.salary_min} - ₹${job.salary_max || job.salary_min}`
        : "Not specified",
    }));

    res.json({ jobs });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "API Failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});