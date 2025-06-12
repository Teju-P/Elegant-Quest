// Increase quantity
function increaseQuantity(button) {
  const quantityValue = button.previousElementSibling;
  let quantity = parseInt(quantityValue.textContent);
  quantityValue.textContent = quantity + 1;
}

// Decrease quantity
function decreaseQuantity(button) {
  const quantityValue = button.nextElementSibling;
  let quantity = parseInt(quantityValue.textContent);
  if (quantity > 0) {
    quantityValue.textContent = quantity - 1;
  }
}

// Save selected products to local storage
function saveCart() {
  const products = document.querySelectorAll('.product');
  const cart = [];
  let totalAmount = 0;

  products.forEach(product => {
    const productName = product.getAttribute('data-product-name');
    const productPrice = parseInt(product.getAttribute('data-product-price'));
    const quantity = parseInt(product.querySelector('.quantity-value').textContent);

    // Only add products with a quantity of at least 1
    if (quantity > 0) {
      cart.push({ name: productName, price: productPrice, quantity });
      totalAmount += productPrice * quantity; // Calculate total amount
    }
  });

  if (cart.length > 0) {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', totalAmount); // Save total amount
    alert(`Products added to cart! Total Amount: Rs. ${totalAmount}`);
  } else {
    alert('Please select an item to add it to the cart.');
  }
}

// Load cart data and display it in cart.html
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = localStorage.getItem('totalAmount') || 0;
  const cartTableBody = document.querySelector('#cart-table tbody');
  const totalAmountContainer = document.querySelector('.total-amount');

  cart.forEach(item => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const quantityCell = document.createElement('td');
    const priceCell = document.createElement('td');

    nameCell.textContent = item.name;
    quantityCell.textContent = item.quantity;
    priceCell.textContent = `Rs. ${item.price * item.quantity}`;

    row.appendChild(nameCell);
    row.appendChild(quantityCell);
    row.appendChild(priceCell);
    cartTableBody.appendChild(row);
  });

  // Display total amount
  totalAmountContainer.textContent = `Total Amount: Rs. ${totalAmount}`;
}

// Update quantity in the cart
function updateQuantity(productName, change) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const updatedCart = cart.map(item => {
    if (item.name === productName) {
      item.quantity = Math.max(0, item.quantity + change); // Ensure quantity doesn't go below 0
    }
    return item;
  });

  localStorage.setItem('cart', JSON.stringify(updatedCart));
  refreshCartTable();
}

// Refresh the cart table to reflect updated quantities
function refreshCartTable() {
  const cartTableBody = document.querySelector('#cart-table tbody');
  cartTableBody.innerHTML = ''; // Clear existing rows
  loadCart(); // Reload the cart data
}

// Automatically load cart data if on cart.html
if (window.location.pathname.includes('cart.html')) {
  loadCart();
}

// Show the popup for phone number
function placeOrder() {
  document.getElementById('phone-popup').classList.remove('hidden');
}

// Close the popup
function closePopup() {
  document.getElementById('phone-popup').classList.add('hidden');
}

// Submit the order
function submitOrder() {
  const phoneNumber = document.getElementById('phone-number').value;

  if (!phoneNumber) {
    alert('Please enter your phone number.');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = localStorage.getItem('totalAmount') || 0;

  if (cart.length === 0) {
    alert('Your cart is empty.');
    closePopup();
    return;
  }

  let emailContent = `Phone Number: ${phoneNumber}\n\nProducts:\n`;
  cart.forEach(item => {
    emailContent += `- ${item.name}: Quantity: ${item.quantity}, Price: Rs. ${item.price * item.quantity}\n`;
  });
  emailContent += `\nTotal Amount: Rs. ${totalAmount}`;

  emailjs.init('YOUR_USER_ID'); // Replace with your EmailJS User ID
  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    to_email: 'tejup07.hsn@gmail.com',
    message: emailContent,
  }).then(() => {
    alert('Order placed successfully!');
    closePopup();
  }).catch(error => {
    console.error('Failed to send email:', error);
    alert('Failed to place the order. Please try again.');
  });
}