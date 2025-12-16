$(document).ready(function () {
  // --- Sticky header on scroll with hide/show on scroll direction ---
  var $header = $(".site-header");
  var headerOffset = $header.offset().top;
  var lastScrollTop = 0;

  $(window).on("scroll", function () {
    var st = $(this).scrollTop();

    // Add sticky class when scrolled past header
    if (st > headerOffset) {
      $header.addClass("sticky");
      $("body").addClass("header-sticky");

      // Hide on scroll down, show on scroll up
      if (st > lastScrollTop && st > 100) {
        // Scrolling down
        $header.addClass("hide-nav");
      } else {
        // Scrolling up
        $header.removeClass("hide-nav");
      }
    } else {
      $header.removeClass("sticky");
      $header.removeClass("hide-nav");
      $("body").removeClass("header-sticky");
    }

    lastScrollTop = st;
  });

  // --- Lazy Load Animation ---
  function checkLazyLoad() {
    $(".lazy-load, .lazy-load-left, .lazy-load-right").each(function () {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();

      if (elementBottom > viewportTop && elementTop < viewportBottom - 100) {
        $(this).addClass("loaded");
      }
    });
  }

  // Check on page load
  checkLazyLoad();

  // Check on scroll
  $(window).on("scroll", checkLazyLoad);

  // --- Scroll to Top Button ---
  var scrollTopBtn = $("#scrollTopBtn");

  // Show or hide the button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      scrollTopBtn.fadeIn();
    } else {
      scrollTopBtn.fadeOut();
    }
  });

  // Animate scroll to top
  scrollTopBtn.click(function (event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 800);
  });

  // --- Form Validation & Submission ---
  $("#contactForm").on("submit", function (event) {
    // Prevent actual form submission for this demo
    event.preventDefault();

    // Get form values
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const question = $("#question").val().trim();

    // Email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone number regex pattern (only digits, spaces, +, -, ())
    const phonePattern = /^[\d\s\+\-\(\)]+$/;

    // Validation checks
    if (!name) {
      alert("Please enter your name.");
      $("#name").focus();
      return false;
    }

    if (!email) {
      alert("Please enter your email.");
      $("#email").focus();
      return false;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address (e.g., example@email.com).");
      $("#email").focus();
      return false;
    }

    if (phone && !phonePattern.test(phone)) {
      alert("Please enter a valid phone number (digits only).");
      $("#phone").focus();
      return false;
    }

    if (!question) {
      alert("Please enter your question.");
      $("#question").focus();
      return false;
    }

    // If all validations pass
    alert("Thank you for your message! This is a demo, so no email was sent.");

    // Clear the form fields after submission
    $(this).trigger("reset");
  });

  // --- Cart Functionality ---
  let cart = [];

  // Format currency
  function formatCurrency(amount) {
    return "$" + amount;
  }

  // Add product to cart
  function addToCart(productData) {
    const existingItem = cart.find((item) => item.name === productData.name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: productData.name,
        price: productData.price,
        originalPrice: productData.originalPrice,
        img: productData.img,
        quantity: 1,
      });
    }

    updateCartDisplay();
    showCartNotification(productData.name);
  }

  // Update cart display
  function updateCartDisplay() {
    const cartCount = $(".cart-count");
    const cartEmpty = $(".cart-empty");
    const cartItems = $(".cart-items");
    const cartFooter = $(".cart-footer");
    const totalAmount = $(".total-amount");

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Update cart count badge
    if (totalItems > 0) {
      cartCount.text(totalItems).show();
    } else {
      cartCount.hide();
    }

    // Show/hide cart sections
    if (cart.length === 0) {
      cartEmpty.show();
      cartItems.hide();
      cartFooter.hide();
    } else {
      cartEmpty.hide();
      cartItems.show();
      cartFooter.show();

      // Render cart items
      let cartHTML = "";
      cart.forEach((item) => {
        cartHTML += `
          <div class="cart-item" data-name="${item.name}">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
              <div class="cart-item-top">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
              </div>
              <div class="cart-item-controls">
                <button class="qty-btn minus" data-name="${item.name}">
                  <i class="fas fa-minus"></i>
                </button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn plus" data-name="${item.name}">
                  <i class="fas fa-plus"></i>
                </button>
                <button class="remove-item" data-name="${item.name}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      });
      cartItems.html(cartHTML);
      totalAmount.text(formatCurrency(totalPrice));
    }
  }

  // Show cart notification
  function showCartNotification(productName) {
    $(".cart-notification").remove();

    const notification = $(`
      <div class="cart-notification animate__animated animate__fadeInRight">
        <i class="fas fa-check-circle"></i>
        <span>Đã thêm "${productName}" vào giỏ hàng</span>
      </div>
    `);

    $("body").append(notification);

    setTimeout(() => {
      notification.addClass("animate__fadeOutRight");
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }

  // Update quantity
  function updateQuantity(productName, change) {
    const item = cart.find((item) => item.name === productName);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeFromCart(productName);
        return;
      }
      updateCartDisplay();
    }
  }

  // Remove from cart
  function removeFromCart(productName) {
    const item = cart.find((item) => item.name === productName);
    if (item) {
      $(`.cart-item[data-name="${productName}"]`).addClass("removing");
      setTimeout(() => {
        cart = cart.filter((item) => item.name !== productName);
        updateCartDisplay();
      }, 300);
    }
  }

  // Cart controls
  $(".cart-popup").on("click", ".qty-btn.plus", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const name = $(this).attr("data-name");
    updateQuantity(name, 1);
  });

  $(".cart-popup").on("click", ".qty-btn.minus", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const name = $(this).attr("data-name");
    updateQuantity(name, -1);
  });

  $(".cart-popup").on("click", ".remove-item", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const name = $(this).attr("data-name");
    removeFromCart(name);
  });

  // Checkout button
  $(".cart-popup").on("click", ".checkout-btn", function (e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Clear all items from cart
    cart = [];
    updateCartDisplay();
    // Show success message
    const notification = $(`
      <div class="cart-notification animate__animated animate__fadeInRight">
        <i class="fas fa-check-circle"></i>
        <span>Order placed successfully! Thank you for your purchase.</span>
      </div>
    `);
    $("body").append(notification);
    setTimeout(() => {
      notification.addClass("animate__fadeOutRight");
      setTimeout(() => notification.remove(), 500);
    }, 2000);
    // Close cart popup
    $(".cart-popup").removeClass("show");
  });
});
