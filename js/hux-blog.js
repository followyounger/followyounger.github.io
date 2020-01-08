/*
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */

 /*
 * Hux Blog v1.6.0 (http://startbootstrap.com)
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0 
 */

/*!
* Soptlog v2.0.0 (http://startbootstrap.com)
* Copyright 2019 @soptq
* Licensed under Apache 2.0
*/


// Tooltip Init
// Unuse by Hux since V1.6: Titles now display by default so there is no need for tooltip
// $(function() {
//     $("[data-toggle='tooltip']").tooltip();
// });


// make all images responsive
/* 
 * Unuse by Hux
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
//  $("img").addClass("img-responsive");
// });

if (typeof(isReproduce) !== "undefined" &&  !isReproduce) {
    document.body.addEventListener('copy', function (e) {
        if (window.getSelection().toString() && window.getSelection().toString().length >= 42) {
            switch (navigator.language || navigator.userLanguage) {
                case "zh-CN":
                    createSnackbar({
                        message: "转载请注明出处！",
                        actionText: "OK",
                        duration: 3000,
                        mode: "warning"
                    });
                    break;
                default:
                    createSnackbar({
                        message: "Please indicate the source!",
                        actionText: "OK",
                        duration: 3000,
                        mode: "warning"
                    });
                    break;
            }
        }
    })
}

// responsive tables
$(document).ready(function() {
    $("table").wrap("<div class='table-responsive'></div>");
    $("table").addClass("table");
});

// responsive embed videos
$(document).ready(function() {
    $('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="youtube.com"]').addClass('embed-responsive-item');
    $('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="vimeo.com"]').addClass('embed-responsive-item');
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    "use strict";
    const MQL = 1170;
    //primary navigation slide-in effect
    const headerHeight = $('.navbar-custom').height(),
        bannerHeight  = $('.intro-header .container').height();
    let scheduledAnimationFrame = false, that;
    $(window).on('scroll', {
            previousTop: 0
        },
        function() {
            if (scheduledAnimationFrame){
                return;
            }
            that = this;
            scheduledAnimationFrame = true;
            requestAnimationFrame(function () {
                let currentTop = $(window).scrollTop(),
                    needFix = false;
                const $b2t_text = $('.scroll-to-top-btn > i'),
                    $b2t = $('.scroll-to-top-btn');
                let clientHeight;
                if( typeof( window.innerWidth ) == 'number' ) {
                    //Non-IE
                    clientHeight = window.innerHeight;
                } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                    //IE 6+ in 'standards compliant mode'
                    clientHeight = document.documentElement.clientHeight;
                } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
                    //IE 4 compatible
                    clientHeight = document.body.clientHeight;
                }
                if ($(window).width() > MQL) {
                    const $catalog = $('.side-catalog'),
                        $progressbar = $('.side-progress');
                    //check if user is scrolling up by mouse or keyborad
                    if (currentTop < that.previousTop) {
                        //if scrolling up...
                        if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                            $('.navbar-custom').addClass('is-visible');
                        } else {
                            $('.navbar-custom').removeClass('is-visible is-fixed');
                        }
                    } else {
                        //if scrolling down...
                        $('.navbar-custom').removeClass('is-visible');
                        if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
                    }
                    //adjust the appearance of side-catalog
                    $catalog.show();
                    $progressbar.show();

                    if (currentTop > (bannerHeight - 31)) {
                        if (currentTop + window.innerHeight
                            > (document.body.scrollHeight - document.getElementsByTagName("footer")[0].offsetHeight - 1000)) {
                            let opa = (currentTop + clientHeight
                                - (document.body.scrollHeight - document.getElementsByTagName("footer")[0].offsetHeight - 1000))
                            > 1000 ? 0 : 1 - ((currentTop + clientHeight
                                - (document.body.scrollHeight - document.getElementsByTagName("footer")[0].offsetHeight - 1000))) / 1000;
                            $catalog.css("opacity", opa);
                            $progressbar.css("opacity", opa);
                            if (!opa) {
                                $catalog.hide();
                                $progressbar.hide();
                            } else {
                                $catalog.show();
                                $progressbar.show();
                            }
                        } else {
                            $catalog.css("opacity", 1);
                            $progressbar.css("opacity", 1);
                            $catalog.show();
                            $progressbar.show();
                        }
                        $catalog.addClass('fixed');
                        $progressbar.addClass('fixed');
                    } else {
                        $catalog.removeClass('fixed');
                        $progressbar.removeClass('fixed');
                    }
                }
                if (currentTop > (bannerHeight - 31)) {
                    let offsetFooterLine = Math.max($(document).height(), $(window).height()) - currentTop - clientHeight - $('footer').innerHeight() + 70;
                    if (offsetFooterLine > 0) {
                        // absolute b2t button
                        if (offsetFooterLine <= 400) {
                            if ($b2t.attr('data-anim') === 'false' && $b2t.css('visibility') === "hidden")  {
                                $b2t.attr('data-anim', 'true');
                                $b2t.css('visibility', "visible");
                                $b2t.addClass('anim-bounceIn');
                                setTimeout(function(){
                                    $b2t.css('opacity', "1");
                                    $b2t.removeClass('anim-bounceIn');
                                    $b2t.attr('data-anim', 'false');
                                }, 500);
                            }
                        } else {
                            if ($b2t.attr('data-anim') === 'false') {
                                if (currentTop < that.previousTop && $b2t.css('visibility') === "hidden")  {
                                    $b2t.attr('data-anim', 'true');
                                    $b2t.css('visibility', "visible");
                                    $b2t.addClass('anim-bounceIn');
                                    setTimeout(function(){
                                        $b2t.css('opacity', "1");
                                        $b2t.removeClass('anim-bounceIn');
                                        $b2t.attr('data-anim', 'false');
                                    }, 500);
                                }
                                if (currentTop > that.previousTop && $b2t.css('visibility') === "visible") {
                                    $b2t.attr('data-anim', 'true');
                                    $b2t.addClass('anim-bounceOut');
                                    setTimeout(function(){
                                        $b2t.css('opacity', "0");
                                        $b2t.removeClass('anim-bounceOut');
                                        if (Math.max($(document).height(), $(window).height()) - window.scrollY - clientHeight - $('footer').innerHeight()<= 330) {
                                            $b2t.addClass('anim-bounceIn');
                                            setTimeout(function(){
                                                $b2t.css('opacity', "1");
                                                $b2t.removeClass('anim-bounceIn');
                                                $b2t.attr('data-anim', 'false');
                                            }, 500);
                                        } else {
                                            $b2t.css('visibility', "hidden");
                                            $b2t.attr('data-anim', 'false');
                                        }
                                    }, 300);
                                }
                            }
                        }
                        if ($b2t.css('position') === 'absolute') {
                            $b2t.css({
                                'position': 'fixed',
                                'top': 'auto',
                                'bottom': '40px'
                            });
                        }
                        if (offsetFooterLine <= 100) {
                            $b2t.attr('data-b2tMarginTop', (Math.max($(document).height(), $(window).height()) - $('footer').innerHeight() - 30) + "px");
                            $b2t.css({
                                'width': (60 + 0.04 * offsetFooterLine) + "px",
                                'height': (60 - 0.2 * offsetFooterLine) + "px",
                                'border-radius': (30 - 0.26 * offsetFooterLine) + "px",
                            });
                            $b2t_text.css('margin-top', (22 - 0.1 * offsetFooterLine) + "px");
                        } else {
                            $b2t.css({
                                'width': '64px',
                                'height': '40px',
                                'border-radius': '4px'
                            });
                            $b2t_text.css('margin-top', "12px");
                        }
                    } else {
                        //fixed b2t button
                        if (((Math.max($(document).height(), $(window).height()) - $('footer').innerHeight() - 30) + "px")
                            !== $b2t.attr('data-b2tMarginTop')) {
                            needFix = true;
                            $b2t.attr('data-b2tMarginTop', (Math.max($(document).height(), $(window).height()) - $('footer').innerHeight() - 30) + "px");
                        }
                        if (needFix || $b2t.css('position') !== 'absolute') {
                            $b2t.css({
                                'position': 'absolute',
                                'bottom': 'auto',
                                'top': $b2t.attr('data-b2tMarginTop'),
                                'width': '60px',
                                'height': '60px',
                                'border-radius': '30px'
                            });
                            $b2t_text.css('margin-top', "22px");
                        }
                        if ($b2t.attr('data-anim') === 'false' && $b2t.css('visibility') === "hidden")  {
                            $b2t.attr('data-anim', 'true');
                            $b2t.css('visibility', "visible");
                            $b2t.addClass('anim-bounceIn');
                            setTimeout(function(){
                                $b2t.css('opacity', "1");
                                $b2t.removeClass('anim-bounceIn');
                                $b2t.attr('data-anim', 'false');
                            }, 500);
                        }
                    }
                } else {
                    if ($b2t.attr('data-anim') === 'false' && $b2t.css('visibility') === "visible")  {
                        $b2t.attr('data-anim', 'true');
                        $b2t.addClass('anim-bounceOut');
                        setTimeout(function(){
                            $b2t.css('opacity', "0");
                            $b2t.removeClass('anim-bounceOut');
                            $b2t.css('visibility', "hidden");
                            $b2t.attr('data-anim', 'false');
                        }, 300);
                    }
                }
                that.previousTop = currentTop;
                scheduledAnimationFrame = false;
            });
        });
});

$(document).ready(function() {
    "use strict";
    if (document.getElementsByClassName('vertical-parallax').length !== 0){
        let scheduledAnimationFrame = false;
        window.addEventListener('scroll', function () {
            //vertical parallax effect
            let currentTop = $(window).scrollTop();
            if (scheduledAnimationFrame || (currentTop >
                document.getElementsByClassName('vertical-parallax')[0].offsetHeight)){
                return;
            }
            scheduledAnimationFrame = true;
            requestAnimationFrame(function () {
                let header_paras = document.getElementsByClassName('vertical-parallax'),
                    hlen = header_paras.length;
                const c = 1/2;
                let o = 0.7 / header_paras[0].offsetHeight;
                let p = currentTop * c > header_paras[0].offsetHeight ? header_paras[0].offsetHeight : currentTop * c;
                let transString = 'translate3d(0px, ' + p  + 'px, 0px)';
                let opacity = currentTop * o;
                for (let i = 0; i < hlen; ++i){
                    let header_para = header_paras[i];
                    if (header_para != null){
                        header_para.style.transform = transString;
                        header_para.style.opacity = (1 - opacity).toString();
                        if (header_para.classList.contains('wrap')) {
                            header_para.style.filter = "blur(" + (Math.abs(currentTop) * 0.1).toString() + "px)";
                        }
                    }
                }
                scheduledAnimationFrame = false;
            });
        });

        setTimeout(function () {
            $.getScript('https://cdn.jsdelivr.net/npm/colorthief@2.3.0/dist/color-thief.min.js', function () {
                "use strict";
                const image = new Image();
                let colorThief = new ColorThief();
                image.onload = function(){
                    const domainColor = colorThief.getColor(image);
                    document.getElementById('main-header').style.backgroundColor = 'rgb(' + domainColor[0] + ',' +
                        domainColor[1] + ',' + domainColor[2] + ')';
                };
                image.src = document.getElementById('main-header').getAttribute('data-image');
            });
        }, 0);
    }
});


jQuery(document).ready(function($) {
    let scheduledAnimationFrame = false;
    window.addEventListener('resize', function () {
        if (scheduledAnimationFrame){
            return;
        }
        scheduledAnimationFrame = true;
        requestAnimationFrame(adjust_b2t);
    });
    function adjust_b2t() {
        "use strict";
        const $b2t = $(".scroll-to-top-btn"),
            $b2t_text = $('.scroll-to-top-btn > i');
        $b2t.attr('data-b2tMarginTop', (Math.max($(document).height(), $(window).height()) - $('footer').innerHeight() - 30) + "px");
        // language=JQuery-CSS
        let container_margin = $('.container:not(header > .container):not(footer > .container)').css('marginRight');
        if (parseInt(container_margin) < 40) {
            $b2t.css('right', "40.5px");
        } else {
            $b2t.css('right', container_margin);
        }
        let currentTop = $(window).scrollTop();
        const bannerHeight  = $('.intro-header .container').height();
        if (currentTop > (bannerHeight - 31)) {
            let clientHeight;
            if( typeof( window.innerWidth ) == 'number' ) {
                //Non-IE
                clientHeight = window.innerHeight;
            } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                //IE 6+ in 'standards compliant mode'
                clientHeight = document.documentElement.clientHeight;
            } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
                //IE 4 compatible
                clientHeight = document.body.clientHeight;
            }
            let offsetFooterLine = Math.max($(document).height(), $(window).height()) - window.scrollY - clientHeight - $('footer').innerHeight() + 70;
            if (offsetFooterLine <= 0) {
                $b2t.css({
                    'position': 'absolute',
                    'bottom': 'auto',
                    'top': $b2t.attr('data-b2tMarginTop'),
                    'width': '60px',
                    'height': '60px',
                    'border-radius': '30px'
                });
                $b2t_text.css('margin-top', "22px");
            } else {
                $b2t.css({
                    'position': 'fixed',
                    'top': 'auto',
                    'bottom': '40px'
                });
                if (offsetFooterLine <= 100) {
                    $b2t.css({
                        'width': (60 + 0.04 * offsetFooterLine) + "px",
                        'height': (60 - 0.2 * offsetFooterLine) + "px",
                        'border-radius': (30 - 0.26 * offsetFooterLine) + "px"
                    });
                    $b2t_text.css('margin-top', (22 - 0.1 * offsetFooterLine) + "px");
                } else {
                    $b2t.css({
                        'width': '64px',
                        'height': '40px',
                        'border-radius': '4px'
                    })
                    $b2t_text.css('margin-top', "12px");
                }
            }
        } else {
            if ($b2t.attr('data-anim') === 'false' && $b2t.css('visibility') === "visible")  {
                $b2t.attr('data-anim', 'true');
                $b2t.addClass('anim-bounceOut');
                setTimeout(function(){
                    $b2t.css('opacity', "0");
                    $b2t.removeClass('anim-bounceOut');
                    $b2t.css('visibility', "hidden");
                    $b2t.attr('data-anim', 'false');
                }, 300);
            }
        }
        scheduledAnimationFrame = false;
    }
    adjust_b2t();
});

// Search Settings
let results = document.getElementById('results-container');

// override enter event to do nothing but flesh the page
function _keyDownDefault(){
    let e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==13){} // enter
}

$(document).ready(function() {
    "use strict";
    document.onkeydown = _keyDownDefault;
    // handle search event
  $('.search-icon').on('click', function(e){
      // e.preventDefault();
      if ($('.search-box').hasClass('hidden')) {
          $('.search-box').removeClass('hidden');
          setTimeout(function () {
              $('.search-box').addClass('search-active');
              if ($('.search-box').hasClass('search-active')) {
                  // search-box enable;
                  $('#search-input').val("");
                  results.innerHTML = "";
                  if (window.innerWidth > 932){
                      // desktop
                      $(document).on('click', function (e) {
                          let x = e.pageX;
                          let y = e.pageY - (document.body.scrollTop || document.documentElement.scrollTop);
                          if (x < 100 || x > 550 || y > 500){
                              // closing search box
                              // e.preventDefault();
                              $('.search-box').removeClass('search-active');
                              setTimeout(function () {
                                  $('.search-box').addClass('hidden');
                              },400)
                          }
                      });
                  }else {
                      // hide scorebar on mobile
                      setTimeout(function () {
                          document.body.style.overflow = "hidden";
                      },500);
                  }
                  $('.search-icon-close').on('click', function(e){
                      // click close btn
                      // e.preventDefault();
                      $('.search-box').removeClass('search-active');
                      setTimeout(function () {
                          $('.search-box').addClass('hidden');
                      },400);
                      document.body.style.overflow = "auto";
                  });
                  setTimeout(function () {
                      $('#search-input').focus;
                  },1000)
                  // $('#search-input').focus();
              }
          },100)
      }else {
          $('.search-box').addClass('hidden');
          $('.search-box').removeClass('search-active');
      }
  });
});

/* -----------------------------------------------------
  Material Design Buttons
  https://codepen.io/rkchauhan/pen/NNKgJY
  By: Ravikumar Chauhan
  Find me on -
  Twitter: https://twitter.com/rkchauhan01
  Facebook: https://www.facebook.com/ravi032chauhan
  GitHub: https://github.com/rkchauhan
  CodePen: https://codepen.io/rkchauhan
-------------------------------------------------------- */
$(document).ready(function() {
    $('.ripple-effect').rkmd_rippleEffect();
});

