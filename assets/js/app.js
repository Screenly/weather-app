
/*
    ADD LEADING ZERO TO NUMBER
*/

Number.prototype.lead = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};


(function()
{
    /*
        -----------------------------------------------------------------------------------------------------
        GLOBAL CONFIGURATION
    */

    window.transitionEnd = window.transitionEnd || "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

    /*
        --------------------------------------------------------------------------------------------
        CREATE MAIN CLASS APP
    */

    Object.defineProperty (window, 'app',
    {
        __proto__    : null,
        writable     : false,
        configurable : true,
        enumerable   : true,
        value        :
        {
            getIcon : function(el)
            {
                var icon = el.dataset.icon;
                if (icon)
                {
                    icon = icon.replace (/-/g, '_').toUpperCase ();
                    return Skycons[icon];
                }
                else
                    return '';
            },




            init : function()
            {
                var current_canvas = document.getElementById ('icon_current');

                var week = document.getElementById('next-days');
                var next_canvas_1 = document.getElementById ('icon_next_1');
                var next_canvas_2 = document.getElementById ('icon_next_2');
                var next_canvas_3 = document.getElementById ('icon_next_3');
                var next_canvas_4 = document.getElementById ('icon_next_4');

                var skycons = new Skycons({"color": "white"});
                    skycons.add("icon_current", window.app.getIcon(current_canvas));
                    skycons.set("icon_next_1", window.app.getIcon(next_canvas_1));
                    skycons.set("icon_next_2", window.app.getIcon(next_canvas_2));
                    skycons.set("icon_next_3", window.app.getIcon(next_canvas_3));
                    skycons.set("icon_next_4", window.app.getIcon(next_canvas_4));

                    skycons.play();
            },


            /*
                -----------------------------------------------------------------------------------------------------
                RESIZE
            */

            resize : function()
            {
            },


            /*
                -----------------------------------------------------------------------------------------------------
                SCROLL
            */

            scroll : function()
            {
            },
        }
    });

    Object.defineProperty (app, 'extend',
    {
        __proto__    : null,
        writable     : false,
        configurable : false,
        enumerable   : false,
        value        : function ( name, value, target, writable, configurable, enumerable)
        {
            Object.defineProperty (target?target:app, name,
            {
                value        : value,
                writable     : writable     || false,
                configurable : configurable || false,
                enumerable   : enumerable   || false,
                __proto__    : null,
            });
        }
    });




    /*
        --------------------------------------------------------------------------------------------
        DEFAULT AND STATIC PROPERTIES
    */
    
    app.extend ( '_name', 'Weather Forecast');
    app.extend ( '_version', '1.0');
    app.extend ( '_credits', '© Screenly Apps. © 2016 WireLoad, Inc.');


    /*
        -----------------------------------------------------------------------------------------------------
        DOM READY
    */

    window.onload = window.app.init;





    /*
        -----------------------------------------------------------------------------------------------------
        WINDOW RESIZE
    */


    window.onresize = window.app.resize;
    window.app.resize ();


})();

(function()
{
    /*
        -----------------------------------------------------------------------------------------------------
        CLOCK
    */

    app.extend ( 'clock', new function ()
    {
        /*
            DOME ELEMENTS
        */
        
        var html = document.querySelector("html");
        var clockDom = document.getElementById ('footer-clock');

        /*
            TIME
        */

        var nowTime         = new Date();
        var nowTimeUnix     = nowTime.getTime()/1000;
        var sunsetTimeUnix  = parseFloat ( html.getAttribute('data-sunset') );
        var sunriseTimeUnix = parseFloat ( html.getAttribute('data-sunrise') );





        /*
            -----------------------------------------------------------------------------------------------------
            INIT
        */

        this.init = function()
        {
            window.app.clock.checkTime ();
            setInterval (window.app.clock.checkTime, 20000);
        };







        /*
            -----------------------------------------------------------------------------------------------------
            ADD MINUTES TO UNIX TIME
        */

        this.unixtimeToDate = function (unix)
        {
        	if (!unix)
        		return 0;

        	return new Date ( unix * 1000 );
        }







        /*
            -----------------------------------------------------------------------------------------------------
            ADD MINUTES TO UNIX TIME
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
        }







        /*
            -----------------------------------------------------------------------------------------------------
            ADD MINUTES TO UNIX TIME
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
        }







        /*
            -----------------------------------------------------------------------------------------------------
            TIME INTERVALL
        */

        this.checkTime = function (i)
        {
            /*
                CLOCK
            */

            nowTime = new Date();
            nowTimeUnix = nowTime.getTime()/1000;
            clockDom.innerHTML = nowTime.getHours() + ':' + (nowTime.getMinutes()).lead();


            /*
                BACKGROUND BASED ON TIME
            */

            // FULL DAY
            if ( nowTimeUnix > window.app.clock.unixtimeAddMinutes (sunriseTimeUnix, 4) && nowTimeUnix < window.app.clock.unixtimeSubtractMinutes (sunsetTimeUnix, 4) )
            {
                html.className = 'bg-day';
                return true;
            }

            // NIGHT
            if ( nowTimeUnix < sunriseTimeUnix || nowTimeUnix > sunsetTimeUnix )
            {
                html.className = 'bg-night';
                return true;
            }


            // SUNRISE
            if ( nowTimeUnix >= sunriseTimeUnix && nowTimeUnix < window.app.clock.unixtimeAddMinutes (sunriseTimeUnix, 4) )
            {
                html.className = 'bg-sunset';
                return true;
            }

            // SUNSET
            if ( nowTimeUnix >= window.app.clock.unixtimeSubtractMinutes (sunsetTimeUnix, 4) && nowTimeUnix < sunsetTimeUnix )
            {
                html.className = 'bg-sunset';
                return true;
            }
        };





        /*
            -----------------------------------------------------------------------------------------------------
            RESIZE
        */

        this.resize = function()
        {
        };




        /*
            -----------------------------------------------------------------------------------------------------
            SCROLL
        */

        this.scroll = function()
        {
        };
    });





    /*
        -----------------------------------------------------------------------------------------------------
        DOM READY
    */

    // window.onload = window.app.clock.init;
    window.app.clock.init();





    /*
        -----------------------------------------------------------------------------------------------------
        WINDOW RESIZE
    */


    // window.onresize = window.app.clock.resize;
    // window.app.clock.resize ();


})();

//# sourceMappingURL=app.js.map
