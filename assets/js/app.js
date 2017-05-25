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

/**
 * This file should hold global script. Use app.utils for utilities.
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 */
(function() {
    /**
     * DOM ELEMENTS
     */
    var html = document.querySelector("html");
    var clockDom = document.getElementById('footer-clock');


    /**
     * HTML DOM ELEMENT HOLDING SERVER DATA
     */
    var mmt = moment();
        mmt.tz(html.getAttribute('data-timezone'));

    /**
     * SUNSET AND SUNRISE TIMES
     */
    var sunSpeed = 10*60000; // As in 10 minutes (winter)
    var sunriseTimeUnix, sunsetTimeUnix;
    var sunriseTimeConcat, sunriseEndTimeConcat, sunsetTimeConcat, sunsetEndTimeConcat;


    /**
     * INIT
     */
    function init () {
        sunriseTimeUnix = Number(html.getAttribute('data-sunrise'));
        sunsetTimeUnix  = Number(html.getAttribute('data-sunset'));

        // PREPARE VARIABLES FOR SUNRISE AND SUNSET INTERVAL
        var dt = new Date(sunriseTimeUnix*1000);
        sunriseTimeConcat = Number(dt.getHours()+''+dt.getMinutes());
        dt = new Date(sunriseTimeUnix*1000+sunSpeed);
        sunriseEndTimeConcat = Number(dt.getHours()+''+dt.getMinutes());

        dt = new Date(sunsetTimeUnix*1000);
        sunsetTimeConcat = Number(dt.getHours()+''+dt.getMinutes());
        dt = new Date(sunsetTimeUnix*1000+sunSpeed);
        sunsetEndTimeConcat = Number(dt.getHours()+''+dt.getMinutes());

        // START TIME
        checkTime();

        // CREATE LOOP
        setInterval(checkTime, 1000);
    }



    /**
     * ADD MINUTES TO UNIX TIME
     */
    function unixtimeToDate (unix) {
        return !unix ? 0 : new Date(unix * 1000);
    }



    /**
     * ADD MINUTES TO UNIX TIME
     */
    function unixtimeAddMinutes (unix, min) {
        if (!unix){
            return 0;
        }

        if (!min || min<0){
            min = 0;
        }

        var date = unixtimeToDate(unix);
        date.setMinutes(date.getMinutes() + min);
        return date.getTime()/1000;
    }



    /**
     * ADD MINUTES TO UNIX TIME
     */
    function unixtimeSubtractMinutes (unix, min) {
        if (!unix) {
            return 0;
        }

        if (!min || min<0) {
            min = 0;
        }

        var date = unixtimeToDate(unix);
        date.setMinutes(date.getMinutes() - min);
        return date.getTime()/1000;
    }



    /**
     * TIME INTERVALL
     */
    function checkTime () {
        var mmtHour = mmt.hours();
        var mmtMin  = mmt.minutes();
        var mmtUnix = mmt.unix();
        var mmtTimeConcat = Number(mmt.format('HHmm'));


        /**
         * CLOCK
         */
        clockDom.innerHTML = mmt.format('HH:mm') + '<sup>' + mmt.format('A') + '</sup>';


        /**
         * BACKGROUND BASED ON TIME
         */
        if (mmtTimeConcat >= sunriseTimeConcat && mmtTimeConcat <= sunriseEndTimeConcat ) {
            // SUNRISE
            html.className = 'bg-sunset';
            return true;
        }

        if (mmtTimeConcat > sunriseEndTimeConcat && mmtTimeConcat < sunsetTimeConcat ) {
            // FULL DAY
            html.className = 'bg-day';
            return true;
        }

        if (mmtTimeConcat >= sunsetTimeConcat && mmtTimeConcat <= sunsetEndTimeConcat ) {
            // SUNSET
            html.className = 'bg-sunset';
            return true;
        }

        // NONE OF THE ABOVE? IT'S NIGHT
        html.className = 'bg-night';
    }



    /**
     * ALL DONE LETS INIT
     */
    init ();
})();

//# sourceMappingURL=app.js.map
