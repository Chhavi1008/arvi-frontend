const bar= document.getElementById('bar');
const close= document.getElementById('close');
const nav= document.getElementById('navbar')

if(bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if(close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

//modal popup
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("login-modal");
    const loginBtn = document.getElementById("login-btn");
    const closeBtn = document.querySelector(".close");

    const signUpButton = document.getElementById("signUpButton");
    const signInButton = document.getElementById("signInButton");

    const signInForm = document.getElementById("SignIn");
    const signUpForm = document.getElementById("Signup");

    // Open Login Popup
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "flex";
    });

    // Close Popup
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close when clicking outside the modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Show Sign Up Form
    signUpButton.addEventListener("click", function () {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
    });

    // Show Sign In Form
    signInButton.addEventListener("click", function () {
        signUpForm.style.display = "none";
        signInForm.style.display = "block";
    });
});

//newsletter sign up
document.addEventListener("DOMContentLoaded", function () {
    const newsletterButton = document.getElementById("newsletter-signup");
    const loginModal = document.getElementById("login-modal");

    if (newsletterButton && loginModal) {
        newsletterButton.addEventListener("click", function () {
            loginModal.style.display = "flex"; // ✅ Open the login modal
        });
    }
});


//login modal backend

document.addEventListener("DOMContentLoaded", function () {
    // 🔹 Register User
    document.querySelector("#Signup form").addEventListener("submit", async function (e) {
        e.preventDefault();
        const firstName = document.getElementById("fname").value;
        const lastName = document.getElementById("lname").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;

        const response = await fetch("https://arvi-backend.onrender.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        const result = await response.json();
        alert(result.message);
    });

    // 🔹 Login User
    document.querySelector("#SignIn form").addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("signin-email").value;
        const password = document.getElementById("signin-password").value;

        const response = await fetch("https://arvi-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (result.success) {
            localStorage.setItem("user", JSON.stringify({
                firstName: result.user.firstName,
                email: result.user.email,
                token: result.token // ✅ Add token
            }));
            document.querySelector(".user-text").innerText = result.user.firstName;
            document.getElementById("login-modal").style.display = "none";
            alert("Login successful!");
        } else {
            alert(result.message);
        }
    });

    // 🔹 Logout Functionality
    document.getElementById("login-btn").addEventListener("click", function () {
        if (localStorage.getItem("user")) {
            localStorage.removeItem("user");
            document.querySelector(".user-text").innerText = "Login";

            cart = [];
            localStorage.removeItem("cart");
             updateCartUI();
             updateCartCount();

            localStorage.setItem("loggedOut", "true");

            alert("Logged out successfully!");
            // ✅ Refresh the page after logout
            setTimeout(() => {
                window.location.reload();
            }, 0);

        }
    });

    // 🔹 Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.querySelector(".user-text").innerText = user.firstName;
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("login-modal");
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ Fix: Prevent login modal from popping up after logout
    if (localStorage.getItem("loggedOut") === "true") {
        localStorage.removeItem("loggedOut"); // Remove flag after checking
        if (modal) modal.style.display = "none";
        return;
    }

    // ✅ Fix: Only show modal when clicking login, not automatically
    if (user) {
        document.querySelector(".user-text").innerText = user.firstName;
    } else {
        if (modal) modal.style.display = "none"; // Ensure modal stays closed
    }
});


// Cart Functionality
const cartIcon = document.querySelector("#cart-icon");
const cart2 = document.querySelector(".cart2");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", () => cart2.classList.add("active"));
cartClose.addEventListener("click", () => cart2.classList.remove("active"));

// Select the mobile shopping bag icon
document.querySelector("#mobile .fa-shopping-bag").addEventListener("click", function() {
    // Trigger the same action as clicking the desktop cart icon
    document.getElementById("cart-icon").click();
});

// Add event listener to cart icon for testing
document.getElementById("cart-icon").addEventListener("click", function() {
});

// add products
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cart").forEach(button => {
        button.removeEventListener("click", addProductToCart); // ✅ Prevents duplicate event listeners
        button.addEventListener("click", addProductToCart);
    });

    updateCartCount();
    updateCartUI();
});
function addProductToCart(event) {
            let productElement = event.target.closest(".pro");
            let title = productElement.querySelector("h5")?.innerText || "Unknown Product";
            let priceText = productElement.querySelector("h4")?.innerText || "₹0";
            let price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
            let imgSrc = productElement.querySelector("img")?.src || "";

            if (!price || isNaN(price)) {
                price = 0; // Default price to prevent NaN issues
            }

            addToCart(title, price, imgSrc);
        }

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to add item to the cart
function addToCart(title, price, imgSrc) {
    let existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, imgSrc, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    updateCartCount();
    alert("Your item is added to cart!");
}