(function($) {
    "use strict";
    $.fn.rkmd_rippleEffect = function() {
        let btn, self, ripple, size, rippleX, rippleY, eWidth, eHeight;

        btn = $(this).not('[disabled], .disabled');

        btn.on('mousedown', function(e) {
            self = $(this);

            // Disable right click
            if(e.button === 2) {
                return false;
            }

            if(self.find('.ripple').length === 0) {
                self.prepend('<span class="ripple"></span>');
            }
            ripple = self.find('.ripple');
            ripple.removeClass('animated');

            eWidth = self.outerWidth();
            eHeight = self.outerHeight();
            size = Math.max(eWidth, eHeight);
            ripple.css({'width': size, 'height': size});

            rippleX = parseInt(e.pageX - self.offset().left) - (size / 2);
            rippleY = parseInt(e.pageY - self.offset().top) - (size / 2);

            ripple.css({ 'top': rippleY +'px', 'left': rippleX +'px' }).addClass('animated');

            setTimeout(function() {
                ripple.remove();
            }, 800);

        });
    };
}(jQuery));

// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// main function
function scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use
    var scrollY = window.scrollY,
        scrollTargetY = scrollTargetY || 0,
        speed = speed || 2000,
        easing = easing || 'easeOutSine',
        currentTime = 0;
    // min time .1, max time .8 seconds
    var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));
    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2,
        easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };
    // add animation loop
    function tick() {
        currentTime += 1 / 60;
        var p = currentTime / time;
        var t = easingEquations[easing](p);
        if (p < 1) {
            requestAnimFrame(tick);
            window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
            window.scrollTo(0, scrollTargetY);
        }
    }
    // call it once to get started
    tick();
}

