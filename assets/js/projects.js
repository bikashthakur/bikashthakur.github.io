$(document).ready(function () {
    
    function Carousel2D (e) {
        this.elements = e;
        this.totalElements = e.length;
        this.currentElem = 0;
        this.prevElem = this.totalElements - 1;
        this.nextElem = this.currentElem + 1;
    }
    
    Carousel2D.prototype.prev = function () {
        this.prevElem = (this.currentElem == 0) ? this.totalElements - 1 : this.currentElem - 1;
        return this.prevElem;
    };
    
    Carousel2D.prototype.next = function () {
        this.nextElem = (this.currentElem == this.totalElements - 1) ?  0 : this.currentElem + 1;
        return this.nextElem;
    };
    
    Carousel2D.prototype.slide = function (next) {
        var _duration = 450,
            _slideTo = next ? this.next() : this.prev();
        
        if(next) {
            $(this.elements[_slideTo]).removeClass("hidden").addClass("active").animate({
                left: "0%"
            }, _duration);

            $(this.elements[this.currentElem]).animate({
                left: "-100%"
            }, _duration, function () {
                $(this).addClass("hidden").removeClass("active").css("left", "100%");
            });
        } else {
            $(this.elements[_slideTo]).addClass("hidden").removeClass("active").css("left", "-100%");
            $(this.elements[_slideTo]).removeClass("hidden").addClass("active").animate({
                left: "0%"
            }, _duration);

            $(this.elements[this.currentElem]).animate({
                left: "100%"
            }, _duration);
        }
        
        this.currentElem = _slideTo;
    };
    
    
    var __slide = function () {
    
        var carousel = new Carousel2D($("#featured .carousel .item"));
        $(carousel.elements).addClass("hidden").css("left", "100%");
        $(carousel.elements[carousel.currentElem]).removeClass("hidden").addClass("active").css("left", "0%");;

        var _interval = 3000;

        var carouselIntrvl = setInterval(function () {
            carousel.slide(true);
        }, _interval);

        $("#featured .carousel .carousel--inner").hover(function () {
            window.clearInterval(carouselIntrvl);
        }, function () {
            carouselIntrvl = setInterval(function () {
                carousel.slide(true);
            }, _interval);
        });
        
        $("a#previous").click(function(e) {
            e.preventDefault();
            window.clearInterval(carouselIntrvl);
            carousel.slide(false);
            carouselIntrvl = setInterval(function () {
                carousel.slide(true);
            }, _interval);
        });
        
        $("a#next").click(function(e) {
            e.preventDefault();
            window.clearInterval(carouselIntrvl);
            carousel.slide(true);
            carouselIntrvl = setInterval(function () {
                carousel.slide(true);
            }, _interval);
        });
        
        $(window).resize(function() {
            setCarouselHeight();
        });
        
        var setCarouselHeight = function () {
            if($("#featured .content").width() <= 1080) {
                $("#featured .carousel--inner").height(($("#featured .main").width() / 2) * 0.482);
            }
        };
        setCarouselHeight();
    };
    
    var transformProp = "transform";
    
    function Carousel3D (el) {
        
        this.element = el;

        this.rotation = 0;
        this.panelCount = 0;
        this.totalPanelCount = this.element.children().length;
        this.theta = 0;

        this.isHorizontal = true;

    }

    Carousel3D.prototype.modify = function() {

        var panel, angle, i;

        this.panelSize = this.element.outerWidth();
        this.rotateFn = 'rotateY';
        this.theta = 360 / this.panelCount;

        // do some trig to figure out how big the carousel
        // is in 3D space
        this.radius = Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / this.panelCount ) );

        for (i = 0; i < this.totalPanelCount; i++) {
            panel = this.element.children().eq(i);
            angle = this.theta * i;
            panel.css("opacity", 1);
            panel.css(transformProp, this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)');
        }

        // hide other panels
        for (  ; i < this.totalPanelCount; i++) {
            panel = this.element.children().eq(i);
            angle = this.theta * i;
            panel.css("opacity", 1);
            panel.css(transformProp, this.rotateFn + 'none');
        }

        // adjust rotation so panels are always flat
        this.rotation = Math.round( this.rotation / this.theta ) * this.theta;

        this.transform();

    };

    Carousel3D.prototype.transform = function() {
        // push the carousel back in 3D space,
        // and rotate it
        this.element.css(transformProp, 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)');
    };

    var init = function() {

        var carousel = new Carousel3D($('#featured .carousel .carousel--inner')),
            btnPrev = document.getElementById('previous'),
            btnNext = document.getElementById('next');

        
        var rotate = function () {
            carousel.rotation += carousel.theta * -1;
            carousel.transform();
        };
        
        var rotationIntrvl = setInterval( rotate, 2500 );
        
        var onNavButtonClick = function(event){
            var increment = parseInt( $(this).attr('data-increment') );
            event.preventDefault();
            //clearInterval(rotationIntrvl);
            carousel.rotation += carousel.theta * increment * -1;
            carousel.transform();
            //rotationIntrvl = setInterval( rotate, 2500 );
        };

        // populate on startup
        carousel.panelCount = 6;
        carousel.modify();

        btnPrev.addEventListener( 'click', onNavButtonClick, false);
        btnNext.addEventListener( 'click', onNavButtonClick, false);
        
        
        $(window).resize(function() {
            carousel.modify();
            setNavWidth();
            setCarousel3DHeight();
        });
        
        setTimeout( function(){
            $("#featured").addClass("ready");
            $("#featured .main").addClass("rotate");
        }, 0);
        
        var setNavWidth = function () {
            $("#featured .carousel .navigation").width($("#featured .carousel .item img").width());
        };
        setNavWidth();
        
        var setCarousel3DHeight = function () {
            if($(".preserve3d #featured .content").width() <= 1080)
                $(".preserve3d #featured .carousel").height($(".preserve3d #featured .carousel").width() * 0.482);
        };
        setCarousel3DHeight();

    };
    if(!Modernizr.preserve3d || !Modernizr.csstransforms3d) {
        $(window).on("load", __slide);
    } else {
        $(window).on("load", init);
        
    }
//    $(window).on("load", init);
    
});