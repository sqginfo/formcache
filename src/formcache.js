(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as anonymous module.
    define("formcache", ["jquery"], factory);
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function ($) {

  "use strict";

  var $window = $(window),
      sessionStorage = window.sessionStorage,
      localStorage = window.localStorage,

      // Constants
      STRING_UNDEFINED = "undefined",
      FORMCACHE_NAMESPACE = ".formcache",

      // Events
      EVENT_CHANGE = "change" + FORMCACHE_NAMESPACE,
      EVENT_BEFOREUNLOAD = "beforeunload" + FORMCACHE_NAMESPACE,

      isCheckboxOrRadio = function (input) {
        return input.type === "checkbox" || input.type === "radio";
      },

      toNumber = function (n) {
        return parseInt(n, 10);
      },

      // Constructor
      FormCache = function (form, options) {
        this.form = form;
        this.$form = $(form);
        this.defaults = $.extend({}, FormCache.DEFAULTS, $.isPlainObject(options) ? options : {});
        this.init();
      };

  FormCache.prototype = {
    constructor: FormCache,

    init: function () {
      var $this = this.$form,
          defaults = this.defaults,
          key = defaults.key || $this.data("key"),
          data;

      if (!key) {
        $("form").each(function (i) {
          $(this).data("key", i);
        });

        key = $this.data("key");
      }

      this.key = (key = (location.pathname + "#formcache-" + key));

      if (sessionStorage) {
        data = sessionStorage.getItem(key);
      }

      if (!data && localStorage) {
        data = localStorage.getItem(key);
      }

      this.caches = typeof data === "string" ? JSON.parse(data) : [];
      this.index = 0;
      this.activeIndex = 0;
      this.storing = null;

      if (!$.isArray(defaults.controls)) {
        defaults.controls = [];
      }

      this.$controls = $this.find(defaults.controls.join());

      this.addListeners();
      this.outputCache();
    },

    addListeners: function () {
      this.$controls.on(EVENT_CHANGE, (this._change = $.proxy(this.change, this)));
      $window.on(EVENT_BEFOREUNLOAD, (this._beforeunload = $.proxy(this.beforeunload, this)));
    },

    removeListeners: function () {
      this.$controls.off(EVENT_CHANGE, this._change);
      $window.off(EVENT_BEFOREUNLOAD, this._beforeunload);
    },

    change: function (e) {
      var input = e.target,
          $this = $(input),
          name = $this.attr("name"),
          value = [],
          tmpName,
          val;

      if (!name) {
        return;
      }

      tmpName = name.replace(/[\.\*\+\^\$\:\!\[\]#>~]+/g, ""); // Replaces unintended characters

      this.$controls.filter("[name*='" + tmpName + "']").each(function () {
        if (isCheckboxOrRadio(input)) {
          value.push(this.checked);
        } else {
          val = $(this).val();

          if (val) {
            value.push(val);
          }
        }
      });

      if (value.length) {
        this.update(name, value);

        clearTimeout(this.storing);
        this.storing = setTimeout($.proxy(this.store, this), 1000);
      }
    },

    beforeunload: function () {
      this.update();
      this.store();
    },

    update: function (name, value) {
      var activeIndex = this.activeIndex || this.index,
          cache = this.getCache(activeIndex);

      if (typeof name === "string") {
        cache[name] = value;
      } else {
        cache = this.serialize();
      }

      this.setCache(activeIndex, cache);
    },

    serialize: function () {
      var cache = {};

      this.$controls.each(function () {
        var $this = $(this),
            name = $this.attr("name"),
            value,
            val;

        if (!name) {
          return;
        }

        value = cache[name];
        value = $.isArray(value) ? value : [];

        if (isCheckboxOrRadio(this)) {
          value.push(this.checked);
        } else {
          val = $this.val();

          if (val) {
            value.push(val);
          }
        }

        if (value.length) {
          cache[name] = value;
        }
      });

      return cache;
    },

    getCache: function (index) {
      return this.caches[(toNumber(index) || this.index)] || {};
    },

    getCaches: function () {
      return this.caches;
    },

    setCache: function (index, data) {
      if (typeof data === STRING_UNDEFINED) {
        data = index;
        index = NaN;
      }

      if ($.isPlainObject(data)) {
        index = toNumber(index) || this.index;
        this.caches[index] = data;
        this.store();
      }
    },

    setCaches: function (data) {
      if ($.isArray(data)) {
        this.caches = data;
        this.store();
      }
    },

    removeCache: function (index) {
      this.caches.splice((toNumber(index) || this.index), 1);
      this.store();
    },

    removeCaches: function () {
      this.caches = [];
      this.store();
    },

    outputCache: function (index) {
      var cache = this.getCache(index);

      if ($.isPlainObject(cache)) {

        this.activeIndex = toNumber(index) || this.index;

        // Clone a new one deeply, avoid to change the original data
        cache = $.extend(true, {}, cache);

        this.$controls.each(function () {
          var $this = $(this),
              name = $this.attr("name"),
              value,
              val;

          if (!name) {
            return;
          }

          value = cache[name];

          if ($.isArray(value) && value.length) {
            val = value.shift();

            if (isCheckboxOrRadio(this)) {
              this.checked = val;
            } else {
              $this.val(val);
            }
          }
        });
      }
    },

    store: function () {
      var caches = this.caches,
          key = this.key,
          defaults = this.defaults;

      if (!$.isArray(caches)) {
        return;
      }

      caches = JSON.stringify(caches);

      if (defaults.session && sessionStorage) {
        sessionStorage.setItem(key, caches);
      }

      if (defaults.local && localStorage) {
        localStorage.setItem(key, caches);
      }
    },

    clear: function () {
      var key = this.key,
          defaults = this.defaults;

      if (defaults.session && sessionStorage) {
        sessionStorage.removeItem(key);
      }

      if (defaults.local && localStorage) {
        localStorage.removeItem(key);
      }
    },

    destroy: function () {
      this.removeListeners();
      this.$form.removeData("formcache");
    }
  };

  FormCache.DEFAULTS = {
    key: "",
    local: true,
    session: true,
    controls: [
      "select",
      "textarea",
      "input"
      // "input[type='text']",
      // "input[type='password']",
      // "input[type='datetime']",
      // "input[type='checkbox']",
      // "input[type='radio']",
      // "input[type='datetime-local']",
      // "input[type='date']",
      // "input[type='month']",
      // "input[type='time']",
      // "input[type='week']",
      // "input[type='number']",
      // "input[type='email']",
      // "input[type='url']",
      // "input[type='search']",
      // "input[type='tel']",
      // "input[type='color']"
    ]
  };

  FormCache.setDefaults = function (options) {
    $.extend(FormCache.DEFAULTS, options);
  };

  // Save the other formcache
  FormCache.other = $.fn.formcache;

  // Register as jQuery plugin
  $.fn.formcache = function (options) {
    var args = [].slice.call(arguments, 1),
        result;

    this.each(function () {
      var $this = $(this),
          data = $this.data("formcache"),
          fn;

      if (!data) {
        $this.data("formcache", (data = new FormCache(this, options)));
      }

      if (typeof options === "string" && $.isFunction((fn = data[options]))) {
        result = fn.apply(data, args);
      }
    });

    return typeof result !== STRING_UNDEFINED ? result : this;
  };

  $.fn.formcache.Constructor = FormCache;
  $.fn.formcache.setDefaults = FormCache.setDefaults;

  // No conflict
  $.fn.formcache.noConflict = function () {
    $.fn.formcache = FormCache.other;
    return this;
  };

  $(function () {
    $("form[data-toggle='formcache']").formcache();
  })
});
