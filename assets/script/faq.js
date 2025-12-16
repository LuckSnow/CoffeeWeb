$(document).ready(function () {
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

  // FAQ Accordion functionality
  $(".faq-question").on("click", function () {
    const faqItem = $(this).parent();
    const isActive = faqItem.hasClass("active");

    // Close all FAQ items
    $(".faq-item").removeClass("active");
    $(".faq-question i")
      .removeClass("fa-chevron-up")
      .addClass("fa-chevron-down");

    // If the clicked item wasn't active, open it
    if (!isActive) {
      faqItem.addClass("active");
      $(this)
        .find("i")
        .removeClass("fa-chevron-down")
        .addClass("fa-chevron-up");
    }
  });

  // Form submission
  $("#askUsForm").on("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = $("#name").val();
    const email = $("#email").val();
    const subject = $("#subject").val();
    const department = $("#department").val();
    const question = $("#question").val();

    // Simple validation
    if (!name || !email) {
      alert("Please fill in all required fields (*)");
      return;
    }

    // Show success message
    alert("Thank you for your question! We will get back to you soon.");

    // Reset form
    this.reset();
  });

  // Scroll to top button
  const scrollTopBtn = $("#scrollTopBtn");

  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      scrollTopBtn.addClass("show");
    } else {
      scrollTopBtn.removeClass("show");
    }
  });

  scrollTopBtn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 800);
  });

  // Sticky header on scroll with hide/show on scroll direction
  const $header = $(".site-header");
  const headerOffset = $header.offset().top;
  let lastScrollTop = 0;

  $(window).on("scroll", function () {
    const st = $(this).scrollTop();

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

  // Smooth scroll for links
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $(this.hash);
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        800
      );
    }
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
