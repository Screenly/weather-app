(function()
{
    /*
     * CLOCK
     */
    app.extend ( 'clock', new function ()
    {
        /*
         * DOM ELEMENTS
         */
        var html = document.querySelector("html");
        var clockDom = document.getElementById ('footer-clock');

        /*
         * TIME
         */
        var nowTime         = new Date();
        var nowTimeUnix     = nowTime.getTime()/1000;
        var sunsetTimeUnix  = parseFloat ( html.getAttribute('data-sunset') );
        var sunriseTimeUnix = parseFloat ( html.getAttribute('data-sunrise') );


        /*
         * INIT
         */
        this.init = function()
        {
            window.app.clock.checkTime ();
            setInterval (window.app.clock.checkTime, 20000);
        };



        /*
         * ADD MINUTES TO UNIX TIME
         */
        this.unixtimeToDate = function (unix)
        {
        	if (!unix)
        		return 0;

        	return new Date ( unix * 1000 );
        };



        /*
         * ADD MINUTES TO UNIX TIME
         */
        this.unixtimeAddMinutes = function (unix, min)
        {
        	if (!unix)
        		return 0;
        	
        	if (!min || min<0)
        		min = 0;

        	var date = window.app.clock.unixtimeToDate(unix);
        		date.setMinutes(date.getMinutes() + min);
        	return date.getTime()/1000;
        };



        /*
         * ADD MINUTES TO UNIX TIME
         */
        this.unixtimeSubtractMinutes = function (unix, min)
        {
        	if (!unix)
        		return 0;
        	
        	if (!min || min<0)
        		min = 0;

        	var date = window.app.clock.unixtimeToDate(unix);
        		date.setMinutes(date.getMinutes() - min);
        	return date.getTime()/1000;
        };



        /*
         * TIME INTERVALL
         */
        this.checkTime = function (i)
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
            if (nowTimeUnix > window.app.clock.unixtimeAddMinutes (sunriseTimeUnix, 4) && nowTimeUnix < window.app.clock.unixtimeSubtractMinutes (sunsetTimeUnix, 4) )
            {
                // FULL DAY
                html.className = 'bg-day';
                return true;
            }

            if (nowTimeUnix < sunriseTimeUnix || nowTimeUnix > sunsetTimeUnix )
            {
                // NIGHT
                html.className = 'bg-night';
                return true;
            }

            if (nowTimeUnix >= sunriseTimeUnix && nowTimeUnix < window.app.clock.unixtimeAddMinutes (sunriseTimeUnix, 4) )
            {
                // SUNRISE
                html.className = 'bg-sunset';
                return true;
            }

            if (nowTimeUnix >= window.app.clock.unixtimeSubtractMinutes (sunsetTimeUnix, 4) && nowTimeUnix < sunsetTimeUnix )
            {
                // SUNSET
                html.className = 'bg-sunset';
                return true;
            }
        };




        /*
         * RESIZE
         */
        this.resize = function()
        {
        };



        /*
         * SCROLL
         */
        this.scroll = function()
        {
        };
    });




    /*
     * DOM READY
     */
    window.app.clock.init();




    /*
     * WINDOW RESIZE
     */
    // window.onresize = window.app.clock.resize;
    // window.app.clock.resize ();
})();
