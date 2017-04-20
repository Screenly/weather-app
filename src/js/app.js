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
    app.extend ( '_credits', '© Screenly Apps. © 2016 Screenly, Inc.');


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
