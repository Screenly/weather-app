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
    var clockDom = document.getElementById('top-clock');
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
    var wind_speed = window.srly.getQueryVar('wind_speed')  === '1';
    var clock_format_24h = window.srly.getQueryVar('24h');
    var lang = window.srly.getQueryVar('lang');
    // ip tests '85.139.5.121'; //Lisbon - Europe/Portugal | '47.90.96.247'; //Alibaba - Asia/Hong_Kong





    /**
     * After all functions and vars are declared we run init.
     *
     * @since 0.0.1
     */
    function init() {

        if ('country_lang' in forecast) {
            moment.locale(forecast.country_lang);
        }

        var mmt = moment(today.time * 1000);
        mmt.tz(forecast.timezone);

        /**
         * Fill DOM with local info like city name, date, temperatures and next days forecast...
         */
        var localName = local.city || local.country || local.continent;
        var elToday = document.querySelector("#today");

        var elLocation = document.querySelector('#location');
        if (typeof localName === "undefined"){
            elToday.style['width'] = '25%';
            elToday.style['min-width'] = '25%';
            elToday.innerHTML = '<span class="font-size">' + mmt.format('D MMM YYYY') + '</span>';
            elLocation.innerHTML = '<b>' + localName + (localName? ', ' : '') + '</b>';
        } else {
            elToday.innerHTML = '<span>' + mmt.format('D MMM YYYY') + '</span>';
            elLocation.innerHTML = '<b>' + localName + (localName ? '' : '') + '</b>';
        }

        window.srly.scaleElementFontSize(document.querySelector("#location b"));
        var elLocationB = document.querySelector("#location b");
        window.addEventListener('resize', function(e){
            window.srly.scaleElementFontSize(elLocationB);
        });

        var descProbability = document.querySelector('#desc-probability');
        var descHumidity = document.querySelector('#desc-humidity');
        descProbability.innerText = 'PRECIPITATION';
        descHumidity.innerText = 'HUMIDITY';

        var elTemp = document.querySelector("#temp");
        elTemp.innerHTML =  Math.round(forecast.currently.temperature) + '<sup>&deg;</sup>';

        var elHumidity = document.querySelector("#humidity");
        elHumidity.innerHTML = Math.round(today.humidity * 100) + '%';

        var elProbability = document.querySelector("#probability");
        elProbability.innerHTML = Math.round(today.precipProbability * 100) + '%';

        var elWeatherIcon = document.querySelector("#weather .wi");
        elWeatherIcon.className += ' wi-forecast-io-' + forecast.currently.icon;

        var elWeatherSum = document.querySelector("#weather-summary");
        elWeatherSum.innerHTML = '<b>' + forecast.currently.summary + '</b>';

        if (wind_speed){
            var elWindSpeed = document.querySelector("#wind b");
            elWindSpeed.innerHTML = forecast.currently.windSpeed + ' m/s';
        }

        var day, dayMmt, nextDaysList = '<ul>',
            elNextDays = document.querySelector("#next-days");


        /**
         * Next days
         */
        var with_wind_speed_class = wind_speed ? 'class="with_wind_speed"' : '';
        for (var i = 1; i < 6; i++) {
            day = forecast.daily.data[i];
            dayMmt = moment(day.time * 1000);
            dayMmt.tz(forecast.timezone);
            nextDaysList += '<li ' + with_wind_speed_class + '>';
            nextDaysList += '<b ' + with_wind_speed_class + '><i class="wi wi-forecast-io-' + day.icon + '"></i></b>';
            nextDaysList += '<p><b ' + with_wind_speed_class + '>' + Math.round(day.apparentTemperatureMax) + '&#176;</b> <b class="min-temp-day">' + Math.round(day.apparentTemperatureMin) + '&#176;</b></p>';
            if (wind_speed) {
                nextDaysList += '<b ' + with_wind_speed_class + '>' + Math.round(day.windSpeed) + ' m/s</b>';
            }
            nextDaysList += dayMmt.format('[<b ' + with_wind_speed_class + '>]ddd[</b>]');
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
        switch (clock_format_24h) {
            case '1':
                clockDom.innerHTML = mmt.format('HH:mm');
                break;
            case '0':
                clockDom.innerHTML = mmt.format('hh:mm A');
                break;
            default:
                clockDom.innerHTML = mmt.format('LT');
                break;
        }



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
    var showScreenlyBanner = function () {
        var partOfScreenlyUserAgent = 'screenly-viewer';
        var playerUserAgent = navigator.userAgent;
        if (playerUserAgent.indexOf(partOfScreenlyUserAgent) === -1) {
            document.querySelector("#banner").style.visibility = 'visible';
        } else {
            document.querySelector("body").style.paddingTop = '0';
        }
    };

    /**
     * Get forecast information
     *
     * @since 0.0.1
     */
    var getForecast = function(lat, lng, lang) {

        // Lets get the forecast for location
        var oReqForecast = window.srly.getForecast(lat, lng, lang);
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

        if (lang) {
            param.lang = lang;
        }

        var oReq = window.srly.getLocalData(param);
        if (oReq) {
            oReq.addEventListener("load", function(e) {
                // register local
                if (e.target.status === 200) {
                    var json = JSON.parse(e.target.response);
                    local = json.properties;
                    if ('lat' in local && 'lng' in local) {
                        getForecast(local.lat, local.lng, local.lang);
                    } else {
                        var latlng = local.location.split(',');
                        getForecast(latlng[0], latlng[1], 'en');
                    }
                }
            });
        }
    }();
})();