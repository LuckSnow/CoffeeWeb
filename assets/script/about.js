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

  // --- Smooth scroll for internal links ---
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    var target = $(this.hash);
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        800
      );
    }
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

  // --- Add animation on scroll ---
  $(window).on("scroll", function () {
    $(".animate-on-scroll").each(function () {
      var elementTop = $(this).offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height();

      if (elementTop < windowBottom - 100) {
        $(this).addClass("animated");
      }
    });
  });

  // --- Active navigation highlight ---
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  $(".main-nav a").each(function () {
    var href = $(this).attr("href").split("/").pop();
    if (
      href === currentPage ||
      (currentPage === "about.html" && href === "about.html")
    ) {
      $(this).addClass("active");
    }
  });

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

  // --- Page entrance animation ---
  $(".slide-left").addClass("animate__animated animate__fadeInLeft");

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

  // --- STATS COUNTER ANIMATION ---
  let statsAnimated = false;

  function animateCounter($element, target, suffix = "") {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format number
      let displayValue = Math.floor(current);
      $element.text(displayValue + suffix);
    }, duration / steps);
  }

  function checkStatsInView() {
    if (statsAnimated) return;

    const statsSection = $(".about-history");
    if (statsSection.length === 0) return;

    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();
    const elementTop = statsSection.offset().top;

    if (scrollTop + windowHeight > elementTop + 100) {
      statsAnimated = true;

      // Animate each stat box
      $(".stat-box").each(function () {
        const $number = $(this).find("h3");
        const text = $number.text().trim();

        // Extract number and suffix
        let target, suffix;
        if (text.includes("k")) {
          target = parseInt(text.replace(/[^0-9]/g, ""));
          suffix = " k";
        } else if (text.includes("+")) {
          target = parseInt(text.replace(/[^0-9]/g, ""));
          suffix = " +";
        } else {
          target = parseInt(text.replace(/[^0-9]/g, ""));
          suffix = "";
        }

        animateCounter($number, target, suffix);
      });
    }
  }

  // Check on scroll
  $(window).on("scroll", checkStatsInView);

  // Check on page load
  checkStatsInView();
});
