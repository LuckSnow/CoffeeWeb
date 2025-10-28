// Promotion page interactions: countdown, coupon copy, filter & sort, add-to-cart demo, banner carousel
$(function(){
    // Countdown: single shared timer, restartable
    var promoTimer = null;
    function setCountdown(endStr){
        clearInterval(promoTimer);
        var end = new Date(endStr).getTime();
        if (isNaN(end)) return;
        function update(){
            var now = new Date().getTime();
            var diff = end - now;
            if (diff <= 0){
                $('#days').text('00'); $('#hours').text('00'); $('#minutes').text('00'); $('#seconds').text('00');
                clearInterval(promoTimer);
                return;
            }
            var days = Math.floor(diff / (1000*60*60*24));
            var hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
            var minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
            var seconds = Math.floor((diff % (1000*60)) / 1000);
            $('#days').text(String(days).padStart(2,'0'));
            $('#hours').text(String(hours).padStart(2,'0'));
            $('#minutes').text(String(minutes).padStart(2,'0'));
            $('#seconds').text(String(seconds).padStart(2,'0'));
        }
        update();
        promoTimer = setInterval(update,1000);
    }

    // Initialize with the countdown data-end currently on #promoCountdown
    setCountdown($('#promoCountdown').data('end'));

    // Banner carousel (auto-rotate and manual dots)
    var $slides = $('.promo-slide');
    var current = 0;
    var rotateInterval = 6000; // ms
    var carouselTimer = null;

    function buildDots(){
        var $dots = $('.promo-dots');
        $dots.empty();
        $slides.each(function(i){
            var $dot = $('<div>').addClass('promo-dot').attr('data-index', i);
            if (i===0) $dot.addClass('active');
            $dots.append($dot);
        });
    }

    function showSlide(i){
        if (i < 0) i = $slides.length -1;
        if (i >= $slides.length) i = 0;
        $slides.removeClass('slide-active').eq(i).addClass('slide-active');
        $('.promo-dot').removeClass('active').eq(i).addClass('active');
        current = i;
        // Update countdown to slide's end
        var end = $slides.eq(i).data('end');
        if (end){
            $('#promoCountdown').data('end', end);
            setCountdown(end);
        }
        // Update promo date text if needed (simple formatting)
        var endDate = new Date(end);
        if (!isNaN(endDate)){
            $('#promoDateEnd').text((endDate.getDate()).toString().padStart(2,'0') + '/' + (endDate.getMonth()+1).toString().padStart(2,'0') + '/' + endDate.getFullYear());
        }
    }

    function startCarousel(){
        clearInterval(carouselTimer);
        carouselTimer = setInterval(function(){ showSlide(current+1); }, rotateInterval);
    }

    buildDots();
    showSlide(0);
    startCarousel();

    // Dot click
    $(document).on('click', '.promo-dot', function(){
        var idx = parseInt($(this).attr('data-index'),10);
        showSlide(idx);
        startCarousel();
    });

    // Pause on hover
    $('.promo-slides, .countdown-wrap').on('mouseenter', function(){ clearInterval(carouselTimer); }).on('mouseleave', function(){ startCarousel(); });

    // Copy coupon code
    $(document).on('click','.copy-code', function(){
        var code = $(this).data('code');
        if (!code) return;
        if (navigator.clipboard){
            navigator.clipboard.writeText(code).then(function(){
                alert('Mã đã được sao chép: ' + code);
            }, function(){
                alert('Không thể sao chép');
            });
        } else {
            // fallback
            var $tmp = $('<input>');
            $('body').append($tmp);
            $tmp.val(code).select();
            document.execCommand('copy');
            $tmp.remove();
            alert('Mã đã được sao chép: ' + code);
        }
    });

    // Add to cart / Buy now demo
    $(document).on('click','.add-cart, .buy-now', function(){
        var $card = $(this).closest('.product-card');
        var title = $card.find('.product-title').text();
        var price = $card.find('.sale').text();
        if ($(this).hasClass('buy-now')){
            alert('Thanh toán nhanh: ' + title + ' — ' + price + '\n(Đây là demo)');
        } else {
            alert('Đã thêm vào giỏ: ' + title + ' — ' + price);
        }
    });

    // Sorting
    function sortGrid(mode){
        var $grid = $('.grid');
        var $cards = $grid.find('.product-card');
        var sorted = $cards.toArray().sort(function(a,b){
            var A = $(a), B = $(b);
            var pa = parseInt(A.data('price')||0,10);
            var pb = parseInt(B.data('price')||0,10);
            var da = parseInt(A.data('discount')||0,10);
            var db = parseInt(B.data('discount')||0,10);
            if (mode === 'price-asc') return pa - pb;
            if (mode === 'price-desc') return pb - pa;
            if (mode === 'discount-desc') return db - da;
            // featured / default
            return 0;
        });
        $grid.empty().append(sorted);
    }
    $('#sortSelect').on('change', function(){ sortGrid($(this).val()); });

    // Filtering
    function applyFilters(){
        var cat = $('#categoryFilter').val();
        var disc = $('#discountFilter').val();
        $('.grid .product-card').each(function(){
            var $c = $(this);
            var matchCat = (cat === 'all') || ($c.data('category') === cat);
            var matchDisc = true;
            var d = parseInt($c.data('discount')||0,10);
            if (disc !== 'all'){
                matchDisc = d >= parseInt(disc,10);
            }
            if (matchCat && matchDisc) $c.show(); else $c.hide();
        });
    }
    $('#categoryFilter, #discountFilter').on('change', applyFilters);

    // Initialize (apply default filters)
    applyFilters();
});
