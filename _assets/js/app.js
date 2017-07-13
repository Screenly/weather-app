/**
 * Dependencies
 */
//= require vendor/moment-with-locales.min
//= require vendor/moment-timezone-with-data



/**
 * App utils
 */
//= require app.utils
//= require app.getLocalData
//= require app.getForecast



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
    var units = {
        temp: { us: 'F', si: 'º', ca: 'º', uk2: 'º', auto: 'º' }
    };
    var local, forecast, today;
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
         * Fill DOM with local info like city name, date, temperatures and next days forecast...
         */
        var elCity = document.querySelector("#location-today .location");
        elCity.innerHTML = (local.region_name || local.country_name) + ', ';

        var mmt = moment(today.time * 1000);
        mmt.tz(local.time_zone);

        var elToday = document.querySelector("#location-today .today");
        elToday.innerHTML = mmt.format('ddd D');

        var elTemp = document.querySelector("#temp");
        elTemp.innerHTML = Math.round(forecast.currently.temperature) + '<sup>' + units.temp[forecast.flags.units] + '</sup>';

        var elTempMax = document.querySelector("#temp-max");
        elTempMax.innerHTML = Math.round(today.apparentTemperatureMax) + units.temp[forecast.flags.units] + ' <b>max</b>';

        var elTempMin = document.querySelector("#temp-min");
        elTempMin.innerHTML = Math.round(today.apparentTemperatureMin) + units.temp[forecast.flags.units] + ' <b>min</b>';

        var elWeatherIcon = document.querySelector("#weather .wi");
        elWeatherIcon.className += ' wi-forecast-io-' + forecast.currently.icon;

        var elWeatherSum = document.querySelector("#weather b");
        elWeatherSum.innerHTML = forecast.currently.summary;

        var day, dayMmt, nextDaysList = '<ul>', 
        elNextDays = document.querySelector("#next-days");

        for (var i = 1; i < 5; i++) {
            day = forecast.daily.data[i];
            dayMmt = moment(day.time * 1000);
            dayMmt.tz(local.time_zone);
            nextDaysList += '<li>';
            nextDaysList += dayMmt.format('[<b>]ddd[</b>]');
            nextDaysList += '<b><i class="wi wi-forecast-io-' + day.icon + '"></i></b>';
            nextDaysList += '<b>' + Math.round(day.apparentTemperatureMax) + units.temp[forecast.flags.units] + '</b>';
            nextDaysList += '</li>';
        }
        nextDaysList += '</ul>';
        elNextDays.innerHTML = nextDaysList;



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

        sunriseTimeUnix = today.sunriseTime;
        sunsetTimeUnix = today.sunsetTime;

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
     * Get local information
     *
     * @since 0.0.1
     */
    // var ip = '85.139.5.121'; //Lisbon - Europe/Portugal
    var ip = '47.90.96.247'; //Alibaba - Asia/Hong_Kong

    var oReqLocal = window.srly.getLocalData (ip);
    if (oReqLocal) {
        oReqLocal.addEventListener("load", function(e) {
            // register local
            if (e.target.status === 200) {
                local = JSON.parse(e.target.response);

                // Lets get the forecast for location
                var oReqForecast = window.srly.getForecast(local.latitude, local.longitude);
                oReqForecast.addEventListener("load", function(e) {
                    // register local
                    if (e.target.status === 200) {
                        forecast = JSON.parse(e.target.response);
                        today = forecast.daily.data[0];

                        // Lets start changing DOM
                        init();
                    }
                });
            }
        });
    }
})();
