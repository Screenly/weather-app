/**
 * Dependencies
 */
//= require vendor/moment-with-locales.min
//= require vendor/moment-timezone-with-data

/**
 * App utils
 */
//= require app.utils

/**
 * This file should hold global script. Use app.utils for utilities.
 *

 * @since    0.0.1
 */
(function() {
    /**
     * DOM elements
     *
     * @since 0.0.1
     */
    var html = document.querySelector("html");
    var clockDom = document.getElementById('footer-clock');


    /**
     * Global vars
     *
     * @since 0.0.1
     */
    var local, forecast;
    var sunSpeed = 10 * 60000; // As in 10 minutes (winter)
    var sunriseTimeUnix, sunsetTimeUnix;
    var sunriseTimeConcat, sunriseEndTimeConcat, sunsetTimeConcat, sunsetEndTimeConcat;


    /**
     * After all functions and vars are declared we run init.
     *
     * @since 0.0.1
     */
    function init() {

        /**
         * Fill DOM with local info like city name and date
         */
        var elCity = document.querySelector("#location-today .location");
        elCity.innerHTML = (local.region_name || local.country_name) + ', ';


        var mmt = moment(forecast.daily.data[1]);
        mmt.tz(local.time_zone);

        var elToday = document.querySelector("#location-today .today");
        elToday.innerHTML = mmt.format('ddd D');



        /**
         * Configure sunset and sunrise intervals for background animation
         */
        checkSunriseSunset();


        /**
         * Run time process for first time
         *
         * @since 0.0.1
         */
        checkTime();


        /**
         * Start the loop that will be updating everytime
         *
         * @since 0.0.1
         */
        setInterval(checkTime, 1000);
    }


    /**
     * Configure sunset and sunrise intervals for background animation
     *
     * @since 0.0.1
     */
    function checkSunriseSunset() {

        var mmt = moment();
        mmt.tz(local.time_zone);

        sunriseTimeUnix = Number(html.getAttribute('data-sunrise'));
        sunsetTimeUnix = Number(html.getAttribute('data-sunset'));

        // Sunrise
        var sunMoment = moment(sunriseTimeUnix * 1000);
        sunMoment.tz(local.time_zone);
        sunriseTimeConcat = sunMoment.format('Hmm');

        // Sunrise end point
        sunMoment = moment(sunriseTimeUnix * 1000 + sunSpeed);
        sunMoment.tz(local.time_zone);
        sunriseEndTimeConcat = sunMoment.format('Hmm');

        // Sunset
        sunMoment = moment(sunsetTimeUnix * 1000);
        sunMoment.tz(local.time_zone);
        sunsetTimeConcat = sunMoment.format('Hmm');

        // Sunset end point
        sunMoment = moment(sunsetTimeUnix * 1000 + sunSpeed);
        sunMoment.tz(local.time_zone);
        sunsetEndTimeConcat = sunMoment.format('Hmm');

        sunMoment = null; // Clean it, we're not using it anymore
    }



    /**
     * Checktime
     * Changes DOM clock time and determines if background needs to be changed in
     * order to represent the day light, sunset/sunrize or night
     *
     * @since 0.0.1
     */
    function checkTime() {

        mmt = moment();
        mmt.tz(local.time_zone);
        var mmtTimeConcat = Number(mmt.format('HHmm'));


        /**
         * Draw DOM clock
         */
        clockDom.innerHTML = mmt.format('HH:mm');

        /**
         * Change background image based on time
         */
        if (sunriseTimeConcat <= mmtTimeConcat && mmtTimeConcat <= sunriseEndTimeConcat) {
            // SUNRISE
            html.className = 'bg-sunset';
            return true;
        } else if (sunriseEndTimeConcat < mmtTimeConcat && mmtTimeConcat < sunsetTimeConcat) {
            // FULL DAY
            html.className = 'bg-day';
            return true;
        } else if (sunsetTimeConcat <= mmtTimeConcat && mmtTimeConcat <= sunsetEndTimeConcat) {
            // SUNSET
            html.className = 'bg-sunset';
            return true;
        } else {
            // NONE OF THE ABOVE? IT'S NIGHT
            html.className = 'bg-night';
        }
    }




    /**
     * Get forecast information
     *
     * @since 0.0.1
     */
    function getForecast() {

        var oReqParam = JSON.stringify({ lat: local.latitude, long: local.longitude});
        var oReq = new XMLHttpRequest();

        oReq.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
                var percent = Math.round(e.loaded * 100 / e.total);
            } else {
                console.warn('getForecast: Unable to compute progress information since the total size is unknown');
            }
        });

        oReq.addEventListener("error", function(e) {
            console.error("getForecast: An error occurred.");
        });

        oReq.addEventListener("abort", function(e) {
            console.warn("getForecast: Transfer canceled by the user.");
        });

        oReq.addEventListener("load", function(e) {
            console.log("getForecast: Transfer complete.");

            // register local
            if (e.target.status === 200) {
                forecast = JSON.parse(e.target.response);
                console.log(forecast);

                // Lets start changing DOM
                init ();
            }
        });

        oReq.open('POST', 'http://localhost:5000/v1/weather', true);
        oReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
        oReq.send(oReqParam);
    }




    /**
     * Get local information
     *
     * @since 0.0.1
     */
    function getLocal(ip) {

        var oReqParam = JSON.stringify({ ip: ip });
        var oReq = new XMLHttpRequest();

        oReq.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
                var percent = Math.round(e.loaded * 100 / e.total);
            } else {
                console.warn('getLocal: Unable to compute progress information since the total size is unknown');
            }
        });

        oReq.addEventListener("error", function(e) {
            console.error("getLocal: An error occurred.");
        });

        oReq.addEventListener("abort", function(e) {
            console.warn("getLocal: Transfer canceled by the user.");
        });

        oReq.addEventListener("load", function(e) {
            console.log("getLocal: Transfer complete.");

            // register local
            if (e.target.status === 200) {
                local = JSON.parse(e.target.response);
                console.log(local);
            }

            // Lets get the forecast for location
            getForecast();
        });

        oReq.open('POST', 'http://localhost:5000/v1/location', true);
        oReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
        oReq.send(oReqParam);
    }

    // Lets start with getting local information
    // getLocal('85.139.5.121');
    getLocal('47.90.96.247'); //Alibaba - Asia/Hong_Kong
})();