// modify countup.js
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// playground: stackblitz.com/edit/countup-typescript
var CountUp = /** @class */ (function () {
    function CountUp(target, endVal, options) {
        var _this = this;
        this.target = target;
        this.endVal = endVal;
        this.options = options;
        this.version = '2.0.4';
        this.defaults = {
            startVal: 0,
            decimalPlaces: 0,
            duration: 2,
            useEasing: true,
            useGrouping: true,
            smartEasingThreshold: 999,
            smartEasingAmount: 333,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: ''
        };
        this.finalEndVal = null; // for smart easing
        this.useEasing = true;
        this.countDown = false;
        this.error = '';
        this.startVal = 0;
        this.paused = true;
        this.count = function (timestamp) {
            if (!_this.startTime) {
                _this.startTime = timestamp;
            }
            var progress = timestamp - _this.startTime;
            _this.remaining = _this.duration - progress;
            // to ease or not to ease
            if (_this.useEasing) {
                if (_this.countDown) {
                    _this.frameVal = _this.startVal - _this.easingFn(progress, 0, _this.startVal - _this.endVal, _this.duration);
                }
                else {
                    _this.frameVal = _this.easingFn(progress, _this.startVal, _this.endVal - _this.startVal, _this.duration);
                }
            }
            else {
                if (_this.countDown) {
                    _this.frameVal = _this.startVal - ((_this.startVal - _this.endVal) * (progress / _this.duration));
                }
                else {
                    _this.frameVal = _this.startVal + (_this.endVal - _this.startVal) * (progress / _this.duration);
                }
            }
            // don't go past endVal since progress can exceed duration in the last frame
            if (_this.countDown) {
                _this.frameVal = (_this.frameVal < _this.endVal) ? _this.endVal : _this.frameVal;
            }
            else {
                _this.frameVal = (_this.frameVal > _this.endVal) ? _this.endVal : _this.frameVal;
            }
            // decimal
            _this.frameVal = Math.round(_this.frameVal * _this.decimalMult) / _this.decimalMult;
            // format and print value
            _this.printValue(_this.frameVal);
            // whether to continue
            if (progress < _this.duration) {
                _this.rAF = requestAnimationFrame(_this.count);
            }
            else if (_this.finalEndVal !== null) {
                // smart easing
                _this.update(_this.finalEndVal);
            }
            else {
                if (_this.callback) {
                    _this.callback();
                }
            }
        };
        // default format and easing functions
        this.formatNumber = function (num) {
            var neg = (num < 0) ? '-' : '';
            var result, x, x1, x2, x3;
            result = Math.abs(num).toFixed(_this.options.decimalPlaces);
            result += '';
            x = result.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? _this.options.decimal + x[1] : '';
            if (_this.options.useGrouping) {
                x3 = '';
                for (var i = 0, len = x1.length; i < len; ++i) {
                    if (i !== 0 && (i % 3) === 0) {
                        x3 = _this.options.separator + x3;
                    }
                    x3 = x1[len - i - 1] + x3;
                }
                x1 = x3;
            }
            // optional numeral substitution
            if (_this.options.numerals && _this.options.numerals.length) {
                x1 = x1.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
                x2 = x2.replace(/[0-9]/g, function (w) { return _this.options.numerals[+w]; });
            }
            return neg + _this.options.prefix + x1 + x2 + _this.options.suffix;
        };
        this.easeOutExpo = function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        };
        this.options = __assign({}, this.defaults, options);
        this.formattingFn = (this.options.formattingFn) ?
            this.options.formattingFn : this.formatNumber;
        this.easingFn = (this.options.easingFn) ?
            this.options.easingFn : this.easeOutExpo;
        this.startVal = this.validateValue(this.options.startVal);
        this.frameVal = this.startVal;
        this.endVal = this.validateValue(endVal);
        this.options.decimalPlaces = Math.max(0 || this.options.decimalPlaces);
        this.decimalMult = Math.pow(10, this.options.decimalPlaces);
        this.resetDuration();
        this.options.separator = String(this.options.separator);
        this.useEasing = this.options.useEasing;
        if (this.options.separator === '') {
            this.options.useGrouping = false;
        }
        this.el = (typeof target === 'string') ? document.getElementById(target) : target;
        if (this.el) {
            // this.printValue(this.startVal);
        }
        else {
            this.error = '[CountUp] target is null or undefined';
        }
    }
    // determines where easing starts and whether to count down or up
    CountUp.prototype.determineDirectionAndSmartEasing = function () {
        var end = (this.finalEndVal) ? this.finalEndVal : this.endVal;
        this.countDown = (this.startVal > end);
        var animateAmount = end - this.startVal;
        if (Math.abs(animateAmount) > this.options.smartEasingThreshold) {
            this.finalEndVal = end;
            var up = (this.countDown) ? 1 : -1;
            this.endVal = end + (up * this.options.smartEasingAmount);
            this.duration = this.duration / 2;
        }
        else {
            this.endVal = end;
            this.finalEndVal = null;
        }
        if (this.finalEndVal) {
            this.useEasing = false;
        }
        else {
            this.useEasing = this.options.useEasing;
        }
    };
    // start animation
    CountUp.prototype.start = function (callback) {
        if (this.error) {
            return;
        }
        this.callback = callback;
        if (this.duration > 0) {
            this.determineDirectionAndSmartEasing();
            this.paused = false;
            this.rAF = requestAnimationFrame(this.count);
        }
        else {
            this.printValue(this.endVal);
        }
    };
    // pass a new endVal and start animation
    CountUp.prototype.update = function (newEndVal) {
        cancelAnimationFrame(this.rAF);
        this.startTime = null;
        this.endVal = this.validateValue(newEndVal);
        if (this.endVal === this.frameVal) {
            return;
        }
        this.startVal = this.frameVal;
        if (!this.finalEndVal) {
            this.resetDuration();
        }
        this.determineDirectionAndSmartEasing();
        this.rAF = requestAnimationFrame(this.count);
    };
    CountUp.prototype.printValue = function (val) {
        var result = this.formattingFn(val);
        if (this.el.tagName === 'INPUT') {
            var input = this.el;
            input.value = result;
        }
        else if (this.el.tagName === 'text' || this.el.tagName === 'tspan') {
            this.el.textContent = result;
        }
        else {
            this.el.innerHTML = result;
        }
    };
    CountUp.prototype.ensureNumber = function (n) {
        return (typeof n === 'number' && !isNaN(n));
    };
    CountUp.prototype.validateValue = function (value) {
        var newValue = Number(value);
        if (!this.ensureNumber(newValue)) {
            this.error = "[CountUp] invalid start or end value: " + value;
            return null;
        }
        else {
            return newValue;
        }
    };
    CountUp.prototype.resetDuration = function () {
        this.startTime = null;
        this.duration = Number(this.options.duration) * 1000;
        this.remaining = this.duration;
    };
    return CountUp;
}());