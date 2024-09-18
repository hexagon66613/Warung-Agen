document.addEventListener('DOMContentLoaded', () => {
    let products = []; // Start with an empty array to fetch products from the API
    let cart = [];

    // Function to fetch products from the API
    const fetchProducts = () => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                products = data; // Update the products array with the fetched data
                displayProducts(); // Call displayProducts after fetching
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    // Function to display products
    const displayProducts = () => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: Rp${product.price}</p>
                <input type="number" id="quantity-${product.id}" value="1" min="1" />
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productItem);
        });
    };

    // Function to add products to cart
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

    // Function to calculate total amount
    const calculateTotalAmount = () => {
        return cart.reduce((total, product) => total + product.price, 0);
    };

    // Function to update cart display
    const updateCartDisplay = () => {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = ''; // Clear previous cart items

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
                    <p>Price: Rp${item.price * item.quantity}</p>
                    <button onclick="removeItem(${item.id})">Remove Item</button>
                </div>
            `).join('');
            cartItems.innerHTML = cartContent;

            // Calculate and display the total amount
            const totalAmount = calculateTotalAmount();
            const totalDisplay = document.createElement('div');
            totalDisplay.innerHTML = `<strong>Total Amount: Rp${totalAmount}</strong>`;
            cartItems.appendChild(totalDisplay);
        }
    };

    // Function to update item quantity
    window.updateItemQuantity = (productId) => {
        const quantityInput = document.getElementById(`cart-quantity-${productId}`);
        const newQuantity = parseInt(quantityInput.value, 10) || 1;

        cart = cart.filter(p => p.id !== productId);
        for (let i = 0; i < newQuantity; i++) {
            cart.push(products.find(p => p.id === productId));
        }
        updateCartDisplay();
    };

    // Function to remove an item completely from the cart
    window.removeItem = (productId) => {
        cart = cart.filter(p => p.id !== productId);
        updateCartDisplay();
    };

    // Event listener for checkout button
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

        fetch('https://warung-agen.vercel.app/api/create_transaction', {
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

    // Fetch products on page load
    fetchProducts();
});
