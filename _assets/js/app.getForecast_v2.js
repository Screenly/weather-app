(function() {

    window.srly = window.srly || {};




    /**
     * GLOBAL VARS
     */
     var API_URL = '//weather-backend.srly.io/v1.1/weather';





    /**
     * Get forecast for the locaiton provided in latitude and longitude.
     *
     * @param {string || number} [lat] Required. GEO Coordinates for latitude
     * @param {string || number} [lng] Required. GEO Coordinates for longitude
     * @param {string} [lang] Non-required. Language
     * @since 0.0.1
     *
     * @return {XMLHttpRequest}
     */
    window.srly.getForecast = function(lat, lng, lang) {

        var oReq = new XMLHttpRequest();

        oReq.open('GET', API_URL + "?lat=" + lat + "&lng=" + lng + "&lang=" + lang, true);
        oReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
        // console.log(JSON.stringify({ lat: lat, lng: lng , lang: lang}));
        // oReq.send(JSON.stringify({ lat: lat, lng: lng , lang: lang}));
        oReq.send();

        return oReq;
    };

})();
