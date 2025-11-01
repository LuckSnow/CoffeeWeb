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
            btn.addClass('copied').text('Đã sao chép!');
            setTimeout(() => {
                btn.removeClass('copied').text('Sao chép');
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
});
