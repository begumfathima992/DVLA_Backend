import { Router } from "express";
import axios from "axios";

const router = Router();


router.post('/search',async (req, res) => {
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
export  default router;