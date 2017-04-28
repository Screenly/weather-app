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
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    };
})();
