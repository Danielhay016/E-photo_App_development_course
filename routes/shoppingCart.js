const  express = require('express');
const  router = express.Router();
const  C_ShoppingCart  = require('../controllers/shoppingCart'); 
//const Basket = require('../data/products'); // Import the products data -- > check later if i need this one . 
const adminAuthMiddleware = require('../middleware/adminAuth'); // Import your admin authentication middleware


//admin can see all shopping carts 
router.get("/api/cart", adminAuthMiddleware ,(req, res) => {
  C_ShoppingCart.getAll()
    .then((data) => {
      console.log(data)
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching Product  data:', error);
      res.status(500).json({ error: 'Failed to fetch Products ' });
    });
});

//only admin
router.put("/api/cart", adminAuthMiddleware, (req, res) => {
  C_ShoppingCart.updateCart(req.body).then((data) => {
        res.json(data);
    })
});
//for users 
router.put("/api/cart", (req, res) => {
  C_ShoppingCart.updateCart(req.body).then((data) => {
        res.json(data);
    })
});

// only admin
router.delete("/api/cart", adminAuthMiddleware, (req, res) => {
  C_ShoppingCart.deleteCart(req.body._id).then((data) => {
        res.json(data);
    })
});
// only users
router.delete("/api/cart", (req, res) => {
  C_ShoppingCart.deleteCart(req.body._id).then((data) => {
        res.json(data);
    })
});

/*
// only admin -
router.post('/api/cart/add', adminAuthMiddleware, async (req, res) => {
  const { productIds } = req.body;

  try {
    const newProduct = await C_ShoppingCart.addProductsToCart(productIds);
    res.json({ message: 'Products added to cart successfully', products: newProduct });
  } catch (error) {
    console.error('Error adding products:', error);
    res.status(500).json({ error: 'Failed to add products' });
  }
});
*/

router.post('/api/cart/add', (req, res) => {
  C_ShoppingCart.addToCart(req.body._id)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Error add to cart:', error);
      res.status(500).json({ error: 'An error occurred while adding the cart' });
    });
});


  
  

module.exports = router;
 