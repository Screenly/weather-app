(function ()
{
    /**
     * GLOBAL CONFIGURATION
     */
    window.transitionEnd = window.transitionEnd || "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";



    /**
     * ADD LEADING ZERO TO NUMBER
     */
    Number.prototype.lead = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {
            s = "0" + s;
        }
        return s;
    };





    /**
     * GET ELEMENT INNER WIDTH
     */
    function getInnerWidth (el)
    {
        if (!el) {
            return 0;
        }

        var width = 0;
        var children = el.children;
        if (children.length>0) {
            for (var i = 0; i < children.length; i++) {
                width += children[i].offsetWidth;
            }
        }
        else {
            width = el.offsetWidth;
        }

        return width;
    }




    /**
     * SCALE FONTS TO FIT WIDTH AND VOID WORD WRAP
     */
    var scalableFonts = document.querySelectorAll(".scale-font");
    if (scalableFonts.length>0) {
        for(var i=0; i<scalableFonts.length; i++) {
            var el = scalableFonts[i];
            var parent = el.parentElement;
            var parentWidth = parent.offsetWidth;
            var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            while (parentWidth < getInnerWidth(el)) {
                fontSize-=0.5;
                el.style.fontSize = fontSize + 'px';
            }
        }
    }
})();