// Function to update the cart UI
function updateCartUI() {
    let cartContent = document.querySelector(".cart-content");
    let totalPriceElement = document.querySelector(".total-price");
    cartContent.innerHTML = "";
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        cartContent.innerHTML += `
            <div class="cart-box">
                <img src="${item.imgSrc}" class="cart-img" onerror="this.src='fallback-image.jpg';">
                <div class="cart-details">
                    <h2 class="cart-product-title">${item.title}</h2>
                    <span class="cart-price">₹${item.price}</span>
                    <div class="cart-quantity">
                        <button class="decrement" onclick="updateQuantity('${item.title}', -1)">-</button>
                        <span class="number">${item.quantity}</span>
                        <button class="increment" onclick="updateQuantity('${item.title}', 1)">+</button>
                    </div>
                </div>
                <i class="fa fa-trash cart-remove" onclick="removeFromCart('${item.title}')"></i>
            </div>
        `;
    });

    totalPriceElement.innerText = `₹${totalPrice.toFixed(1)}`;

    saveCart();
}

// Function to update quantity
function updateQuantity(title, change) {
    let item = cart.find(item => item.title === title);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.title !== title);
        }
    }
    saveCart();
    updateCartUI();
    updateCartCount();
}

// Function to remove item from cart
function removeFromCart(title) {
    cart = cart.filter(item => item.title !== title);
    saveCart();
    updateCartUI();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
    const buyNowButton = document.querySelector(".btn-buy");
    const cartContent = document.querySelector(".cart-content");
    const totalPriceElement = document.querySelector(".total-price");

    if (buyNowButton) {
        buyNowButton.addEventListener("click", async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;

            if (!token) {
                alert("⚠️ Please log in before placing an order!");
                document.getElementById("login-modal").style.display = "flex"; // Open login modal
                return;
            }

            // Retrieve cart from local storage
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                alert("🛒 Your cart is empty. Please add items before purchasing.");
                return;
            }

            // Format cart data to include product name
            const formattedCart = cart.map(item => ({
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                imgSrc: item.imgSrc
            }));

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            try {
                console.log("🛒 Sending order to backend:", { items: formattedCart, total: totalPrice });
                console.log("🔑 Token Sent:", token);

                const response = await fetch("https://arvi-backend.onrender.com/api/orders/place-order", { 
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ 
                        items: formattedCart, 
                        total: totalPrice, 
                    })
                });

                console.log("🛒 Sending Order:", { items: formattedCart, total: totalPrice });

                const result = await response.json();
                console.log("🛒 Order Response:", result);

                if (response.ok) {
                    alert("✅ Order placed successfully!");

                    // Clear cart after successful order
                    localStorage.removeItem("cart");
                    cartContent.innerHTML = "";
                    totalPriceElement.innerText = "₹0.00";
                    updateCartCount(0);
                } else {
                    alert(`❌ Order failed: ${result.error || "Please try again."}`);
                }
            } catch (error) {
                console.error("❌ Error placing order:", error);
                alert("❌ Error placing order! Check console for details.");
            }
        });
    }
    updateCartCount();
});


//cart item count badge

const updateCartCount = (count = null) => {
    const cartItemCountBadges = document.querySelectorAll(".cart-item-count"); // Select both desktop & mobile badges

    let totalItems;
    if (count !== null) {
        totalItems = count; // Set count if provided (e.g., after placing an order)
    } else {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    cartItemCountBadges.forEach((badge) => {
        if (totalItems > 0) {
            badge.style.visibility = "visible";
            badge.textContent = totalItems;
        } else {
            badge.style.visibility = "hidden";
            badge.textContent = "";
        }
    });
};

//form submission

document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('https://arvi-backend.onrender.com/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });

        const result = await response.json();
        document.getElementById('responseMessage').textContent = result.message;

        if (result.success) {
            document.getElementById('contactForm').reset();
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = 'Something went wrong. Please try again!';
    }
});