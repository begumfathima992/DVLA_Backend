const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/vehicle', async (req, res) => {
  // 1. Log what Postman is sending to your server
  console.log("--- NEW REQUEST RECEIVED ---");
  console.log("Incoming Body:", req.body);

  const vrm = req.body.registrationNumber 
    ? req.body.registrationNumber.replace(/\s+/g, '').toUpperCase() 
    : '';

  if (!vrm) {
    return res.status(400).json({ error: "Registration number is required" });
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      headers: {
        'x-api-key': 'XaCZPPlWMt2PtLnZ3w5oha8nDLLLO9Gw1yUvSMr5',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 2. Override User-Agent to mimic a standard browser/curl
        'User-Agent': 'curl/7.64.1' 
      },
      data: { registrationNumber: vrm }, // Axios handles stringifying objects automatically
      timeout: 5000 // 5 second timeout
    });

    console.log("--- DVLA SUCCESS ---");
    res.json(response.data);

  } catch (error) {
    console.error("--- DVLA REJECTION ---");
    
    // 3. Log the FULL error response from DVLA to your terminal
    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Error Detail:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error Message:", error.message);
    }

    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.errors?.[0]?.detail || error.message || 'Forbidden' 
    });
  }
});

// 4. Added a quick health check to verify the server is alive
app.get('/status', (req, res) => res.send('Server is running!'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log("Press Control+C to stop the server.");
});