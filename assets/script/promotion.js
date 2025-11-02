// Promotion page interactions: countdown, coupon copy, filter & sort, add-to-cart demo, banner carousel
$(document).ready(function() {
    const slides = $('.promo-slide');
    const dots = $('.promo-dots');
    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlideInterval;
    let countdownInterval;

    // Create dots
    slides.each(function(index) {
        dots.append(`<span class="promo-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`);
    });

    // Update dots
    function updateDots() {
        $('.promo-dot').removeClass('active');
        $(`.promo-dot[data-index="${currentIndex}"]`).addClass('active');
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
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
        const end = new Date(now.getTime() + (daysRemaining * 24 * 60 * 60 * 1000));
        
        // Calculate start date (7 days before end for display)
        const start = new Date(end.getTime() - (7 * 24 * 60 * 60 * 1000));
        
        // Update date range display
        $('#promoDateRange').text(`${formatDate(start)} — ${formatDate(end)}`);
        
        function update() {
            const currentTime = new Date().getTime();
            const distance = end.getTime() - currentTime;

            if (distance < 0) {
                $('#days').text('00');
                $('#hours').text('00');
                $('#minutes').text('00');
                $('#seconds').text('00');
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            $('#days').text(String(days).padStart(2, '0'));
            $('#hours').text(String(hours).padStart(2, '0'));
            $('#minutes').text(String(minutes).padStart(2, '0'));
            $('#seconds').text(String(seconds).padStart(2, '0'));
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
        currentSlide.addClass('slide-out');
        
        // After a brief delay, show next slide
        setTimeout(() => {
            currentSlide.removeClass('slide-active slide-out');
            nextSlide.addClass('slide-active');
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
    $('.slide-nav.prev').on('click', function() {
        if (isTransitioning) return;
        clearInterval(autoSlideInterval);
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        changeSlide(prevIndex);
        startAutoSlide();
    });

    $('.slide-nav.next').on('click', function() {
        if (isTransitioning) return;
        clearInterval(autoSlideInterval);
        const nextIndex = (currentIndex + 1) % slides.length;
        changeSlide(nextIndex);
        startAutoSlide();
    });

    // Dot navigation
    $(document).on('click', '.promo-dot', function() {
        if (isTransitioning) return;
        const index = parseInt($(this).attr('data-index'));
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
    const categoryFilter = $('#categoryFilter');
    const discountFilter = $('#discountFilter');
    const sortSelect = $('#sortSelect');
    const productCards = $('.product-card');

    function filterAndSort() {
        const category = categoryFilter.val();
        const discount = discountFilter.val();
        const sort = sortSelect.val();

        let visibleCards = productCards.filter(function() {
            const card = $(this);
            const cardCategory = card.data('category');
            const cardDiscount = parseInt(card.data('discount'));

            const categoryMatch = category === 'all' || cardCategory === category;
            
            // Changed logic: exact match for discount percentage
            let discountMatch;
            if (discount === 'all') {
                discountMatch = true;
            } else {
                discountMatch = cardDiscount === parseInt(discount);
            }

            return categoryMatch && discountMatch;
        });

        productCards.hide();
        visibleCards.show();

        // Sort
        const sortedCards = visibleCards.toArray().sort(function(a, b) {
            const aPrice = parseInt($(a).data('price'));
            const bPrice = parseInt($(b).data('price'));
            const aDiscount = parseInt($(a).data('discount'));
            const bDiscount = parseInt($(b).data('discount'));

            switch(sort) {
                case 'price-asc':
                    return aPrice - bPrice;
                case 'price-desc':
                    return bPrice - aPrice;
                case 'discount-desc':
                    return bDiscount - aDiscount;
                default:
                    return 0;
            }
        });

        const grid = $('.grid');
        grid.empty();
        $(sortedCards).appendTo(grid);
    }

    categoryFilter.on('change', filterAndSort);
    discountFilter.on('change', filterAndSort);
    sortSelect.on('change', filterAndSort);

    // Copy coupon code
    $(document).on('click', '.copy-code', function() {
        const btn = $(this);
        const code = btn.data('code');
        
        navigator.clipboard.writeText(code).then(() => {
            btn.addClass('copied').text('Đã sử dụng!');
            setTimeout(() => {
                btn.removeClass('copied').text('Sử dụng');
            }, 2000);
        });
    });

    // Scroll to top button
    const scrollTopBtn = $('#scrollTopBtn');
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            scrollTopBtn.fadeIn();
        } else {
            scrollTopBtn.fadeOut();
        }
    });

    scrollTopBtn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 600);
    });

    // ============================================
    // CART FUNCTIONALITY
    // ============================================

    let cart = [];

    // Remove product from cart
    function removeFromCart(productName) {
        const item = cart.find(item => item.name === productName);
        if (item) {
            // Thêm animation trước khi xóa
            $(`.cart-item[data-name="${productName}"]`).addClass('removing');
            
            setTimeout(() => {
                cart = cart.filter(item => item.name !== productName);
                updateCartDisplay();
                showRemoveNotification(productName);
            }, 300);
        }
    }
    
    // Show remove notification
    function showRemoveNotification(productName) {
        $('.cart-notification').remove();
        
        const notification = $(`
            <div class="cart-notification remove-notification animate__animated animate__fadeInRight">
                <i class="fas fa-trash-alt"></i>
                <span>Đã xóa "${productName}" khỏi giỏ hàng</span>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.addClass('animate__fadeOutRight');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    // Update product quantity in cart
    function updateQuantity(productName, change) {
        const item = cart.find(item => item.name === productName);
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
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Add product to cart
    function addToCart(productData) {
        const existingItem = cart.find(item => item.name === productData.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productData.name,
                price: productData.price,
                originalPrice: productData.originalPrice,
                img: productData.img,
                quantity: 1
            });
        }
        
        updateCartDisplay();
        showCartNotification(productData.name);
    }



    // Update cart display
    function updateCartDisplay() {
        const cartCount = $('.cart-count');
        const cartEmpty = $('.cart-empty');
        const cartItems = $('.cart-items');
        const cartFooter = $('.cart-footer');
        const totalAmount = $('.total-amount');
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
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
            let cartHTML = '';
            cart.forEach(item => {
                cartHTML += `
                    <div class="cart-item" data-name="${item.name}">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">${formatCurrency(item.price)}</p>
                        </div>
                        <div class="cart-item-controls">
                            <button class="qty-btn minus" data-name="${item.name}" title="Giảm số lượng">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="qty">${item.quantity}</span>
                            <button class="qty-btn plus" data-name="${item.name}" title="Tăng số lượng">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" data-name="${item.name}" title="Xóa khỏi giỏ hàng">
                            <i class="fas fa-trash"></i>
                        </button>
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
        $('.cart-notification').remove();
        
        const notification = $(`
            <div class="cart-notification animate__animated animate__fadeInRight">
                <i class="fas fa-check-circle"></i>
                <span>Đã thêm "${productName}" vào giỏ hàng</span>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.addClass('animate__fadeOutRight');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
    
    // Show limit notification
    function showLimitNotification() {
        $('.cart-notification').remove();
        
        const notification = $(`
            <div class="cart-notification limit-notification animate__animated animate__fadeInRight">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Số lượng tối đa là 99</span>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.addClass('animate__fadeOutRight');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    // Add to cart button
    $('.add-cart').on('click', function() {
        const productCard = $(this).closest('.product-card');
        const productData = {
            name: productCard.data('name'),
            price: parseInt(productCard.data('price')),
            originalPrice: parseInt(productCard.data('original-price')),
            img: productCard.data('img')
        };
        addToCart(productData);
    });
    
    // Quantity controls (event delegation) - Sử dụng container cụ thể thay vì document
    $('.cart-popup').on('click', '.qty-btn.plus', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const name = $(this).attr('data-name');
        console.log('Plus clicked:', name);
        const item = cart.find(item => item.name === name);
        
        // Giới hạn số lượng tối đa là 99
        if (item && item.quantity >= 99) {
            showLimitNotification();
            return;
        }
        
        updateQuantity(name, 1);
    });
    
    $('.cart-popup').on('click', '.qty-btn.minus', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const name = $(this).attr('data-name');
        console.log('Minus clicked:', name);
        const item = cart.find(item => item.name === name);
        
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
    $('.cart-popup').on('click', '.remove-item', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const name = $(this).attr('data-name');
        console.log('Remove clicked:', name);
        removeFromCart(name);
    });
    
    // Toggle cart popup
    $('.cart-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.cart-popup').toggleClass('show');
    });
    
    // Close cart popup with X button
    $('.close-cart').on('click', function(e) {
        e.stopPropagation();
        $('.cart-popup').removeClass('show');
    });
    
    // Close cart when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.cart-btn, .cart-popup').length) {
            $('.cart-popup').removeClass('show');
        }
    });
    
    // Prevent cart popup from closing when clicking inside it
    $('.cart-popup').on('click', function(e) {
        e.stopPropagation();
    });
    
    // Close cart with Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            $('.cart-popup').removeClass('show');
        }
    });
    
});