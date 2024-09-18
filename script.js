document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Product 1', price: 10000 },
    { id: 2, name: 'Product 2', price: 20000 },
  ];

  let cart = [];

  const displayProducts = () => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: ${product.price}</p>
        <input type="number" id="quantity-${product.id}" value="1" min="1" />
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(productItem);
    });
  };

  window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value, 10) || 1;

    if (product) {
      for (let i = 0; i < quantity; i++) {
        cart.push(product);
      }
      updateCartDisplay();
      alert(`${product.name} added to cart with quantity ${quantity}!`);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  const updateCartDisplay = () => {
    const cartItems = document.getElementById('cart-items');
    if (cart.length === 0) {
      cartItems.innerHTML = 'No items in cart';
    } else {
      const groupedItems = cart.reduce((acc, product) => {
        if (!acc[product.id]) {
          acc[product.id] = { ...product, quantity: 0 };
        }
        acc[product.id].quantity += 1;
        return acc;
      }, {});

      const cartContent = Object.values(groupedItems).map(item => `
        <div id="cart-item-${item.id}">
          <h4>${item.name} x
            <input type="number" id="cart-quantity-${item.id}" value="${item.quantity}" min="1" onchange="updateItemQuantity(${item.id})" />
          </h4>
          <p>Price: ${item.price * item.quantity}</p>
          <button onclick="removeItem(${item.id})">Remove Item</button>
        </div>
      `).join('');
      cartItems.innerHTML = cartContent;
    }
  };

  window.updateItemQuantity = (productId) => {
    const quantityInput = document.getElementById(`cart-quantity-${productId}`);
    const newQuantity = parseInt(quantityInput.value, 10) || 1;

    cart = cart.filter(p => p.id !== productId);
    for (let i = 0; i < newQuantity; i++) {
      cart.push(products.find(p => p.id === productId));
    }
    updateCartDisplay();
  };

  window.removeItem = (productId) => {
    cart = cart.filter(p => p.id !== productId);
    updateCartDisplay();
  };

  document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const totalAmount = calculateTotalAmount();
    const orderDetails = {
      transaction_details: {
        order_id: 'order-id-' + new Date().getTime(),
        gross_amount: totalAmount,
      },
    };

    fetch('https://warung-agen-is16phg7c-hexagon66613s-projects.vercel.app/api/create_transaction', { // Update this URL
     method: 'POST',
     headers: {
      'Content-Type': 'application/json',
     },
     body: JSON.stringify(orderDetails),
    })

    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.token) {
        snap.pay(data.token);
      } else {
        throw new Error('No token received');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  displayProducts();
  updateCartDisplay();
});
