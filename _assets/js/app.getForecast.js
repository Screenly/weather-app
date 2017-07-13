(function() {

    window.srly = window.srly || {};

    /**
     * Get forecast for the locaiton provided in latitude and longitude.
     *
     * @param {string || number} [lat] Required. GEO Coordinates for latitude
     * @param {string || number} [lng] Required. GEO Coordinates for longitude
     * @since 0.0.1
     *
     * @return {XMLHttpRequest}
     */
    window.srly.getForecast = function(lat, lng) {

        if (!lat && !lng)  {
            console.warn('srly.getForecast: lat and lng are required parameters');
            return;
        }

        var oReq = new XMLHttpRequest();

        oReq.addEventListener("progress", function(e) {
            if (!e.lengthComputable) {
                console.warn('srly.getForecast: Unable to compute progress information since the total size is unknown');
            }
        });

        oReq.addEventListener("error", function(e) {
            console.error("srly.getForecast: An error occurred.");
        });

        oReq.addEventListener("abort", function(e) {
            console.warn("srly.getForecast: Transfer canceled by the user.");
        });

        oReq.addEventListener("load", function(e) {
            console.log("srly.getForecast: Transfer complete.");
        });

        oReq.open('POST', 'http://localhost:5000/v1/weather', true);
        oReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
        oReq.send(JSON.stringify({ lat: lat, long: lng }));

        return oReq;
    };

})();
