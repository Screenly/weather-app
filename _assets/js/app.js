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
    var timezone = html.getAttribute('data-timezone');
    var sunSpeed = 10 * 60000; // As in 10 minutes (winter)
    var sunriseTimeUnix, sunsetTimeUnix;
    var sunriseTimeConcat, sunriseEndTimeConcat, sunsetTimeConcat, sunsetEndTimeConcat;


    /**
     * After all functions and vars are declared we run init.
     *
     * @since 0.0.1
     */
    function init() {

        var mmt = moment();
        mmt.tz(timezone);

        sunriseTimeUnix = Number(html.getAttribute('data-sunrise'));
        sunsetTimeUnix = Number(html.getAttribute('data-sunset'));

        // Sunrise
        var sunMoment = moment(sunriseTimeUnix * 1000);
        sunMoment.tz(timezone);
        sunriseTimeConcat = sunMoment.format('Hmm');

        // Sunrise end point
        sunMoment = moment(sunriseTimeUnix * 1000 + sunSpeed);
        sunMoment.tz(timezone);
        sunriseEndTimeConcat = sunMoment.format('Hmm');

        // Sunset
        sunMoment = moment(sunsetTimeUnix * 1000);
        sunMoment.tz(timezone);
        sunsetTimeConcat = sunMoment.format('Hmm');

        // Sunset end point
        sunMoment = moment(sunsetTimeUnix * 1000 + sunSpeed);
        sunMoment.tz(timezone);
        sunsetEndTimeConcat = sunMoment.format('Hmm');

        sunMoment = null; // Clean it, we're not using it anymore


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
     * Checktime
     * Changes DOM clock time and determines if background needs to be changed in
     * order to represent the day light, sunset/sunrize or night
     *
     * @since 0.0.1
     */
    function checkTime() {
        mmt = moment();
        mmt.tz(timezone);
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
     * Get weather forecast
     *
     * @since 0.0.1
     */
    function onRequestReady() {
        if (oReq.readyState === 4) {
            if (oReq.status === 200) {
                console.log('done');
            } else {
                console.log('An error occurred during your oReq: ' + oReq.status + ' ' + oReq.statusText);
            }
        }
    }

    function onRequestProgress(e) {
        if (e.lengthComputable) {
            var percentComplete = Math.floor(e.loaded * 100 / e.total);
            console.log(e.loaded, e.total, percentComplete + '%');
        } else {
            console.log('Unable to compute progress information since the total size is unknown');
        }
    }

    function onRequestFailed(e) {
        console.log("An error occurred while transferring the file.");
    }

    function onRequestCanceled(e) {
        console.log("The transfer has been canceled by the user.");
    }

    function onRequestComplete(e) {
        console.log("The transfer is complete.");

        /**
         * All done let's init
         *
         * @since 0.0.1
         */
        init();
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("onreadystatechange", onRequestReady);
    oReq.addEventListener("progress", onRequestProgress);
    oReq.addEventListener("load", onRequestComplete);
    oReq.addEventListener("error", onRequestFailed);
    oReq.addEventListener("abort", onRequestCanceled);
    oReq.open('Get', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/Bio.txt');
    oReq.send();
})();
