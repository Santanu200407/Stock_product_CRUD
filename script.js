document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();
    fetchCart();
});

function fetchProducts() {
    fetch("http://localhost:3000/products") 
        .then(res => res.json())
        .then(products => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";

            products.forEach(product => {
                productList.innerHTML += `
                    <div class="product">
                        <p><strong>${product.name}</strong> - ₹${product.price}</p>
                        <input type="number" id="qty-${product.id}" min="1" value="1">
                        <button onclick="addToCart(${product.id})">Stock</button>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error fetching products:", error));
}


function addToCart(productId) {
    const quantity = document.getElementById(`qty-${productId}`).value;

    fetch("http://localhost:3000/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: quantity })
    })
    .then(res => res.json())
    .then(response => {
        alert(response.message);
        fetchCart();
    })
    .catch(error => console.error("Error adding to cart:", error));
}

function fetchCart() {
    fetch("http://localhost:3000/cart") // 
        .then(res => res.json())
        .then(cartItems => {
            const cartList = document.getElementById("cart-list");
            cartList.innerHTML = "";

            cartItems.forEach(item => {
                cartList.innerHTML += `
                    <div class="cart-item">
                        <p><strong>${item.name}</strong> - ₹${item.price} x ${item.quantity}</p>
                        <button onclick="removeFromCart(${item.id})">Discard</button>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error fetching cart:", error));
}


function removeFromCart(cartId) {
    fetch(`http://localhost:3000/cart/${cartId}`, { // 
        method: "DELETE"
    })
    .then(res => res.json())
    .then(response => {
        alert(response.message);
        fetchCart();
    })
    .catch(error => console.error("Error removing from cart:", error));
}
