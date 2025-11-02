$(document).ready(function() {
    // FAQ Accordion functionality
    $('.faq-question').on('click', function() {
        const faqItem = $(this).parent();
        const isActive = faqItem.hasClass('active');
        
        // Close all FAQ items
        $('.faq-item').removeClass('active');
        $('.faq-question i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        
        // If the clicked item wasn't active, open it
        if (!isActive) {
            faqItem.addClass('active');
            $(this).find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
    });

    // Form submission
    $('#askUsForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = $('#name').val();
        const email = $('#email').val();
        const subject = $('#subject').val();
        const department = $('#department').val();
        const question = $('#question').val();
        
        // Simple validation
        if (!name || !email) {
            alert('Please fill in all required fields (*)');
            return;
        }
        
        // Show success message
        alert('Thank you for your question! We will get back to you soon.');
        
        // Reset form
        this.reset();
    });

    // Scroll to top button
    const scrollTopBtn = $('#scrollTopBtn');
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            scrollTopBtn.addClass('show');
        } else {
            scrollTopBtn.removeClass('show');
        }
    });
    
    scrollTopBtn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800);
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = $('.site-header');
    
    $(window).scroll(function() {
        const currentScroll = $(this).scrollTop();
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.css('transform', 'translateY(-100%)');
        } else {
            // Scrolling up
            header.css('transform', 'translateY(0)');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
});