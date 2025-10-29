// Promotion page interactions: countdown, coupon copy, filter & sort, add-to-cart demo, banner carousel
$(function(){
    // Enhanced Countdown with smooth animation
    var promoTimer = null;
    function setCountdown(endStr){
        clearInterval(promoTimer);
        var end = new Date(endStr).getTime();
        if (isNaN(end)) return;
        
        function animateNumber($el, newVal) {
            var current = parseInt($el.text(), 10);
            if (current === newVal) return;
            
            $el.prop('Counter', current).stop(true, true).animate({
                Counter: newVal
            }, {
                duration: 500,
                easing: 'swing',
                step: function(now) {
                    $el.text(Math.floor(now).toString().padStart(2,'0'));
                }
            });
        }

        function update(){
            var now = new Date().getTime();
            var diff = end - now;
            if (diff <= 0){
                ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
                    animateNumber($('#'+id), 0);
                });
                clearInterval(promoTimer);
                return;
            }
            var days = Math.floor(diff / (1000*60*60*24));
            var hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
            var minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
            var seconds = Math.floor((diff % (1000*60)) / 1000);
            
            animateNumber($('#days'), days);
            animateNumber($('#hours'), hours);
            animateNumber($('#minutes'), minutes);
            animateNumber($('#seconds'), seconds);
        }
        update();
        promoTimer = setInterval(update,1000);
    }

    // Initialize with the countdown data-end currently on #promoCountdown
    setCountdown($('#promoCountdown').data('end'));

    // Enhanced Banner carousel with smooth transitions
    var $slides = $('.promo-slide');
    var current = 0;
    var rotateInterval = 6000; // ms
    var carouselTimer = null;
    var isAnimating = false;

    function buildDots(){
        var $dots = $('.promo-dots');
        $dots.empty();
        $slides.each(function(i){
            var $dot = $('<div>').addClass('promo-dot').attr('data-index', i);
            if (i===0) $dot.addClass('active');
            $dots.append($dot);
        });
    }

    function showSlide(i, direction = 'next'){
        if (isAnimating) return;
        isAnimating = true;

        if (i < 0) i = $slides.length -1;
        if (i >= $slides.length) i = 0;

        var $current = $slides.filter('.slide-active');
        var $next = $slides.eq(i);

        // determine enter/exit directions
        var enterX = (direction === 'next') ? '30px' : '-30px';
        var exitX = (direction === 'next') ? '-30px' : '30px';

        // prepare next slide off-screen and make it active
        $next.css({opacity: 0, transform: 'translateX(' + enterX + ')'}).addClass('slide-active');

        // force reflow so transition will run
        void $next[0].offsetWidth;

        // move current out and bring next in using CSS transitions (defined in CSS)
        $current.css({opacity: 0, transform: 'translateX(' + exitX + ')'});
        $next.css({opacity: 1, transform: 'translateX(0)'});

        // after transition, cleanup previous slide
        setTimeout(function(){
            $current.removeClass('slide-active').css({transform: '', opacity: ''});
            isAnimating = false;
        }, 650);

        $('.promo-dot').removeClass('active').eq(i).addClass('active');
        current = i;

        // Update countdown to slide's end
        var end = $slides.eq(i).data('end');
        if (end){
            $('#promoCountdown').data('end', end);
            setCountdown(end);
        }
        
        // Update promo date text with animation
        var endDate = new Date(end);
        if (!isNaN(endDate)){
            var dateText = (endDate.getDate()).toString().padStart(2,'0') + '/' + 
                          (endDate.getMonth()+1).toString().padStart(2,'0') + '/' + 
                          endDate.getFullYear();
            $('#promoDateEnd').fadeOut(300, function(){
                $(this).text(dateText).fadeIn(300);
            });
        }
    }

    function startCarousel(){
        clearInterval(carouselTimer);
        carouselTimer = setInterval(function(){ 
            showSlide(current+1, 'next'); 
        }, rotateInterval);
    }

    buildDots();
    showSlide(0);
    startCarousel();

    // Enhanced dot click with ripple effect
    $(document).on('click', '.promo-dot', function(e){
        var $ripple = $('<span class="dot-ripple"/>');
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;
        
        $ripple.css({
            top: y + 'px',
            left: x + 'px'
        });
        
        $(this).append($ripple);
        
        setTimeout(() => $ripple.remove(), 1000);
        
        var idx = parseInt($(this).attr('data-index'),10);
        var direction = idx > current ? 'next' : 'prev';
        showSlide(idx, direction);
        startCarousel();
    });

    // Navigation buttons click handlers
    $('.slide-nav.prev').on('click', function(e) {
        e.preventDefault();
        showSlide(current - 1, 'prev');
        startCarousel();
    });

    $('.slide-nav.next').on('click', function(e) {
        e.preventDefault();
        showSlide(current + 1, 'next');
        startCarousel();
    });

    // Pause on hover
    $('.promo-slides, .countdown-wrap').on('mouseenter', function(){ 
        clearInterval(carouselTimer); 
    }).on('mouseleave', function(){ 
        startCarousel(); 
    });

    // Enhanced coupon copy with visual feedback
    $(document).on('click','.copy-code', function(){
        var $btn = $(this);
        var code = $btn.data('code');
        if (!code) return;
        
        if (navigator.clipboard){
            navigator.clipboard.writeText(code).then(function(){
                $btn.addClass('copied').html('<i class="fas fa-check"></i> Đã sao chép');
                setTimeout(() => {
                    $btn.removeClass('copied').html('<i class="fas fa-copy"></i> Sao chép');
                }, 2000);
            }, function(){
                alert('Không thể sao chép');
            });
        } else {
            var $tmp = $('<input>');
            $('body').append($tmp);
            $tmp.val(code).select();
            document.execCommand('copy');
            $tmp.remove();
            $btn.addClass('copied').html('<i class="fas fa-check"></i> Đã sao chép');
            setTimeout(() => {
                $btn.removeClass('copied').html('<i class="fas fa-copy"></i> Sao chép');
            }, 2000);
        }
    });

    // Enhanced Add to cart animation
    $(document).on('click','.add-cart, .buy-now', function(){
        var $btn = $(this);
        var $card = $btn.closest('.product-card');
        var title = $card.find('.product-title').text();
        var price = $card.find('.sale').text();

        // Create floating element
        var $float = $('<div>').addClass('floating-item').html('<i class="fas fa-shopping-cart"></i>');
        var cardOffset = $card.offset();
        var cartOffset = $('.cart-btn').offset();

        $float.css({
            top: cardOffset.top + $card.height()/2,
            left: cardOffset.left + $card.width()/2
        });

        $('body').append($float);

        $float.animate({
            top: cartOffset.top,
            left: cartOffset.left,
            opacity: 0,
            width: 0,
            height: 0
        }, {
            duration: 800,
            easing: 'easeInOutExpo',
            complete: function() {
                $float.remove();
                $('.cart-btn').addClass('pulse');
                setTimeout(() => $('.cart-btn').removeClass('pulse'), 1000);

                if ($btn.hasClass('buy-now')){
                    alert('Thanh toán nhanh: ' + title + ' — ' + price + '\n(Đây là demo)');
                } else {
                    alert('Đã thêm vào giỏ: ' + title + ' — ' + price);
                }
            }
        });
    });

    // Enhanced Sorting with animation
    function sortGrid(mode){
        var $grid = $('.grid');
        var $cards = $grid.find('.product-card').get();
        
        $cards.sort(function(a,b){
            var A = $(a), B = $(b);
            var pa = parseInt(A.data('price')||0,10);
            var pb = parseInt(B.data('price')||0,10);
            var da = parseInt(A.data('discount')||0,10);
            var db = parseInt(B.data('discount')||0,10);
            
            if (mode === 'price-asc') return pa - pb;
            if (mode === 'price-desc') return pb - pa;
            if (mode === 'discount-desc') return db - da;
            return 0;
        });

        // Fade out all cards
        $grid.find('.product-card').fadeOut(300);

        // After fade out, reorder and fade in with delay
        setTimeout(function() {
            $grid.empty();
            $cards.forEach(function(card, i) {
                setTimeout(function() {
                    $(card).appendTo($grid).fadeIn(300);
                }, i * 100);
            });
        }, 300);
    }

    $('#sortSelect').on('change', function(){ 
        sortGrid($(this).val()); 
    });

    // Enhanced Filtering with smooth transitions
    function applyFilters(){
        var cat = $('#categoryFilter').val();
        var disc = $('#discountFilter').val();
        
        $('.grid .product-card').each(function(){
            var $card = $(this);
            var matchCat = (cat === 'all') || ($card.data('category') === cat);
            var matchDisc = true;
            var d = parseInt($card.data('discount')||0,10);
            
            if (disc !== 'all'){
                matchDisc = d >= parseInt(disc,10);
            }
            
            if (matchCat && matchDisc) {
                $card.fadeIn(400);
            } else {
                $card.fadeOut(400);
            }
        });
    }

    $('#categoryFilter, #discountFilter').on('change', applyFilters);

    // Initialize
    applyFilters();

    // Add smooth scroll for CTA buttons
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800, 'easeInOutExpo');
        }
    });

    // Initialize custom easing
    jQuery.easing.easeInOutExpo = function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };
});
