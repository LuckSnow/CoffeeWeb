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

  // --- About section grid image click handler ---
  $(".grid-item").on("click", function () {
    // Remove active class from all items
    $(".grid-item").removeClass("active");

    // Add active class to clicked item
    $(this).addClass("active");

    // Get content from data attributes
    var title = $(this).data("title");
    var description = $(this).data("description");

    // Fade out content
    $("#about-title, #about-description").css("opacity", "0");

    // Update content after fade out
    setTimeout(function () {
      $("#about-title").text(title);
      $("#about-description").text(description);

      // Fade in new content
      $("#about-title, #about-description").css("opacity", "1");
    }, 300);
  });

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
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
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

  // --- HERO SLIDER ---
  let currentSlide = 0;
  const slides = $(".hero-slide");
  const dots = $(".dot");
  const totalSlides = slides.length;
  let autoSlideInterval;

  function showSlide(index) {
    slides.removeClass("active");
    dots.removeClass("active");

    if (index >= totalSlides) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = totalSlides - 1;
    } else {
      currentSlide = index;
    }

    $(slides[currentSlide]).addClass("active");
    $(dots[currentSlide]).addClass("active");
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Hero slider controls
  $(".next-btn").on("click", function () {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  $(".prev-btn").on("click", function () {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  // Dot navigation
  dots.on("click", function () {
    const slideIndex = $(this).data("slide");
    stopAutoSlide();
    showSlide(slideIndex);
    startAutoSlide();
  });

  // Start auto slide
  startAutoSlide();

  // Pause on hover
  $(".hero-slider").hover(
    function () {
      stopAutoSlide();
    },
    function () {
      startAutoSlide();
    }
  );

  // --- TESTIMONIALS SLIDER ---
  let currentTestimonial = 0;
  const testimonials = $(".testimonial-slide");
  const totalTestimonials = testimonials.length;
  let autoTestimonialInterval;

  function showTestimonial(index) {
    testimonials.removeClass("active");

    if (index >= totalTestimonials) {
      currentTestimonial = 0;
    } else if (index < 0) {
      currentTestimonial = totalTestimonials - 1;
    } else {
      currentTestimonial = index;
    }

    $(testimonials[currentTestimonial]).addClass("active");

    // Update dots
    $(".testimonial-dot").removeClass("active");
    $(`.testimonial-dot[data-testimonial="${currentTestimonial}"]`).addClass(
      "active"
    );
  }

  function nextTestimonial() {
    showTestimonial(currentTestimonial + 1);
  }

  function prevTestimonial() {
    showTestimonial(currentTestimonial - 1);
  }

  function startAutoTestimonial() {
    autoTestimonialInterval = setInterval(nextTestimonial, 5000);
  }

  function stopAutoTestimonial() {
    clearInterval(autoTestimonialInterval);
  }

  // Testimonial controls
  $(".next-testimonial").on("click", function () {
    stopAutoTestimonial();
    nextTestimonial();
    startAutoTestimonial();
  });

  $(".prev-testimonial").on("click", function () {
    stopAutoTestimonial();
    prevTestimonial();
    startAutoTestimonial();
  });

  // Start auto testimonial slide
  startAutoTestimonial();

  // Pause testimonials on hover
  $(".testimonials-slider").hover(
    function () {
      stopAutoTestimonial();
    },
    function () {
      startAutoTestimonial();
    }
  );

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
      if (target >= 1000) {
        // For large numbers like 170k
        displayValue = Math.floor(current);
      }

      $element.text(displayValue + suffix);
    }, duration / steps);
  }

  function checkStatsInView() {
    if (statsAnimated) return;

    const statsSection = $(".stats-section");
    if (statsSection.length === 0) return;

    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();
    const elementTop = statsSection.offset().top;

    if (scrollTop + windowHeight > elementTop + 100) {
      statsAnimated = true;

      // Animate each stat number
      $(".stat-item").each(function () {
        const $number = $(this).find(".stat-number");
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

  // --- GALLERY LIGHTBOX ---
  const $lightbox = $("#lightbox");
  const $lightboxImg = $("#lightbox-img");
  const galleryImages = [];
  let currentImageIndex = 0;

  // Collect all gallery images
  $(".gallery-item").each(function (index) {
    const imgSrc = $(this).find("img").attr("src");
    galleryImages.push(imgSrc);

    // Click handler for each gallery item
    $(this).on("click", function () {
      currentImageIndex = index;
      showLightbox(imgSrc);
    });
  });

  function showLightbox(imgSrc) {
    $lightboxImg.attr("src", imgSrc);
    $lightbox.addClass("active");
    $("body").css("overflow", "hidden");
  }

  function closeLightbox() {
    $lightbox.removeClass("active");
    $("body").css("overflow", "auto");
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    $lightboxImg.attr("src", galleryImages[currentImageIndex]);
  }

  function showPrevImage() {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    $lightboxImg.attr("src", galleryImages[currentImageIndex]);
  }

  // Close lightbox on click close button
  $(".lightbox-close").on("click", closeLightbox);

  // Close lightbox on click outside image
  $lightbox.on("click", function (e) {
    if (e.target === this) {
      closeLightbox();
    }
  });

  // Navigation buttons
  $(".lightbox-next").on("click", function (e) {
    e.stopPropagation();
    showNextImage();
  });

  $(".lightbox-prev").on("click", function (e) {
    e.stopPropagation();
    showPrevImage();
  });

  // Keyboard navigation
  $(document).on("keydown", function (e) {
    if ($lightbox.hasClass("active")) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      } else if (e.key === "ArrowLeft") {
        showPrevImage();
      }
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

  // Add to cart button click for product cards
  $(".product-card .add-cart").on("click", function () {
    const productCard = $(this).closest(".product-card");
    const productData = {
      name: productCard.data("name"),
      price: parseInt(productCard.data("price")),
      originalPrice: productCard.data("original-price")
        ? parseInt(productCard.data("original-price"))
        : parseInt(productCard.data("price")),
      img: productCard.find(".default-img").attr("src"),
    };
    addToCart(productData);
  });

  // Buy now button for product cards
  $(".product-card .buy-now").on("click", function () {
    const productCard = $(this).closest(".product-card");
    const productData = {
      name: productCard.data("name"),
      price: parseInt(productCard.data("price")),
      originalPrice: productCard.data("original-price")
        ? parseInt(productCard.data("original-price"))
        : parseInt(productCard.data("price")),
      img: productCard.find(".default-img").attr("src"),
    };
    addToCart(productData);
    setTimeout(() => {
      $(".cart-popup").addClass("show");
    }, 800);
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
