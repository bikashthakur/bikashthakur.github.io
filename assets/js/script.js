$(document).ready(function () {
    
    var _window = $(window);
    
    $("a[href='#']").on("click", function(e) {
        e.preventDefault();
    });
    
    var __setup = function() {
        $("#welcome--page .container").css("width", _window.outerWidth());
        $("#welcome--page .container").css("height", _window.outerHeight());
    };
    
    _window.resize(function() {
        __setup();
    });
    
    $(window).on("load", __setup);
    
    var element = $('.floating-contact');

    setTimeout(function() {
        element.addClass('enter');
    }, 1000);

    element.click(openElement);

    function openElement() {
        var textInput = element.find('.text-box');
        element.addClass('expand');
        element.find('.contact').addClass('enter');
        element.off('click', openElement);
        element.find('.header button').click(closeElement);
    }

    function closeElement() {
        element.find('.contact').removeClass('enter').hide();
        element.removeClass('expand');
        element.find('.header button').off('click', closeElement);
        setTimeout(function() {
            element.find('.contact').removeClass('enter').show()
            element.click(openElement);
        }, 100);
    }
    
    $(".floating-contact .contact .form-container .form-control").on("input", function(e) {
        var inp = $(this).val().trim();
        var label = $('label[for="' + $(this).attr('id') + '"]');
        if(inp.length > 0) {
            label.addClass("hidden");
        } else if(label.hasClass("hidden")) {
            label.removeClass("hidden");
        }
    });
    
    
    
});