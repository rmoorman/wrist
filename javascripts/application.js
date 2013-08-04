(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var offsets;
    $(document).foundation();
    if (Modernizr.is_mobile) {
      defer(function() {
        return window.scrollTo(0, 1);
      });
    }
    window.weekender = $('#weekender .svg-main').clocker();
    offsets = {
      local: false,
      london: 1,
      paris: 2,
      sanfrancisco: -7
    };
    $('.timezones li a').click(function(e) {
      var $el, city;
      e.preventDefault();
      $el = $(e.target);
      $el.parents('.timezones').find('li').removeClass('current');
      $el.parent().addClass('current');
      city = $el.attr('href').split('#')[1];
      return weekender.setOffset(offsets[city]);
    });
    return $('.al').click(function(e) {
      var anchor;
      e.preventDefault;
      anchor = $(e.target).attr('href');
      $.scrollTo($(anchor).offset().top, 1000);
      return false;
    });
  });

  (function($) {
    var Clocker, defer;
    Clocker = (function() {
      var updateTimer;

      function Clocker(elements, options) {
        this.elements = elements;
        this.options = options;
        this.updateTime = __bind(this.updateTime, this);

        this.startAnimation = __bind(this.startAnimation, this);

        this.setOffset = __bind(this.setOffset, this);

        this.init();
        this.$ = this.elements;
      }

      Clocker.prototype.hourLoop = false;

      Clocker.prototype.minuteLoop = false;

      Clocker.prototype.secondLoop = false;

      Clocker.prototype.localOffset = (new Date()).getTimezoneOffset() / -60;

      Clocker.prototype.offsetTimezone = false;

      Clocker.prototype.isAnimatingHands = false;

      updateTimer = null;

      Clocker.prototype.init = function() {
        var settings,
          _this = this;
        settings = {
          hourHand: '.hour-hand',
          minuteHand: '.minute-hand',
          secondHand: '.second-hand'
        };
        settings = $.extend(settings, this.options);
        return this.elements.each(function(i, el) {
          var $el;
          $el = $(el);
          _this.$hourHand = $el.find(settings.hourHand);
          _this.$minuteHand = $el.find(settings.minuteHand);
          _this.$secondHand = $el.find(settings.secondHand);
          return _this.startAnimation(false);
        });
      };

      Clocker.prototype.setOffset = function(offset) {
        if (this.offsetTimezone !== offset && (offset || this.offsetTimezone !== this.localOffset)) {
          this.offsetTimezone = offset;
          return this.startAnimation();
        }
      };

      Clocker.prototype.startAnimation = function(longTransition) {
        var events,
          _this = this;
        if (longTransition == null) {
          longTransition = true;
        }
        clearTimeout(this.updateTimer);
        this.isAnimatingHands = false;
        if (longTransition) {
          this.$hourHand.add(this.$minuteHand).addClass('long-transition');
        }
        defer(function() {
          _this.updateTime();
          return _this.isAnimatingHands = true;
        });
        events = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
        this.$minuteHand.unbind(events);
        return this.$minuteHand.bind(events, function() {
          _this.isAnimatingHands = false;
          _this.$hourHand.add(_this.$minuteHand).removeClass('long-transition');
          return _this.$minuteHand.unbind(events);
        });
      };

      Clocker.prototype.updateTime = function() {
        var time,
          _this = this;
        time = this.getTime();
        $.each(time, function(key, val) {
          var $hand, degree;
          $hand = _this["$" + key + "Hand"];
          degree = val.exactDeg || val.deg;
          if (!_this.isAnimatingHands || key === 'second') {
            if (degree > 20 && degree < 30) {
              _this["" + key + "Loop"] = false;
            }
            if (degree > 0 && degree < 20 && !_this["" + key + "Loop"]) {
              _this["" + key + "Loop"] = degree;
              $hand.addClass('no-transition');
              return defer(function() {
                _this.updateHand($hand, 0);
                return defer(function() {
                  $hand.removeClass('no-transition');
                  return defer(function() {
                    return _this.updateHand($hand, degree);
                  });
                });
              });
            } else {
              return _this.updateHand($hand, degree);
            }
          }
        });
        return this.updateTimer = setTimeout((function() {
          return _this.updateTime();
        }), 200);
      };

      Clocker.prototype.updateHand = function($hand, deg) {
        return $hand.css(this.prefixVendor('transform', "rotate(" + deg + "deg)"));
      };

      Clocker.prototype.getTime = function() {
        var exactH, exactM, exactS, h, m, mil, now, s, time, utc;
        now = new Date();
        if (this.offsetTimezone !== false) {
          utc = now.getTime() + now.getTimezoneOffset() * 60000;
          now = new Date(utc + 3600000 * this.offsetTimezone);
        }
        h = now.getHours();
        m = now.getMinutes();
        s = now.getSeconds();
        mil = now.getMilliseconds();
        exactS = s + mil / 1000;
        exactM = m + exactS / 60;
        exactH = h + exactM / 60;
        exactM = exactM + h * 60;
        return time = {
          hour: {
            val: h,
            deg: this.valToDeg(h, 12),
            exactDeg: this.valToDeg(exactH, 12)
          },
          minute: {
            val: m,
            deg: this.valToDeg(m, 60),
            exactDeg: this.valToDeg(exactM, 60)
          },
          second: {
            val: s,
            deg: this.valToDeg(s, 60)
          }
        };
      };

      Clocker.prototype.valToDeg = function(val, total) {
        return (360 * val / total) || 360;
      };

      Clocker.prototype.prefixVendor = function(property, val) {
        var prefix, properties, _fn, _i, _len, _ref;
        properties = {
          property: val
        };
        _ref = this.cssVendorPrefixes;
        _fn = function(prefix) {
          return properties["" + prefix + "-" + property] = val;
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prefix = _ref[_i];
          _fn(prefix);
        }
        return properties;
      };

      Clocker.prototype.cssVendorPrefixes = ['-webkit', '-moz', '-ms', '-o'];

      return Clocker;

    })();
    defer = function(callback) {
      return setTimeout(callback, 1);
    };
    return jQuery.fn.clocker = function(options) {
      var clocker;
      clocker = new Clocker(this, options);
      return clocker;
    };
  })(jQuery);

}).call(this);
