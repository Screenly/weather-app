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
        clockDom.innerHTML = nowTime.getHours() + ':' + (nowTime.getMinutes()).lead();


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
