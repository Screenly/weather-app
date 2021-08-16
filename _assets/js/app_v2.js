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
//= require app.getLocalData_v2
//= require app.getForecast_v2
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
    var local, forecast, today, current, current_time;
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

        
        var mmt = moment(current.data.time);
        // mmt.tz('Europe/Moscow');

        /**
         * Fill DOM with local info like city name, date, temperatures and next days forecast...
         */
        var localName = local.city || local.country || local.continent;
 
        var eLocation = document.querySelector('#location');
        eLocation.innerHTML = localName;

        var eTemperature = document.querySelector('#temperature');
        eTemperature.innerHTML = Math.round(current.data.instant.details.air_temperature) + "&deg;";

        var eWeatherSummary = document.querySelector('#weather-summary');
        eWeatherSummary.className = 'w-summary w-icon-' + current.data.next_1_hours.summary.symbol_code;

        var eWeatherSummaryText = document.querySelector('.w-summary-text');
        eWeatherSummaryText.innerHTML = current.data.next_1_hours.summary.symbol_code;
        
        var eBody = document.querySelector('body');
        if (current.data.next_1_hours.summary.symbol_code.indexOf('sunny') != -1) {
            eBody.className = 'bg-sunny';
        } else if (current.data.next_1_hours.summary.symbol_code.indexOf('fog') != -1) {
            eBody.className = 'bg-fog';
        } else if (current.data.next_1_hours.summary.symbol_code.indexOf('rain') != -1) {
            eBody.className = 'bg-rain';
        } else if (current.data.next_1_hours.summary.symbol_code.indexOf('snow') != -1) {
            eBody.className = 'bg-snow';
        } else if (current.data.next_1_hours.summary.symbol_code.indexOf('storm') != -1) {
            eBody.className = 'bg-storm';
        } else {
            eBody.className = 'bg-default';
        }
        
        // Get setting
        
        var w_width = window.innerWidth;
        var w_height = window.innerHeight;
        var c_height = 0;
        var mode = (w_width > w_height) ? 'landscape' : 'portrait';
        var s_count = (mode == 'landscape') ? 9 : 6;
        var c_margin = -150;
        var c_xaxis_y = -120;
        var c_series_fontsize = 24;

        // console.log(w_width, w_height);
        
        if (w_height < 1080 || (w_width < 800 && mode == 'portrait')) {
            c_height = 200;
        } else {
            c_height = 400;
        }

        if (w_width < 720) {
            c_margin = -80;
            c_xaxis_y = -80;
        } else if (w_width < 1280 && mode == 'landscape') {
            c_margin = -80;
            c_xaxis_y = -80;
            c_series_fontsize = 20;
        } else if (w_width > 1280 && w_width <= 1920 && mode == 'landscape') {
            c_margin = -155;
            c_xaxis_y = -155;
            c_series_fontsize = 48;
            c_height = 450;
        } else if (w_width > 720 && w_width <= 1080 && mode == 'portrait') {
            c_margin = -150;
            c_xaxis_y = -150;
            c_series_fontsize = 48;
        } else {
            c_margin = -150;
            c_xaxis_y = -90;
            c_series_fontsize = 32;
        }

        var cats = [];
        var temps = [];
        var max_temp = 0;
        for (var i = 0; i < s_count + 2; i++) {
            var f = forecast.properties.timeseries[i];
            var t = f.time;
            var w = f.data.next_1_hours.summary.symbol_code;
            // var temp = Math.round(f.data.instant.details.air_temperature);
            var temp = f.data.instant.details.air_temperature;
            
            var utcTime = moment.utc(t).format('YYYY-MM-DD HH:mm:ss');
            var stillUtc = moment.utc(utcTime).toDate();
            var localTime = moment(stillUtc).local().format('HH:mm');
            cats.push([localTime, w]);
            temps.push(temp);
            // console.log(t, localTime, w, temp);
            if (max_temp < temp) {
                max_temp = temp + 10;
            }
        }

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

        // showScreenlyBanner();

        Highcharts.chart('container', {
            chart: {
                type: 'areaspline',
                style: {
                    fontFamily: 'Barlow'
                },
                backgroundColor: 'transparent',
                margin: [0, c_margin, 0, c_margin],
                spacing: [0, 0, 0, 0],
                height: c_height
            },
            title: {
                text: undefined
            },
            events: {
                load: function () {
                   setInterval(function () {
                      
                   }, 1000);
                }
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: {
                // categories: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
                // categories: [['09:00'], ['10:00'], ['11:00'], ['12:00'], ['13:00'], ['14:00'], ['15:00'], ['16:00'], ['17:00']],
                categories: cats,
                labels: {
                    useHTML: true,
                    formatter: function() {
                        return '<div class="w-icon w-icon-' + this.value[1] + '"></div><span class="w-time">' + this.value[0] + '</span>';
                    },
                    style: {
                        'text-align': 'center',
                        'color': '#ffffff'
                    },
                    y: c_xaxis_y
                },
                tickLength: 0,
                lineColor: 'transparent',
                minPadding: 0,
                maxPadding: 0,
            },
            yAxis: {
                gridLineWidth: 0,
                visible: false,
                max: max_temp
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            return '<span>' + this.y + '&deg;' + '</span>';
                        },
                        style: {
                            color: '#ffffff',
                            fontSize: c_series_fontsize + 'px',
                        },
                        crop: false,
                        overflow: 'allow'
                    }
                },
            },
            tooltip: {
                formatter: function () {
                    return 'The temperature for <strong>' + this.x[0] + '</strong> is <strong>' + this.y + '&deg;' + '</strong>';
                }
            },
            series: [{
                //threshold: null,
                data: temps,
                color: '#000000',
                marker: {
                    enabled: false
                }
            }]
        });
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
        // mmt.tz('Europe/Moscow');
        var mmtTimeConcat = Number(mmt.format('HHmm'));


        /**
         * Draw DOM clock
         */
        // switch (clock_format_24h) {
        //     case '1':
        //         current_time = mmt.format('HH:mm');
        //         break;
        //     case '0':
        //         current_time = mmt.format('hh:mm A');
        //         break;
        //     default:
        //         current_time = mmt.format('LT');
        //         break;
        // }
        current_time = mmt.format('HH:mm') + ' &bull; ' + mmt.format('ddd, MMM DD');
        clockDom.innerHTML = current_time;


        /**
         * Credits year
         */
        //creditsYearDom.innerHTML = mmt.format('YYYY');



        /**
         * Change background image based on time
         */
        // var daytime = window.srly.getDayTime (
        //     'Europe/Moscow',
        //     today.sunriseTime,
        //     today.sunsetTime
        // );

        // if (daytime.sunset || daytime.sunrise) {
        //     html.className = 'bg-sunset';
        // } else if (daytime.daylight) {
        //     html.className = 'bg-day';
        // } else {
        //     html.className = 'bg-night';
        // }
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
                current = forecast.properties.timeseries[0];

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