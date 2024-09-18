// api/products.js
const products = []; // Replace with a database in production

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(products);
  }
  // Add POST, PUT, DELETE methods to manage products
};
