(function() {

    window.srly = window.srly || {};

    /**
     * Check the full width of an element including its children's width.
     *
     * @since 0.0.1
     */
    window.srly.getInnerWidth = function(el) {
        if (!el) {
            return 0;
        }

        var width = 0;
        var children = el.children;
        if (children.length) {
            for (var i = 0; i < children.length; i++) {
                width += children[i].offsetWidth;
            }
        } else {
            width = el.offsetWidth;
        }

        return width;
    };




    /**
     * Reduce the size of an element by reducing it's font size
     *
     * @since 0.0.1
     */
    window.srly.scalableFonts = function() {
        var scalableFonts = document.querySelectorAll(".scale-font");
        if (scalableFonts.length > 0) {
            for (var i = 0; i < scalableFonts.length; i++) {
                var el = scalableFonts[i];
                var parent = el.parentElement;
                var parentWidth = parent.offsetWidth;
                var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
                var fontSize = parseFloat(style);
                while (parentWidth < window.srly.getInnerWidth(el)) {
                    fontSize -= 0.5;
                    el.style.fontSize = fontSize + 'px';
                }
            }
        }
    }();
})();
