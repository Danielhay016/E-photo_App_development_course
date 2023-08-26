const express = require('express');
const router = express.Router();
const C_location = require('../controllers/location');
const storeLocations = require('../data/location'); 
const adminAuthMiddleware = require('../middleware/adminAuth'); // Import your admin authentication middleware

// getall
router.get("/api/store-location", (req, res) => {
  C_location.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching store location data:', error);
      res.status(500).json({ error: 'Failed to fetch store locations' });
    });
});

// only admin - update
router.put("/", adminAuthMiddleware, (req, res) => {
    C_location.updateLocation(req.body).then((data) => {
        res.json(data);
    })
});

// only admin - delete
router.delete("/", adminAuthMiddleware, (req, res) => {
    C_location.deleteLocation(req.body._id).then((data) => {
        res.json(data);
    })
});

// only admin - create
router.post('/api/add-location', adminAuthMiddleware, async (req, res) => {
    const { name, lat, lng } = req.body;
    try {
      const newLocation = await C_location.addLocation(name, lat, lng);
      res.json({ message: 'Location added successfully', location: newLocation });
    } catch (error) {
      console.error('Error adding location:', error);
      res.status(500).json({ error: 'Failed to add location' });
    }
  });


// Load and add locations from data when starting the server
router.post('/api/add-data-locations', async (req, res) => {
    try {
      const result = await C_location.addLocationsFromData(storeLocations);
      res.json(result);
    } catch (error) {
      console.error('Error adding store locations from data:', error);
      res.status(500).json({ error: 'Failed to add store locations from data' });
    }
  });



  
module.exports = router;