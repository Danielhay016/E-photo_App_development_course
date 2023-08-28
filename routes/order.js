const express = require('express');
const router = express.Router();
const orderControllers  = require('../controllers/order');


// Create a new order
router.post('/api/create', orderControllers.createOrder);


// Get all orders
router.get('/api/orders', async (req, res) => {
    try {
        const orders = await orderControllers.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: `Error getting all orders: ${error.message}` });
    }
});


// Get an order by ID
router.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  console.log(orderId);
  orderControllers.getOrderByID(orderId)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    })
    .catch((error) => {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Failed to fetch order details' });
    });
}); 



// Get orders for the currently logged-in user
router.get('/api/orders/current-user', async (req, res) => {
    try {
        const currentUserEmail = req.params.email;
        const orders = await orderControllers.getOrdersForCurrentUser(currentUserEmail);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: `Error getting orders for the current user: ${error.message}` });
    }
});


// Edit an order by ID
router.put('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedData = req.body;
        const updatedOrder = await orderControllers.editOrder(orderId, updatedData);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: `Error editing order: ${error.message}` });
    }

});


// Delete an order by ID
router.delete('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const result = await orderControllers.deleteOrder(orderId);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: `Error deleting order: ${error.message}` });
    }
});

router.get('/api/all-orders', orderControllers.getAllOrders);

module.exports = router;