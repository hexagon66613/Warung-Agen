// api/products.js
const products = []; // Replace with a database in production

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    try {
      const newProduct = req.body; // Assuming you're sending product data in the body
      // Validate the new product data as needed
      products.push(newProduct); // Add to products array
      return res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle other methods (PUT, DELETE) as needed
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
