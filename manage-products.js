document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const qty = document.getElementById('product-qty').value;

        await addProduct({ name, price, qty });
        fetchProducts(); // Refresh product list
    });
});

// Fetch and display products
async function fetchProducts() {
    const response = await fetch('https://warung-agen.vercel.app/api/products', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    });
    const products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <h4>${product.name} - Rp${product.price} Qty: ${product.qty}</h4>
            <button onclick="removeProduct(${product.id})">Remove</button>
        `;
        productList.appendChild(productItem);
    });
}

// Add a new product or update an existing one
async function addProduct(product) {
    const response = await fetch('https://warung-agen.vercel.app/api/products', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    });
    const existingProducts = await response.json();

    // Check if the product already exists
    const existingProduct = existingProducts.find(p => p.name === product.name);

    if (existingProduct) {
        // Update existing product
        const updatedProduct = {
            name: product.name,
            price: product.price,
            qty: Number(existingProduct.qty) + Number(product.qty) // Sum the quantities
        };
        
        await fetch(`https://warung-agen.vercel.app/api/products/${existingProduct.id}`, {
            method: 'PATCH', // Use PATCH if that's the correct method for updating
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(updatedProduct)
        });
    } else {
        // Create new product
        await fetch('https://warung-agen.vercel.app/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(product)
        });
    }
}

// Remove a product
async function removeProduct(productId) {
    await fetch(`https://warung-agen.vercel.app/api/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    });
    fetchProducts(); // Refresh product list
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}
