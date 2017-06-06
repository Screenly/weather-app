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
     * DOM elements
     *
     * @category ScreenlyApps
     * @package  WeatherForecast
     * @author   Original Peter Monte <pmonte@screenly.io>
     * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
     * @link     https://github.com/wireload
     * @since    0.0.1
     */
    var html = document.querySelector("html");
    var clockDom = document.getElementById('footer-clock');


    /**
     * Global vars
     *
     * @category ScreenlyApps
     * @package  WeatherForecast
     * @author   Original Peter Monte <pmonte@screenly.io>
     * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
     * @link     https://github.com/wireload
     * @since    0.0.1
     */
    var timezone = html.getAttribute('data-timezone');
    var sunSpeed = 10 * 60000; // As in 10 minutes (winter)
    var sunriseTimeUnix, sunsetTimeUnix;
    var sunriseTimeConcat, sunriseEndTimeConcat, sunsetTimeConcat, sunsetEndTimeConcat;


    /**
     * We pick up all the server data in HTML tag attributes
     *
     * @category ScreenlyApps
     * @package  WeatherForecast
     * @author   Original Peter Monte <pmonte@screenly.io>
     * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
     * @link     https://github.com/wireload
     * @since    0.0.1
     */
    var mmt = moment();
    mmt.tz(timezone);


    /**
     * After all functions and vars are declared we run init.
     *
     * @category ScreenlyApps
     * @package  WeatherForecast
     * @author   Original Peter Monte <pmonte@screenly.io>
     * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
     * @link     https://github.com/wireload
     * @since    0.0.1
     */
    function init() {
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
         * @category ScreenlyApps
         * @package  WeatherForecast
         * @author   Original Peter Monte <pmonte@screenly.io>
         * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
         * @link     https://github.com/wireload
         * @since    0.0.1
         */
        checkTime();


        /**
         * Start the loop that will be updating everytime
         *
         * @category ScreenlyApps
         * @package  WeatherForecast
         * @author   Original Peter Monte <pmonte@screenly.io>
         * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
         * @link     https://github.com/wireload
         * @since    0.0.1
         */
        setInterval(checkTime, 1000);
    }



    /**
     * Checktime
     * Changes DOM clock time and determines if background needs to be changed in
     * order to represent the day light, sunset/sunrize or night
     *
     * @category ScreenlyApps
     * @package  WeatherForecast
     * @author   Original Peter Monte <pmonte@screenly.io>
     * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
     * @link     https://github.com/wireload
     * @since    0.0.1
     */
    function checkTime() {
        var mmtTimeConcat = Number(mmt.format('HHmm'));

        /**
         * Draw DOM clock
         */
        clockDom.innerHTML = mmt.format('HH:mm') + '<sup>' + mmt.format('A') + '</sup>';

        /**
         * Change background image based on time
         */
        if (mmtTimeConcat >= sunriseTimeConcat && mmtTimeConcat <= sunriseEndTimeConcat) {
            // SUNRISE
            html.className = 'bg-sunset';
            return true;
        } else if (mmtTimeConcat > sunriseEndTimeConcat && mmtTimeConcat < sunsetTimeConcat) {
            // FULL DAY
            html.className = 'bg-day';
            return true;
        } else if (mmtTimeConcat >= sunsetTimeConcat && mmtTimeConcat <= sunsetEndTimeConcat) {
            // SUNSET
            html.className = 'bg-sunset';
            return true;
        } else {
            // NONE OF THE ABOVE? IT'S NIGHT
            html.className = 'bg-night';
        }
    }



    /**
     * All done let's init
     *
     * @category ScreenlyApps
     * @package  WeatherForecast
     * @author   Original Peter Monte <pmonte@screenly.io>
     * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
     * @link     https://github.com/wireload
     * @since    0.0.1
     */
    init();
})();
