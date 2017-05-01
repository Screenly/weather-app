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
    var scalableFonts = document.querySelectorAll (".scale-font");
    if (scalableFonts.length>0) {
        for(var i=0; i<scalableFonts.length; i++) {
            var el = scalableFonts[i];
            var parent = el.parentElement;
            var parentWidth = parent.offsetWidth;
            var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            while (parentWidth < getInnerWidth (el)) {
                fontSize-=0.5;
                el.style.fontSize = fontSize + 'px';
            }
        }
    }
})();


(function()
{
    /**
     * DOM ELEMENTS
     */
    var html = document.querySelector("html");
    var clockDom = document.getElementById ('footer-clock');

    /**
     * TIME
     */
    var nowTime         = new Date();
    var nowTimeUnix     = nowTime.getTime()/1000;
    var sunsetTimeUnix  = parseFloat ( html.getAttribute('data-sunset') );
    var sunriseTimeUnix = parseFloat ( html.getAttribute('data-sunrise') );


    /**
     * INIT
     */
    function init ()
    {
        checkTime ();
        setInterval (checkTime, 1000);
    }



    /**
     * ADD MINUTES TO UNIX TIME
     */
    function unixtimeToDate (unix)
    {
        if (!unix){
            return 0;
        }

        return new Date ( unix * 1000 );
    }



    /**
     * ADD MINUTES TO UNIX TIME
     */
    function unixtimeAddMinutes (unix, min)
    {
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
    function unixtimeSubtractMinutes (unix, min)
    {
        if (!unix){
            return 0;
        }
        
        if (!min || min<0){
            min = 0;
        }

        var date = unixtimeToDate(unix);
            date.setMinutes(date.getMinutes() - min);
        return date.getTime()/1000;
    }



    /**
     * TIME INTERVALL
     */
    function checkTime (i)
    {
        /*
         * CLOCK
         */
        nowTime = new Date();
        nowTimeUnix = nowTime.getTime()/1000;
        var hour = nowTime.getHours();
        clockDom.innerHTML = hour.lead() + ':' + (nowTime.getMinutes()).lead() + (hour<13?'<sup>AM</sub>':'');


        /*
         * BACKGROUND BASED ON TIME
         */
        if (nowTimeUnix > unixtimeAddMinutes(sunriseTimeUnix, 4) && nowTimeUnix < unixtimeSubtractMinutes(sunsetTimeUnix, 4) ) {
            // FULL DAY
            html.className = 'bg-day';
            return true;
        }

        if (nowTimeUnix < sunriseTimeUnix || nowTimeUnix > sunsetTimeUnix ) {
            // NIGHT
            html.className = 'bg-night';
            return true;
        }

        if (nowTimeUnix >= sunriseTimeUnix && nowTimeUnix < unixtimeAddMinutes(sunriseTimeUnix, 4) ) {
            // SUNRISE
            html.className = 'bg-sunset';
            return true;
        }

        if (nowTimeUnix >= unixtimeSubtractMinutes(sunsetTimeUnix, 4) && nowTimeUnix < sunsetTimeUnix ) {
            // SUNSET
            html.className = 'bg-sunset';
            return true;
        }
    }






    /**
     * ALL DONE LET'S INIT
     */
    init ();
})();

//# sourceMappingURL=app.js.map
