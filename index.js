const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors("*"));
app.use(express.json());

// Test route to ensure it works
app.get('/', (req, res) => {
  res.json({ message: "Server is perfectly alive!" });
});



app.post('/api/save-vehicle',async (req, res) => {
  console.log('Received vehicle data to save:', req.body);
  const vrm = req.body.registrationNumber?.replace(/\s+/g, '').toUpperCase();
  if (!vrm) return res.status(400).json({ error: "Registration number required" });

  try {
    const response = await axios({
      method: 'post',
      url: 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      headers: {
        'x-api-key': 'eecCgl0PmtaW9pPLHYssh4fyOga5vo3K3d7L67R4',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      data: { registrationNumber: vrm }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching vehicle data:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({ error: error.message });
  }
});



// Using Port 5050 to break away from any locked background ports
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server safely locked and running on port ${PORT}`);
});