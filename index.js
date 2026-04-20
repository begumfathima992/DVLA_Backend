// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/api/vehicle", async (req, res) => {
//   console.log("--- NEW REQUEST RECEIVED ---");
//   console.log("Incoming Body:", req.body);

//   // Clean VRN (VERY IMPORTANT as per DVLA rules)
//   const vrm = req.body.registrationNumber
//     ? req.body.registrationNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
//     : "";

//   if (!vrm) {
//     return res.status(400).json({
//       error: "Registration number is required",
//     });
//   }

//   try {
//     const response = await axios.post(
//       "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
//       {
//         registrationNumber: vrm,
//       },
//       {
//         headers: {
//           "x-api-key": "XaCZPPlWMt2PtLnZ3w5oha8nDLLLO9Gw1yUvSMr5", // 🔐 use env variable
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           "User-Agent": "curl/7.64.1",
//         },
//         timeout: 5000,
//       },
//     );

//     console.log(response, "--- DVLA SUCCESS ---");
//     return res.status(200).json(response.data);
//   } catch (error) {
//     console.error("--- DVLA ERROR ---");

//     if (error.response) {
//       console.error("Status:", error.response.status);
//       console.error("Full Response:", error.response);

//       const dvlaError =
//         error.response.data?.errors?.[0]?.detail ||
//         error.response.data?.error ||
//         error.response.data?.message ||
//         "DVLA API error";

//       return res.status(error.response.status).json({
//         error: dvlaError,
//       });
//     }

//     console.error("Message:", error.message);

//     return res.status(500).json({
//       error: error.message || "Internal server error",
//     });
//   }
// });

// // 4. Added a quick health check to verify the server is alive
// app.get("/status", (req, res) => res.send("Server is running!"));

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
//   console.log("Press Control+C to stop the server.");
// });

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/vehicle", async (req, res) => {
  // 1. Clean the VRM - Remove spaces and special characters
  const vrm = req.body.registrationNumber
    ? req.body.registrationNumber.replace(/\s+/g, "").toUpperCase()
    : "";

  if (!vrm) {
    return res
      .status(400)
      .json({ error: "Please provide a registration number" });
  }

  try {
    const response = await axios.post(
      "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      { registrationNumber: vrm },
      {
        headers: {
          // Ensure this key is active in your DVLA portal
          "x-api-key": "XaCZPPlWMt2PtLnZ3w5oha8nDLLLO9Gw1yUvSMr5",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 5000,
      },
    );

    // If successful, return the data
    return res.status(200).json(response.data);
  } catch (error) {
    // 2. FIXED ERROR HANDLING
    if (error.response) {
      // If status is 404, the car doesn't exist
      if (error.response.status === 404) {
        return res.status(404).json({
          error: `Vehicle with registration '${vrm}' was not found.`,
        });
      }

      // If status is 403, your API key is likely wrong
      if (error.response.status === 403) {
        return res
          .status(403)
          .json({ error: "Invalid API Key or Unauthorized access." });
      }

      // Return the specific error message from DVLA if available
      const dvlaMsg =
        error.response.data?.errors?.[0]?.detail || "DVLA API Error";
      return res.status(error.response.status).json({ error: dvlaMsg });
    }

    return res.status(500).json({ error: "Internal Server Connection Error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
