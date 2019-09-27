$(document).ready(function () {
    
    var infoBook = $("#info-book"),
        infoBookPages = $("#info-book .page"),
        pageFront = $("#info-book .page--front"),
        pageProfile = $("#info-book .page--profile"),
        pageDesc = $("#info-book .page--desc"),
        btnOpenBook = $("#btnOpenTheBook");
    
    function __initial_setup () {
        ((typeof document.getElementById("info-book").style.transform === 'undefined') ? infoBook.css("overflow", "hidden") : infoBook.css("overflow", "visible"));
    }
    
    __initial_setup();
    
    btnOpenBook.click(function (e) {
        /*pageFront.animate({
            top: "-100%"
        }, 500, function () {
            $(this).hide()
                .css("top", "100%");
        });*/
        infoBook.addClass("rotate");
        window.setTimeout(function () {
            pageFront.css("backface-visibility", "hidden");
        }, 250);
    });
    
    $("span.close-book").click(function () {
        /*pageFront.show();
        pageFront.animate({
            top: "0%"
        }, 500);*/
        infoBook.removeClass("rotate");
        window.setTimeout(function () {
            pageFront.css("backface-visibility", "visible");
        }, 150);
    });
    
    $("#info-book .page a.page-toggle").click(function (e) {
        var _page = $(this).data("toggle");
        var _left = (_page == 0) ? "-100%" : "0%";
        pageProfile.animate({
            left: _left
        }, 500, function () {
            $(this).fadeToggle();
        });
    });
    
    $("#btn-about-me-next").hover(function () {
        $("#info-book .page.page--profile .nav").animate({
            width: "64px"
        }, 300);
    }, function () {
        $("#info-book .page.page--profile .nav").animate({
            width: "32px"
        }, 300);
    });
    
});