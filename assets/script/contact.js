$(document).ready(function() {
    // --- Hide nav on scroll ---
    var lastScrollTop = 0;
    var $nav = $('.main-nav');
    $(window).on('scroll', function() {
        var st = $(this).scrollTop();
        if (st > lastScrollTop && st > 80) {
            // Scroll down
            $nav.addClass('hide-nav');
        } else {
            // Scroll up
            $nav.removeClass('hide-nav');
        }
        lastScrollTop = st;
    });

    // --- Scroll to Top Button ---
    var scrollTopBtn = $('#scrollTopBtn');

    // Show or hide the button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            scrollTopBtn.fadeIn();
        } else {
            scrollTopBtn.fadeOut();
        }
    });

    // Animate scroll to top
    scrollTopBtn.click(function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 800);
    });
    

    // --- Form Submission ---
    $('#contactForm').on('submit', function(event) {
        // Prevent actual form submission for this demo
        event.preventDefault();

        // You can add AJAX code here to send data to a server
        alert('Thank you for your message! This is a demo, so no email was sent.');

        // Clear the form fields after submission
        $(this).trigger('reset');
    });

});