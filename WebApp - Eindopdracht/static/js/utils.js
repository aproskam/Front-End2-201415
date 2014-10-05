var APPIE = APPIE || {};

(function() {
    APPIE.Utils = {
        $: function (selector) {
            return document.querySelector(selector);
        },
        $$: function (selector) {
            return document.querySelectorAll(selector);
        },
        hasClass: function (element, className) {
            if (document.documentElement.classList) {
                return element.classList.contains(className);
            } else {
                var re = new RegExp('(^|\\s)' + className + '(\\s|$)');
                return element.className.match(re);
            }
        }
    };

})();