(function() {

    window.srly = window.srly || {};

    /**
     * Check the full width of an element including its children's width.
     *
     * @param {Element} [el] Required.
     * 
     * @since 0.0.1
     *
     * @return {boolean}
     */
    window.srly.getElementInnerWidth = function(el) {

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
     *
     * @return {boolean}
     */
    window.srly.scaleElementFontSize = function(el) {

        if (!el) {
            return false;
        }

        var parent = el.parentElement;
        var parentStyle = window.getComputedStyle(parent, null);
        var parentWidth = parent.offsetWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight) - parseFloat(parentStyle.borderLeftWidth) - parseFloat(parentStyle.borderRightWidth);
        var style = window.getComputedStyle(el, null);
        var fontSize = parseFloat(style.getPropertyValue('font-size'));


        // REDUCE
        if (parentWidth < window.srly.getElementInnerWidth(el)) {
            while (parentWidth < window.srly.getElementInnerWidth(el)) {
                fontSize -= 0.5;
                el.style.fontSize = fontSize + 'px';
            }
        }

        // INCREASE
        if (parentWidth > window.srly.getElementInnerWidth(el)) {
            while (parentWidth > window.srly.getElementInnerWidth(el)) {
                fontSize += 0.5;
                el.style.fontSize = fontSize + 'px';
            }
        }

        return true;
    };




    /**
     * Get all element with class `.scale-font` and reduce font size.
     *
     * @since 0.0.1
     */
    var scalableFonts = document.querySelectorAll(".scale-font");
    window.srly.scaleElementsFontSize = function() {
        for (var i = 0; i < scalableFonts.length; i++) {
            window.srly.scaleElementFontSize(scalableFonts[i]);
        }
    };
})();
