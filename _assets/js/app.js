/**
 * Dependencies
 */
//= require vendor/moment-with-locales.min
//= require vendor/moment-timezone-with-data



/**
 * App utils
 */
//= require app.utils
//= require app.getQueryVar
//= require app.getLocalData
//= require app.getForecast
//= require app.dayTime



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
    var creditsYearDom = document.querySelector('#credits-year');





    /**
     * Global vars
     *
     * @since 0.0.1
     */
    var units = {
        temp: { us: 'F', si: 'C', ca: 'C', uk2: 'C' }
    };
    var local, forecast, today;
    var lat = window.srly.getQueryVar('lat');
    var lng = window.srly.getQueryVar('lng');
    var ip = window.srly.getQueryVar('ip');
    // ip tests '85.139.5.121'; //Lisbon - Europe/Portugal | '47.90.96.247'; //Alibaba - Asia/Hong_Kong





    /**
     * After all functions and vars are declared we run init.
     *
     * @since 0.0.1
     */
    function init() {

        var mmt = moment(today.time * 1000);
        mmt.tz(forecast.timezone);

        /**
         * Fill DOM with local info like city name, date, temperatures and next days forecast...
         */
        var localName = local.city || local.county || local.state || local.country_long;
        if (typeof localName === "undefined"){
            localName = '';
        }
        var elLocationToday = document.querySelector("#location-today");
        elLocationToday.innerHTML = '<b>' + localName + (localName? ', ' : '') + mmt.format('ddd D') + '</b>';
        window.srly.scaleElementFontSize(document.querySelector("#location-today b"));
        var elLocationTodayB = document.querySelector("#location-today b");
        window.addEventListener('resize', function(e){
            window.srly.scaleElementFontSize(elLocationTodayB);
        });

        var elTemp = document.querySelector("#temp");
        elTemp.innerHTML = Math.round(forecast.currently.temperature) + '<sup>º</sup>';

        var elTempMax = document.querySelector("#temp-max");
        elTempMax.innerHTML = '<i class="mdi mdi-arrow-up"></i>' + Math.round(today.apparentTemperatureMax) + 'º';

        var elTempMin = document.querySelector("#temp-min");
        elTempMin.innerHTML = '<i class="mdi mdi-arrow-down"></i>' + Math.round(today.apparentTemperatureMin) + 'º';

        var elWeatherIcon = document.querySelector("#weather .wi");
        elWeatherIcon.className += ' wi-forecast-io-' + forecast.currently.icon;

        var elWeatherSum = document.querySelector("#weather b");
        elWeatherSum.innerHTML = forecast.currently.summary;

        var day, dayMmt, nextDaysList = '<ul>',
            elNextDays = document.querySelector("#next-days");


        /**
         * Next days
         */
        for (var i = 1; i < 5; i++) {
            day = forecast.daily.data[i];
            dayMmt = moment(day.time * 1000);
            dayMmt.tz(forecast.timezone);
            nextDaysList += '<li>';
            nextDaysList += dayMmt.format('[<b>]ddd[</b>]');
            nextDaysList += '<b><i class="wi wi-forecast-io-' + day.icon + '"></i></b>';
            nextDaysList += '<b>' + Math.round(day.apparentTemperatureMax) + 'º</b>';
            nextDaysList += '</li>';
        }
        nextDaysList += '</ul>';
        elNextDays.innerHTML = nextDaysList;




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

        showScreenlyBanner();
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
        mmt.tz(forecast.timezone);
        var mmtTimeConcat = Number(mmt.format('HHmm'));


        /**
         * Draw DOM clock
         */
        clockDom.innerHTML = mmt.format('HH:mm');



        /**
         * Credits year
         */
        creditsYearDom.innerHTML = mmt.format('YYYY');



        /**
         * Change background image based on time
         */
        var daytime = window.srly.getDayTime (
            forecast.timezone,
            today.sunriseTime,
            today.sunsetTime
        );

        if (daytime.sunset || daytime.sunrise) {
            html.className = 'bg-sunset';
        } else if (daytime.daylight) {
            html.className = 'bg-day';
        } else {
            html.className = 'bg-night';
        }
    }





    /**
     * Display a Screenly banner if not a Screenly-Pro player
     */
    var showScreenlyBanner = function() {
        var screenlyUserAgent = 'screenly-viewer';
        var playerUserAgent = navigator.userAgent;
        if (!(playerUserAgent.includes(screenlyUserAgent))) {
            document.querySelector("#banner").style.visibility = 'visible';
        }
    };




    /**
     * Get forecast information
     *
     * @since 0.0.1
     */
    var getForecast = function(lat, lng) {

        // Lets get the forecast for location
        var oReqForecast = window.srly.getForecast(lat, lng);
        oReqForecast.addEventListener("load", function(e) {
            // register local
            if (e.target.status === 200) {
                forecast = JSON.parse(e.target.response);
                today = forecast.daily.data[0];

                // Lets start changing DOM
                init();
            }
        });
    };





    /**
     * We start the app getting local information like city name based on an IP 
     * input, lat and long or simply IP autodetection on server side.
     *
     * @since 0.0.1
     */
    var getLocalData = function() {

        var param = {};

        if (lat && lng) {
            param.lat = lat;
            param.lng = lng;
        } else if (ip) {
            param.ip = ip;
        }

        var oReq = window.srly.getLocalData(param);
        if (oReq) {
            oReq.addEventListener("load", function(e) {
                // register local
                if (e.target.status === 200) {
                    var json = JSON.parse(e.target.response);
                    local = json.properties;
                    if ('lat' in local && 'lng' in local) {
                        getForecast(local.lat, local.lng);
                    } else {
                        var latlng = local.location.split(',');
                        getForecast(latlng[0], latlng[1]);
                    }
                }
            });
        }
    }();
})();
