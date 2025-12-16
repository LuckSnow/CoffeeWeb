// Promotion page interactions: countdown, coupon copy, filter & sort, add-to-cart demo, banner carousel
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

  const slides = $(".promo-slide");
  const dots = $(".promo-dots");
  let currentIndex = 0;
  let isTransitioning = false;
  let autoSlideInterval;
  let countdownInterval;

  // Create dots
  slides.each(function (index) {
    dots.append(
      `<span class="promo-dot ${
        index === 0 ? "active" : ""
      }" data-index="${index}"></span>`
    );
  });

  // Update dots
  function updateDots() {
    $(".promo-dot").removeClass("active");
    $(`.promo-dot[data-index="${currentIndex}"]`).addClass("active");
  }

  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Update countdown - Modified to show decreasing days
  function updateCountdown(slideIndex) {
    // Clear previous interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    // Calculate days based on slide index (3 days, 2 days, 1 day)
    const daysRemaining = 3 - slideIndex;

    // Calculate end date based on current time + remaining days
    const now = new Date();
    const end = new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000);

    // Calculate start date (7 days before end for display)
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Update date range display
    $("#promoDateRange").text(`${formatDate(start)} — ${formatDate(end)}`);

    function update() {
      const currentTime = new Date().getTime();
      const distance = end.getTime() - currentTime;

      if (distance < 0) {
        $("#days").text("00");
        $("#hours").text("00");
        $("#minutes").text("00");
        $("#seconds").text("00");
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      $("#days").text(String(days).padStart(2, "0"));
      $("#hours").text(String(hours).padStart(2, "0"));
      $("#minutes").text(String(minutes).padStart(2, "0"));
      $("#seconds").text(String(seconds).padStart(2, "0"));
    }

    // Update immediately
    update();
    // Then update every second
    countdownInterval = setInterval(update, 1000);
  }

  // Change slide function
  function changeSlide(nextIndex) {
    if (isTransitioning || nextIndex === currentIndex) return;

    isTransitioning = true;
    const currentSlide = slides.eq(currentIndex);
    const nextSlide = slides.eq(nextIndex);

    // Add slide-out class to current
    currentSlide.addClass("slide-out");

    // After a brief delay, show next slide
    setTimeout(() => {
      currentSlide.removeClass("slide-active slide-out");
      nextSlide.addClass("slide-active");
      currentIndex = nextIndex;

      // Update UI
      updateDots();

      // Update countdown based on slide index
      updateCountdown(nextIndex);

      // Re-enable transitions
      setTimeout(() => {
        isTransitioning = false;
      }, 100);
    }, 500);
  }

  // Auto slide
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (!isTransitioning) {
        const nextIndex = (currentIndex + 1) % slides.length;
        changeSlide(nextIndex);
      }
    }, 5000);
  }

  // Navigation buttons
  $(".slide-nav.prev").on("click", function () {
    if (isTransitioning) return;
    clearInterval(autoSlideInterval);
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    changeSlide(prevIndex);
    startAutoSlide();
  });

  $(".slide-nav.next").on("click", function () {
    if (isTransitioning) return;
    clearInterval(autoSlideInterval);
    const nextIndex = (currentIndex + 1) % slides.length;
    changeSlide(nextIndex);
    startAutoSlide();
  });

  // Dot navigation
  $(document).on("click", ".promo-dot", function () {
    if (isTransitioning) return;
    const index = parseInt($(this).attr("data-index"));
    if (index !== currentIndex) {
      clearInterval(autoSlideInterval);
      changeSlide(index);
      startAutoSlide();
    }
  });

  // Initialize - Start with slide 0 (3 days)
  updateCountdown(0);
  startAutoSlide();

  // Filters and sorting
  const categoryFilter = $("#categoryFilter");
  const discountFilter = $("#discountFilter");
  const sortSelect = $("#sortSelect");
  const productCards = $(".product-card");

  function filterAndSort() {
    const category = categoryFilter.val();
    const discount = discountFilter.val();
    const sort = sortSelect.val();

    let visibleCards = productCards.filter(function () {
      const card = $(this);
      const cardCategory = card.data("category");
      const cardDiscount = parseInt(card.data("discount"));

      const categoryMatch = category === "all" || cardCategory === category;

      // Changed logic: exact match for discount percentage
      let discountMatch;
      if (discount === "all") {
        discountMatch = true;
      } else {
        discountMatch = cardDiscount === parseInt(discount);
      }

      return categoryMatch && discountMatch;
    });

    productCards.hide();
    visibleCards.show();

    // Sort
    const sortedCards = visibleCards.toArray().sort(function (a, b) {
      const aPrice = parseInt($(a).data("price"));
      const bPrice = parseInt($(b).data("price"));
      const aDiscount = parseInt($(a).data("discount"));
      const bDiscount = parseInt($(b).data("discount"));

      switch (sort) {
        case "price-asc":
          return aPrice - bPrice;
        case "price-desc":
          return bPrice - aPrice;
        case "discount-desc":
          return bDiscount - aDiscount;
        default:
          return 0;
      }
    });

    const grid = $(".grid");
    grid.empty();
    $(sortedCards).appendTo(grid);
  }

  categoryFilter.on("change", filterAndSort);
  discountFilter.on("change", filterAndSort);
  sortSelect.on("change", filterAndSort);

  // Scroll to top button
  const scrollTopBtn = $("#scrollTopBtn");

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

  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      scrollTopBtn.fadeIn();
    } else {
      scrollTopBtn.fadeOut();
    }
  });

  scrollTopBtn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 600);
  });

  // ============================================
  // CART FUNCTIONALITY
  // ============================================

  let cart = [];

  // Remove product from cart
  function removeFromCart(productName) {
    const item = cart.find((item) => item.name === productName);
    if (item) {
      // Thêm animation trước khi xóa
      $(`.cart-item[data-name="${productName}"]`).addClass("removing");

      setTimeout(() => {
        cart = cart.filter((item) => item.name !== productName);
        updateCartDisplay();
        showRemoveNotification(productName);
      }, 300);
    }
  }

  // Show remove notification
  function showRemoveNotification(productName) {
    $(".cart-notification").remove();

    const notification = $(`
            <div class="cart-notification remove-notification animate__animated animate__fadeInRight">
                <i class="fas fa-trash-alt"></i>
                <span>Đã xóa "${productName}" khỏi giỏ hàng</span>
            </div>
        `);

    $("body").append(notification);

    setTimeout(() => {
      notification.addClass("animate__fadeOutRight");
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }

  // Update product quantity in cart
  function updateQuantity(productName, change) {
    const item = cart.find((item) => item.name === productName);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        // Xóa sản phẩm khỏi giỏ hàng khi số lượng <= 0
        removeFromCart(productName);
        return;
      }
      updateCartDisplay();
    }
  }

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
                                <p class="cart-item-price">${formatCurrency(
                                  item.price
                                )}</p>
                            </div>
                            <div class="cart-item-controls">
                                <button class="qty-btn minus" data-name="${
                                  item.name
                                }" title="Giảm số lượng">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="qty">${item.quantity}</span>
                                <button class="qty-btn plus" data-name="${
                                  item.name
                                }" title="Tăng số lượng">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="remove-item" data-name="${
                                  item.name
                                }" title="Xóa khỏi giỏ hàng">
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
    // Xóa thông báo cũ
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

  // Show limit notification
  function showLimitNotification() {
    $(".cart-notification").remove();

    const notification = $(`
            <div class="cart-notification limit-notification animate__animated animate__fadeInRight">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Số lượng tối đa là 99</span>
            </div>
        `);

    $("body").append(notification);

    setTimeout(() => {
      notification.addClass("animate__fadeOutRight");
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  // Add to cart button
  $(".add-cart").on("click", function () {
    const productCard = $(this).closest(".product-card");
    const productData = {
      name: productCard.data("name"),
      price: parseInt(productCard.data("price")),
      originalPrice: parseInt(productCard.data("original-price")),
      img: productCard.data("img"),
    };
    addToCart(productData);
  });

  // Buy now button - Add to cart and show cart popup
  $(".buy-now").on("click", function () {
    const productCard = $(this).closest(".product-card");
    const productData = {
      name: productCard.data("name"),
      price: parseInt(productCard.data("price")),
      originalPrice: parseInt(productCard.data("original-price")),
      img: productCard.data("img"),
    };

    // Add product to cart
    addToCart(productData);

    // Show cart popup after a short delay to see the notification
    setTimeout(() => {
      $(".cart-popup").addClass("show");
    }, 800);
  });

  // Quantity controls (event delegation) - Sử dụng container cụ thể thay vì document
  $(".cart-popup").on("click", ".qty-btn.plus", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const name = $(this).attr("data-name");
    // DEBUG: console.log("Plus clicked:", name);
    const item = cart.find((item) => item.name === name);

    // Giới hạn số lượng tối đa là 99
    if (item && item.quantity >= 99) {
      showLimitNotification();
      return;
    }

    updateQuantity(name, 1);
  });

  $(".cart-popup").on("click", ".qty-btn.minus", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const name = $(this).attr("data-name");
    // DEBUG: console.log("Minus clicked:", name);
    const item = cart.find((item) => item.name === name);

    // Nếu số lượng là 1, hiện xác nhận xóa
    if (item && item.quantity === 1) {
      if (confirm(`Bạn có muốn xóa "${name}" khỏi giỏ hàng?`)) {
        updateQuantity(name, -1);
      }
    } else {
      updateQuantity(name, -1);
    }
  });

  // Remove item
  $(".cart-popup").on("click", ".remove-item", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const name = $(this).attr("data-name");
    // DEBUG: console.log("Remove clicked:", name);
    removeFromCart(name);
  });

  // Toggle cart popup
  $(".cart-btn").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".cart-popup").toggleClass("show");
  });

  // Close cart popup with X button
  $(".close-cart").on("click", function (e) {
    e.stopPropagation();
    $(".cart-popup").removeClass("show");
  });

  // Close cart when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".cart-btn, .cart-popup").length) {
      $(".cart-popup").removeClass("show");
    }
  });

  // Prevent cart popup from closing when clicking inside it
  $(".cart-popup").on("click", function (e) {
    e.stopPropagation();
  });

  // Close cart with Escape key
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      $(".cart-popup").removeClass("show");
    }
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

  // ===== DISCOUNT COUPONS FUNCTIONALITY =====
  const couponsData = [
    {
      tag: "Online",
      title: "$30 Off Orders Over $199",
      code: "CAFE30K",
      expiry: "12/31/2025",
      discount: "$30",
      target: "All customers",
      rules: [
        "Apply for online orders from $199",
        "Cannot combine with other promotions",
        "Each customer can use once per day",
      ],
    },
    {
      tag: "In-store",
      title: "20% Off Entire Menu",
      code: "CAFE20",
      expiry: "12/25/2025",
      discount: "20%",
      target: "In-store customers",
      rules: [
        "Apply for bills from $150",
        "Maximum discount $50",
        "Not valid on Sundays",
      ],
    },
    {
      tag: "Members",
      title: "Free Shipping Over $99",
      code: "FREESHIP99",
      expiry: "12/30/2025",
      discount: "Free shipping",
      target: "VIP members",
      rules: [
        "Apply within 5km radius",
        "Minimum order $99",
        "Unlimited usage",
      ],
    },
    {
      tag: "Online",
      title: "Buy 2 Get 1 Free - Breakfast Combo",
      code: "BREAKFAST3",
      expiry: "01/31/2026",
      discount: "Free item",
      target: "Morning orders (6am-11am)",
      rules: [
        "Apply to breakfast combos",
        "Free item is the lowest value",
        "Only valid 6am-11am",
      ],
    },
    {
      tag: "In-store",
      title: "$50 Off Bills Over $300",
      code: "CAFE50K",
      expiry: "01/15/2026",
      discount: "$50",
      target: "All customers",
      rules: [
        "Minimum bill $300",
        "Cannot combine with other offers",
        "Valid on holidays",
      ],
    },
    {
      tag: "Members",
      title: "Double Points - Weekends",
      code: "POINT2X",
      expiry: "12/28/2025",
      discount: "2x Points",
      target: "Brothers Club members",
      rules: [
        "Apply on Saturday & Sunday",
        "Earn double loyalty points",
        "Redeem rewards at counter",
      ],
    },
    {
      tag: "Online",
      title: "15% Off - First Order",
      code: "NEWFRIEND15",
      expiry: "03/31/2026",
      discount: "15%",
      target: "New customers",
      rules: [
        "First order only",
        "Maximum discount $40",
        "Register account to use",
      ],
    },
    {
      tag: "In-store",
      title: "Happy Hour - 25% Off",
      code: "HAPPY25",
      expiry: "12/20/2025",
      discount: "25%",
      target: "In-store (2pm-5pm)",
      rules: ["Daily from 2pm-5pm", "All beverages menu", "Combos excluded"],
    },
    {
      tag: "Online",
      title: "Party of 4 - $100 Off",
      code: "PARTY100",
      expiry: "01/10/2026",
      discount: "$100",
      target: "Orders over $500",
      rules: [
        "Minimum 4-person combo",
        "Orders from $500 and up",
        "Free delivery within 3km",
      ],
    },
    {
      tag: "In-store",
      title: "Student Discount - 18% Off",
      code: "STUDENT18",
      expiry: "06/30/2026",
      discount: "18%",
      target: "Students with valid ID",
      rules: [
        "Show student ID at counter",
        "Maximum discount $35",
        "Valid all week",
      ],
    },
    {
      tag: "Online",
      title: "Late Night - $20 Off",
      code: "NIGHT20",
      expiry: "02/28/2026",
      discount: "$20",
      target: "Orders after 8pm",
      rules: [
        "Only 8pm-12am",
        "Minimum order $100",
        "Limited to 50 orders daily",
      ],
    },
    {
      tag: "Members",
      title: "Birthday Special - 50% Off",
      code: "BDAY50",
      expiry: "12/31/2026",
      discount: "50%",
      target: "Birthday month members",
      rules: [
        "Valid during birthday month",
        "One beverage only",
        "Register birthday in profile",
      ],
    },
    {
      tag: "Online",
      title: "Flash Sale - 40% Off",
      code: "FLASH40",
      expiry: "12/18/2025",
      discount: "40%",
      target: "First 100 customers",
      rules: ["Today only", "Maximum discount $60", "Limited stock items"],
    },
    {
      tag: "In-store",
      title: "Coffee Lover - Buy 5 Get 2 Free",
      code: "COFFEE52",
      expiry: "03/15/2026",
      discount: "2 Free",
      target: "Coffee purchases",
      rules: [
        "Coffee drinks only",
        "Same or lower value",
        "Not valid with combos",
      ],
    },
    {
      tag: "Members",
      title: "VIP Exclusive - 35% Off",
      code: "VIP35",
      expiry: "04/30/2026",
      discount: "35%",
      target: "Gold & Platinum members",
      rules: [
        "Premium membership required",
        "All menu items",
        "Use once per week",
      ],
    },
    {
      tag: "Online",
      title: "Dessert Bundle - $45 Off",
      code: "SWEET45",
      expiry: "02/14/2026",
      discount: "$45",
      target: "Dessert orders $200+",
      rules: [
        "Desserts & pastries only",
        "Minimum 5 items",
        "Free gift wrapping",
      ],
    },
    {
      tag: "In-store",
      title: "Family Pack - 30% Off",
      code: "FAMILY30",
      expiry: "05/31/2026",
      discount: "30%",
      target: "Orders for 6+ people",
      rules: [
        "Minimum 6 person combo",
        "Dine-in only",
        "Advance reservation recommended",
      ],
    },
    {
      tag: "Online",
      title: "Referral Bonus - $25 Off",
      code: "REFER25",
      expiry: "12/31/2026",
      discount: "$25",
      target: "New & referring customer",
      rules: [
        "Both users get discount",
        "New user first order",
        "Share unique referral code",
      ],
    },
    {
      tag: "Members",
      title: "Seasonal Special - 45% Off",
      code: "SEASON45",
      expiry: "03/31/2026",
      discount: "45%",
      target: "Seasonal menu items",
      rules: ["Spring menu only", "Limited time offer", "While supplies last"],
    },
    {
      tag: "In-store",
      title: "Group Discount - $80 Off",
      code: "GROUP80",
      expiry: "06/15/2026",
      discount: "$80",
      target: "Corporate groups",
      rules: [
        "Minimum 10 people",
        "Bill over $400",
        "Book 24 hours in advance",
      ],
    },
    {
      tag: "Online",
      title: "Lunch Special - 22% Off",
      code: "LUNCH22",
      expiry: "12/31/2025",
      discount: "22%",
      target: "Lunch hours (11am-2pm)",
      rules: [
        "Monday to Friday only",
        "Lunch menu items",
        "Cannot combine with other offers",
      ],
    },
  ];

  // Pagination variables
  let currentPage = 1;
  const itemsPerPage = 9;
  const totalPages = Math.ceil(couponsData.length / itemsPerPage);

  // Generate coupon cards with pagination with pagination
  function generateCoupons(page = 1) {
    const grid = $("#couponsGridPromo");
    grid.empty();

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = couponsData.slice(startIndex, endIndex);

    pageData.forEach((coupon) => {
      const card = $(`
                <div class="coupon-card-promo">
                    <div class="card-content-promo">
                        <span class="coupon-tag-promo">${coupon.tag}</span>
                        <h3 class="coupon-title-promo">${coupon.title}</h3>
                        <div class="coupon-code-wrapper-promo">
                            <span class="coupon-code-promo">${
                              coupon.code
                            }</span>
                            <button class="copy-btn-promo" data-code="${
                              coupon.code
                            }">
                                <i class="fas fa-copy"></i>
                                <span class="btn-text-promo">Copy</span>
                            </button>
                        </div>
                        <div class="coupon-info-promo">
                            <div class="info-row-promo">
                                <i class="fas fa-calendar-alt"></i>
                                <div><span class="info-label-promo">Valid Until:</span> ${
                                  coupon.expiry
                                }</div>
                            </div>
                            <div class="info-row-promo">
                                <i class="fas fa-gift"></i>
                                <div><span class="info-label-promo">Discount:</span> ${
                                  coupon.discount
                                }</div>
                            </div>
                            <div class="info-row-promo">
                                <i class="fas fa-users"></i>
                                <div><span class="info-label-promo">Eligible:</span> ${
                                  coupon.target
                                }</div>
                            </div>
                            <div class="info-rules-promo">
                                <div class="info-label-promo" style="margin-bottom: 8px;">Terms & Conditions:</div>
                                <ul>
                                    ${coupon.rules
                                      .map(
                                        (rule) => `
                                        <li>
                                            <i class="fas fa-check-circle"></i>
                                            <span>${rule}</span>
                                        </li>
                                    `
                                      )
                                      .join("")}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `);
      grid.append(card);
    });

    // Update pagination info
    updatePaginationInfo();
  }

  // Update pagination display
  function updatePaginationInfo() {
    $("#pageInfoPromo").text(`Page ${currentPage} / ${totalPages}`);
    $("#prevPagePromo").prop("disabled", currentPage === 1);
    $("#nextPagePromo").prop("disabled", currentPage === totalPages);
  }

  // Pagination event handlers
  $("#prevPagePromo").on("click", function () {
    if (currentPage > 1) {
      currentPage--;
      generateCoupons(currentPage);
      attachCouponCopyListeners();
      // Scroll to top of coupons section
      $("html, body").animate(
        {
          scrollTop: $(".discount-coupons-section").offset().top - 100,
        },
        500
      );
    }
  });

  $("#nextPagePromo").on("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      generateCoupons(currentPage);
      attachCouponCopyListeners();
      // Scroll to top of coupons section
      $("html, body").animate(
        {
          scrollTop: $(".discount-coupons-section").offset().top - 100,
        },
        500
      );
    }
  });

  // Copy to clipboard functionality
  function attachCouponCopyListeners() {
    $(document).on("click", ".copy-btn-promo", function (e) {
      e.stopPropagation();
      const btn = $(this);
      const code = btn.attr("data-code");
      const btnText = btn.find(".btn-text-promo");
      const icon = btn.find("i");

      // Copy to clipboard using modern API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(code)
          .then(() => {
            // Success feedback
            btn.addClass("copied");
            btnText.text("Copied!");
            icon.removeClass("fa-copy").addClass("fa-check");

            // Reset after 1.2s
            setTimeout(() => {
              btn.removeClass("copied");
              btnText.text("Copy");
              icon.removeClass("fa-check").addClass("fa-copy");
            }, 1200);
          })
          .catch(() => {
            fallbackCouponCopy(code, btn, btnText, icon);
          });
      } else {
        fallbackCouponCopy(code, btn, btnText, icon);
      }
    });
  }

  // Fallback copy method for older browsers
  function fallbackCouponCopy(text, btn, btnText, icon) {
    const textArea = $("<textarea>")
      .val(text)
      .css({
        position: "fixed",
        left: "-9999px",
      })
      .appendTo("body");

    textArea[0].select();

    try {
      document.execCommand("copy");
      btn.addClass("copied");
      btnText.text("Copied!");
      icon.removeClass("fa-copy").addClass("fa-check");

      setTimeout(() => {
        btn.removeClass("copied");
        btnText.text("Copy");
        icon.removeClass("fa-check").addClass("fa-copy");
      }, 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }

    textArea.remove();
  }

  // Initialize coupons
  generateCoupons();
});
