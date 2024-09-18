const products = []; // Replace with a database in production
let nextId = 1; // Variable to keep track of product IDs

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    try {
      const newProduct = req.body; // Assuming you're sending product data in the body
      newProduct.id = nextId++; // Assign a unique ID to the new product
      products.push(newProduct); // Add to products array
      return res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query; // Get the product ID from the query parameters
    const productIndex = products.findIndex(product => product.id === Number(id));

    if (productIndex !== -1) {
      products.splice(productIndex, 1); // Remove the product from the array
      return res.status(204).end(); // Respond with no content
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  }

  // Handle other methods (PUT, etc.) as needed
  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
