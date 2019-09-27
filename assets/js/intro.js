$(document).ready( function(e) {

    /*text animation*/
    $('.intro').addClass('go');

    function ButterflyAnim (b, s, m, t) {
        this.backgroundImage = b;//o -> $("#background")
        this.content = t;//i -> $("#content")
        this.sprites = s;//h -> $(".sprite")
        this.spriteWrapper = m;//g -> $("#bg-srpite-wrapper")
        this.backgroundPosX = 0;//default <E>
        this.currentBackgroundPosX = this.backgroundPosX;// <b>
        this.pointerBackgroundPosX = null;// <_>
        this.backgroundImageDim = {height:0, width:0, aspect_ratio:0, scale:1};//l
        this.clientDim = {height:0, width:0};//u
        this.hasFocus = false;//s
        this.propRequestAnimFrame = window ? (window.requestAnimationFrame||window.webkitRequestAnimationFrame) : null;
        this.propTransform = navigator.userAgent.match(/webkit/i)?"-webkit-transform":"transform";
    }

    ButterflyAnim.prototype.setupBackground = function () {

        var _this=this,
                _src = _this.content.data("background");
        
        setTimeout(function () {
            
            var img=new Image;

            var t = function () {
                img.onload = null;
                img.onerror = null;
                img = null;
            };
            
            var loadImage = function () {
                _this.backgroundImage.attr("src", _src);
                _this.backgroundImageDim.width = img.width;
                _this.backgroundImageDim.height = img.height;
                _this.backgroundImageDim.aspect_ratio = img.width/img.height;

                _this.setupClient();

                if(_this.backgroundImageDim.width) {
                    _this.backgroundImageDim.scale = _this.clientDim.height / _this.backgroundImageDim.height;
                    _this.setupSprite();
                }

                if (document.documentElement && "ontouchstart" in document.documentElement)
                    _this.backgroundPosX = _this.clientDim.width/2;
                
                t();

                window.setTimeout( function() {
                    _this.C();
                }, 1.1e3);
            };

            img.onload = function() {
                window.setTimeout(loadImage, 250)
            };
            
            img.onerror = loadImage;
            img.src = _src;
            
        }, 20);

    };
    
    ButterflyAnim.prototype.setupClient = function () {
        var _this = this;
        _this.minHeight = 400;//e
        
        _this.clientDim.width = window.innerWidth || (document.documentElement ? document.documentElement.offsetWidth : document.body.offsetWidth);
        
//        _this.clientDim.height = Math.max(window.innerHeight || (document.documentElement ? document.documentElement.offsetHeight : document.body.offsetHeight), _this.minHeight);
        _this.clientDim.height = 350;

        _this.content.css("height", _this.clientDim.height+"px");
    };
    
    ButterflyAnim.prototype.setupSprite = function () {
        
        var e,t,n,_this = this;
        
        _this.spriteWrapper.css("width", _this.clientDim.height * _this.backgroundImageDim.aspect_ratio + "px");
        
        n = [_this.backgroundImageDim.scale, _this.backgroundImageDim.scale, _this.backgroundImageDim.scale].join(", ");
        
        _this.spriteWrapper.css(_this.propTransform, "translate(" + (_this.pointerBackgroundPosX || _this.backgroundPosX) + "%, 0px)");
        
        _this.sprites.each(function (i, elt) {
            
            $(elt).css(_this.propTransform, "scale3d(" + n + ")" + ($(elt).hasClass("flipped")?" scaleX(-1)":""));
            $(elt).css("marginBottom", - _this.clientDim.height * (1 - _this.backgroundImageDim.scale) * .0375 + "px");
            
        })
        
    };
    
    ButterflyAnim.prototype.translate = function () {

        var _this = this;
        
        if(!_this.hasFocus || !_this.propRequestAnimFrame || 0 === _this.backgroundPosX)
            return _this.C();
        
        var e = _this.backgroundPosX / _this.clientDim.width;
        
        if(e < .45)
            e = (.45 - e) / .45;
        else if(e >= .45 && e < .55)
            e = 0;
        else 
            e = (e - .55) / - .45;
        
        _this.currentBackgroundPosX += 0.2 * e;
        
        var t = _this.clientDim.height * _this.backgroundImageDim.aspect_ratio;
        var n = Math.abs(t - _this.clientDim.width) / t * 100;
        if(_this.currentBackgroundPosX < 0)
            _this.currentBackgroundPosX = Math.max(-1 * n, _this.currentBackgroundPosX);
        else 
            _this.currentBackgroundPosX = 0;
        
        if(null !== _this.pointerBackgroundPosX && _this.currentBackgroundPosX === _this.pointerBackgroundPosX)
            return _this.C();
        
        if(_this.propTransform) {
            
            _this.backgroundImage.css(_this.propTransform, "translate(" + _this.currentBackgroundPosX + "%, 0px)");
            _this.spriteWrapper.css(_this.propTransform, "translate(" + _this.currentBackgroundPosX + "%, 0px)");
        }
        _this.pointerBackgroundPosX = _this.currentBackgroundPosX;
        
        _this.C();

    };
    
    ButterflyAnim.prototype.trackClientX = function (e) {
        this.backgroundPosX = e.clientX;
    }
    
    ButterflyAnim.prototype.C = function () {
        var _this = this,
            raf = _this.propRequestAnimFrame;
        
        if(raf) {
            raf( function () {_this.translate()});
        }
    };
    
    var startBackgroundTransition = function () {
        
        var butterflyAnim = new ButterflyAnim($("#bg-meadow"), $("#bg-sprite-wrapper .sprite"), $("#bg-sprite-wrapper"), $("#bg-meadow-content"));

        butterflyAnim.setupBackground();
        
        var container = $("#home .background");
        
        var enableTransition = function () {
            butterflyAnim.hasFocus = true;
            container.removeClass("window_blurred");
            container.removeClass("no_transition");
        };
        
        var disableTransition = function () {
            butterflyAnim.hasFocus = false;
            container.addClass("window_blurred");
            container.addClass("no_transition");
        };

        // add event listeners
        $(window).mousemove(function(e) { 
            butterflyAnim.trackClientX(e);
            var top = e.clientY + $(this).scrollTop();
            var offset = $("body").height() - $("#footer").height();
            (top > offset) ? enableTransition() : disableTransition();
        });
        
        $(window).focusout(function(){disableTransition()});
        
        $(window).resize(function(){butterflyAnim.setupClient()});
        
    };
    
    $(window).bind('DOMContentLoaded', startBackgroundTransition);
    
    $("#welcome--page .cover .l3 .star").each(function(i, elt) {
        var s = parseInt(Math.random() * 8) + 2;
        $(elt).css("width", s + "px");
        $(elt).css("height", s + "px");
        
        var x = 5 + parseInt(Math.random() * 90);
        var y = 21 + parseInt(Math.random() * 130);
        $(elt).css("right", x + "%");
        $(elt).css("top", y + "px");
        
        var t = 10 + parseInt(Math.random() * 10);
        $(elt).css("animation-duration", t + "s");
        
        if(i % 2 == 0)
            $(elt).css("animation-direction", "reverse");
    });
    
    $("#welcome--page .cover .l1 .g1 .star").eq(1).css("animation-delay", "5s");
    
    $("#welcome--page .cover .l1 .g2 .star").eq(1).css("animation-delay", "5s");
    
    $("#welcome--page .cover .l2 .star").eq(1).css("animation-delay", "11s");
});